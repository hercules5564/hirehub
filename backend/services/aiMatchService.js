// Resume <-> Job matching.
// Uses Google Gemini (free tier) when GEMINI_API_KEY is set; otherwise — or on
// ANY error / timeout / rate-limit — falls back to a deterministic local keyword
// scorer, so the feature always works (and no candidate data leaves the server
// in fallback mode). Returns { score, matched, missing, reasoning, engine }.

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

// Light synonym normalization so equivalent skills match.
const SYNONYMS = {
  js: 'javascript', reactjs: 'react', nodejs: 'node', 'node.js': 'node',
  expressjs: 'express', ts: 'typescript', k8s: 'kubernetes', postgres: 'postgresql',
  psql: 'postgresql', tailwindcss: 'tailwind', 'next.js': 'nextjs', 'vue.js': 'vue',
  gcp: 'google cloud', 'c sharp': 'c#',
};
const norm = (s) => {
  const t = String(s || '').toLowerCase().trim();
  return SYNONYMS[t] || t;
};

const tokenize = (text) => String(text || '').toLowerCase().match(/[a-z0-9.#+]+/g) || [];

// Flatten a candidate into one searchable string (skills + experience + education + bio).
function candidateText(c) {
  const parts = [];
  if (Array.isArray(c.skills)) parts.push(...c.skills);
  if (Array.isArray(c.experience)) c.experience.forEach((e) => parts.push(e && e.title, e && e.company, e && e.description));
  if (Array.isArray(c.education)) c.education.forEach((e) => parts.push(e && e.degree, e && e.field, e && e.institution));
  if (c.bio) parts.push(c.bio);
  return parts.filter(Boolean).join(' ').toLowerCase();
}

// Word-boundary presence test — avoids "java" matching inside "javascript".
function hasTerm(blob, term) {
  const t = String(term || '').toLowerCase().trim();
  if (!t) return false;
  const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(blob);
}

function keywordScore(candidate, job) {
  const blob = candidateText(candidate);
  const candSkills = new Set((candidate.skills || []).map(norm));
  const required = (job.skillsRequired || []).filter(Boolean);

  if (required.length) {
    const matched = [];
    const missing = [];
    required.forEach((skill) => {
      const n = norm(skill);
      const hit = candSkills.has(n) || hasTerm(blob, skill) || hasTerm(blob, n);
      (hit ? matched : missing).push(skill);
    });
    const score = Math.round((matched.length / required.length) * 100);
    return { score, matched, missing, reasoning: `${matched.length}/${required.length} required skills present in profile.`, engine: 'keyword' };
  }

  // No structured skills on the job — fall back to JD keyword overlap.
  const jdTokens = [...new Set(tokenize(`${job.title} ${job.description} ${job.requirements}`))].filter((t) => t.length > 2);
  const overlap = jdTokens.filter((t) => hasTerm(blob, t));
  const score = jdTokens.length ? Math.round((overlap.length / jdTokens.length) * 100) : 0;
  return { score, matched: overlap.slice(0, 10), missing: [], reasoning: 'Keyword overlap with the job description.', engine: 'keyword' };
}

async function geminiScore(candidate, job) {
  const key = process.env.GEMINI_API_KEY;
  if (!key || /your_/i.test(key)) throw new Error('GEMINI_API_KEY not configured');

  // Send only professional signal (no name/email/phone).
  const profile = {
    skills: candidate.skills || [],
    experience: (candidate.experience || []).slice(0, 6).map((e) => ({ title: e && e.title, company: e && e.company, description: e && e.description })),
    education: (candidate.education || []).slice(0, 4).map((e) => ({ degree: e && e.degree, field: e && e.field })),
    bio: candidate.bio || '',
    location: candidate.location || '',
  };
  const jd = {
    title: job.title,
    skillsRequired: job.skillsRequired || [],
    description: job.description,
    requirements: job.requirements || '',
    experienceRequired: job.experienceRequired || {},
  };

  const prompt =
    'You are a recruitment matching assistant. Compare the CANDIDATE to the JOB and rate fit from 0 to 100 ' +
    '(100 = perfect fit). Consider skill overlap, experience relevance, and seniority. List the job requirements the ' +
    'candidate clearly meets (matched) and important ones they appear to lack (missing). Give a concise one-sentence reasoning.\n\n' +
    `CANDIDATE:\n${JSON.stringify(profile)}\n\nJOB:\n${JSON.stringify(jd)}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          score: { type: 'INTEGER' },
          matched: { type: 'ARRAY', items: { type: 'STRING' } },
          missing: { type: 'ARRAY', items: { type: 'STRING' } },
          reasoning: { type: 'STRING' },
        },
        required: ['score', 'matched', 'missing', 'reasoning'],
      },
    },
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: controller.signal }
    );
    if (!resp.ok) throw new Error(`Gemini HTTP ${resp.status}`);
    const data = await resp.json();
    const text = data && data.candidates && data.candidates[0] && data.candidates[0].content
      && data.candidates[0].content.parts && data.candidates[0].content.parts[0]
      && data.candidates[0].content.parts[0].text;
    if (!text) throw new Error('Empty Gemini response');
    const parsed = JSON.parse(text);
    const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)));
    return {
      score,
      matched: Array.isArray(parsed.matched) ? parsed.matched.slice(0, 12) : [],
      missing: Array.isArray(parsed.missing) ? parsed.missing.slice(0, 12) : [],
      reasoning: String(parsed.reasoning || '').slice(0, 400),
      engine: 'gemini',
    };
  } finally {
    clearTimeout(timer);
  }
}

async function scoreMatch(candidate, job) {
  if (!candidate || !job) return { score: 0, matched: [], missing: [], reasoning: '', engine: 'keyword' };
  try {
    return await geminiScore(candidate, job);
  } catch (err) {
    return keywordScore(candidate, job);
  }
}

module.exports = { scoreMatch, keywordScore };
