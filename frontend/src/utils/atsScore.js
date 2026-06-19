// ATS (Applicant Tracking System) resume scoring — pure client-side heuristics.
//
// Two independent scores are produced from the Resume Builder's `data` object:
//   1. A general ATS-readiness score (0-100) graded across six weighted categories.
//   2. An optional job-match score (0-100) when a target job description is supplied,
//      based on how many of the JD's keywords appear in the resume.
//
// Everything here is deterministic and runs in the browser — no network, no API key.

import { SKILLS_LIST } from './constants';

// Strong, ATS-friendly action verbs recruiters/parsers look for in bullet points.
const ACTION_VERBS = [
  'led', 'built', 'designed', 'developed', 'created', 'launched', 'implemented',
  'managed', 'improved', 'increased', 'reduced', 'optimized', 'delivered', 'shipped',
  'architected', 'automated', 'scaled', 'drove', 'owned', 'spearheaded', 'mentored',
  'migrated', 'refactored', 'engineered', 'streamlined', 'boosted', 'achieved',
  'analyzed', 'collaborated', 'coordinated', 'established', 'generated', 'initiated',
  'negotiated', 'resolved', 'transformed', 'won',
];

// Vague filler that weakens a resume and adds no ATS keyword value.
const CLICHES = [
  'team player', 'hard working', 'hardworking', 'go-getter', 'detail oriented',
  'detail-oriented', 'responsible for', 'duties included', 'results-driven',
  'self-motivated', 'think outside the box', 'synergy', 'go getter', 'fast learner',
];

// Common English words excluded from job-description keyword extraction.
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can', 'her', 'was',
  'one', 'our', 'out', 'who', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now',
  'old', 'see', 'two', 'way', 'use', 'with', 'will', 'this', 'that', 'have', 'from',
  'they', 'been', 'were', 'what', 'when', 'your', 'their', 'them', 'than', 'then',
  'into', 'more', 'some', 'such', 'only', 'over', 'also', 'work', 'team', 'role',
  'must', 'should', 'would', 'could', 'about', 'which', 'while', 'these', 'those',
  'within', 'across', 'using', 'years', 'year', 'experience', 'strong', 'good',
  'excellent', 'ability', 'skills', 'skill', 'job', 'candidate', 'looking', 'join',
  'including', 'plus', 'etc', 'well', 'help', 'build', 'building', 'working',
  'need', 'needs', 'require', 'required', 'requirements', 'want', 'seeking',
  'preferred', 'responsibilities', 'qualifications',
]);

// Tokenize, keeping internal dots/#/+ (node.js, c#, c++) but stripping
// sentence punctuation that would otherwise stick to a word (e.g. "react.").
const words = (s) =>
  ((s || '').toLowerCase().match(/[a-z0-9.+#]+/g) || [])
    .map((w) => w.replace(/^\.+|\.+$/g, ''))
    .filter(Boolean);
const wordCount = (s) => words(s).join(' ').split(/\s+/).filter(Boolean).length;
const hasNumber = (s) => /\d/.test(s || '');

// Flatten every resume field into one lowercased searchable blob.
const resumeText = (data) =>
  [
    data.fullName, data.title, data.summary,
    ...data.experience.flatMap((e) => [e.title, e.company, e.location, e.description]),
    ...data.education.flatMap((e) => [e.degree, e.field, e.institution]),
    ...data.skills,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

const expText = (data) =>
  [data.summary, ...data.experience.map((e) => e.description)].filter(Boolean).join(' ');

const status = (score, max) => {
  const r = max === 0 ? 0 : score / max;
  if (r >= 0.8) return 'good';
  if (r >= 0.45) return 'warn';
  return 'bad';
};

const clamp = (n, max) => Math.max(0, Math.min(max, n));

/* ---------------------- general category scorers ---------------------- */

const scoreContact = (data) => {
  let score = 0;
  const tips = [];
  const emailOk = /\S+@\S+\.\S+/.test(data.email || '');
  if (emailOk) score += 5;
  else tips.push('Add a valid email address — ATS parsers key off it.');
  if (data.phone?.trim()) score += 4;
  else tips.push('Add a phone number.');
  if (data.location?.trim()) score += 3;
  else tips.push('Add your location (City, Country).');
  if ([data.website, data.linkedin, data.github].some((l) => l?.trim())) score += 3;
  else tips.push('Add at least one link (LinkedIn, GitHub, or portfolio).');
  return { key: 'contact', label: 'Contact info', score, max: 15, tips };
};

const scoreSummary = (data) => {
  const wc = wordCount(data.summary);
  let score = 0;
  const tips = [];
  if (wc === 0) {
    tips.push('Add a professional summary (aim for 30–80 words).');
  } else if (wc < 30) {
    score = 9;
    tips.push('Expand your summary to 30–80 words for better keyword coverage.');
  } else if (wc <= 90) {
    score = 15;
  } else {
    score = 11;
    tips.push('Trim your summary to under ~90 words — it runs long.');
  }
  return { key: 'summary', label: 'Professional summary', score, max: 15, tips };
};

const scoreExperience = (data) => {
  const exps = data.experience.filter((e) => e.title || e.company);
  const tips = [];
  if (exps.length === 0) {
    return {
      key: 'experience', label: 'Work experience', score: 0, max: 25,
      tips: ['Add at least one work experience entry with a title and company.'],
    };
  }
  let score = 8; // has at least one entry
  const complete = exps.filter((e) => e.title && e.company);
  if (complete.length === exps.length) score += 3;
  else tips.push('Give every experience entry both a job title and a company.');

  const withDates = exps.filter((e) => e.start || e.end);
  if (withDates.length === exps.length) score += 4;
  else tips.push('Add start/end dates to each role — gaps confuse ATS parsers.');

  const withDesc = exps.filter((e) => (e.description || '').trim().length > 0);
  if (withDesc.length === exps.length) score += 5;
  else if (withDesc.length > 0) { score += 3; tips.push('Add bullet points describing every role.'); }
  else tips.push('Describe what you did and achieved in each role.');

  const quantified = exps.some((e) => hasNumber(e.description));
  if (quantified) score += 5;
  else tips.push('Quantify impact with numbers (e.g. "cut load time by 40%").');

  return { key: 'experience', label: 'Work experience', score: clamp(score, 25), max: 25, tips };
};

const scoreEducation = (data) => {
  const edus = data.education.filter((e) => e.degree || e.institution);
  if (edus.length === 0) {
    return { key: 'education', label: 'Education', score: 0, max: 10, tips: ['Add at least one education entry.'] };
  }
  const full = edus.every((e) => e.degree && e.institution);
  return {
    key: 'education', label: 'Education',
    score: full ? 10 : 6, max: 10,
    tips: full ? [] : ['List both the degree and institution for each education entry.'],
  };
};

const scoreSkills = (data) => {
  const n = data.skills.length;
  const tips = [];
  let score;
  if (n === 0) { score = 0; tips.push('Add your skills — this is the #1 thing ATS keyword filters scan.'); }
  else if (n >= 8) score = 15;
  else { score = Math.round((n / 8) * 15); tips.push(`Add more skills (you have ${n}; aim for 8+).`); }
  return { key: 'skills', label: 'Skills', score, max: 15, tips };
};

const scoreImpact = (data) => {
  const text = expText(data);
  const lower = text.toLowerCase();
  const tips = [];
  let score = 0;

  // Quantified results anywhere in summary/experience.
  if (/\d/.test(text)) score += 6;
  else tips.push('Add measurable results (numbers, %, $, time saved).');

  // Distinct action verbs used.
  const verbs = new Set(ACTION_VERBS.filter((v) => new RegExp(`\\b${v}\\b`).test(lower)));
  if (verbs.size >= 3) score += 6;
  else if (verbs.size > 0) { score += 3; tips.push('Open more bullets with strong action verbs (Led, Built, Improved…).'); }
  else tips.push('Start bullet points with strong action verbs (Led, Built, Improved…).');

  // Overall length — too thin or bloated both hurt.
  const total = wordCount(resumeText(data));
  if (total >= 150 && total <= 800) score += 5;
  else if (total > 0) { score += 2; tips.push(total < 150 ? 'Resume looks thin — add more detail (aim 150+ words).' : 'Resume is very long — tighten it toward 1 page.'); }
  else tips.push('Resume is empty — fill in your details.');

  // Penalize clichés / filler.
  const found = CLICHES.filter((c) => lower.includes(c));
  if (found.length === 0) score += 3;
  else tips.push(`Replace vague phrases (${found.slice(0, 2).join(', ')}) with concrete achievements.`);

  return { key: 'impact', label: 'Formatting & impact', score: clamp(score, 20), max: 20, tips };
};

/* ---------------------- job-description keyword match ---------------------- */

const extractKeywords = (jd) => {
  const lower = (jd || '').toLowerCase();
  const keywords = new Map(); // display -> isSkill

  // 1. Known skills mentioned in the JD (highest priority, multi-word aware).
  for (const skill of SKILLS_LIST) {
    if (lower.includes(skill.toLowerCase())) keywords.set(skill, true);
  }

  // 2. Other significant single tokens, ranked by frequency.
  const freq = new Map();
  for (const w of words(jd)) {
    if (w.length < 3 || STOP_WORDS.has(w) || /^\d+$/.test(w)) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  const known = new Set([...keywords.keys()].map((k) => k.toLowerCase()));
  [...freq.entries()]
    .filter(([w]) => !known.has(w))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .forEach(([w]) => keywords.set(w, false));

  return [...keywords.entries()].map(([term, isSkill]) => ({ term, isSkill }));
};

export const scoreJobMatch = (data, jobDescription) => {
  if (!jobDescription || !jobDescription.trim()) return null;
  const keywords = extractKeywords(jobDescription);
  if (keywords.length === 0) return null;

  const text = resumeText(data);
  const matched = [];
  const missing = [];
  for (const kw of keywords) {
    const present = text.includes(kw.term.toLowerCase());
    (present ? matched : missing).push(kw);
  }

  const score = Math.round((matched.length / keywords.length) * 100);
  // Surface skills before generic terms in the "missing" list (more actionable).
  const sortFn = (a, b) => Number(b.isSkill) - Number(a.isSkill);
  return {
    score,
    total: keywords.length,
    matched: matched.sort(sortFn).map((k) => k.term),
    missing: missing.sort(sortFn).map((k) => k.term),
  };
};

/* ---------------------- public entry point ---------------------- */

export const scoreLabel = (score) => {
  if (score >= 85) return { text: 'Excellent', tone: 'good' };
  if (score >= 70) return { text: 'Good', tone: 'good' };
  if (score >= 50) return { text: 'Needs work', tone: 'warn' };
  return { text: 'Poor', tone: 'bad' };
};

export const computeAtsScore = (data, jobDescription = '') => {
  const categories = [
    scoreContact(data),
    scoreSummary(data),
    scoreExperience(data),
    scoreEducation(data),
    scoreSkills(data),
    scoreImpact(data),
  ].map((c) => ({ ...c, status: status(c.score, c.max) }));

  const total = categories.reduce((s, c) => s + c.score, 0);
  const max = categories.reduce((s, c) => s + c.max, 0);
  const overall = Math.round((total / max) * 100);

  return {
    overall,
    label: scoreLabel(overall),
    categories,
    jobMatch: scoreJobMatch(data, jobDescription),
  };
};
