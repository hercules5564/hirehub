import { useMemo, useState } from 'react';
import {
  HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineXCircle,
  HiOutlineSparkles, HiOutlineBriefcase, HiOutlineChevronDown,
} from 'react-icons/hi';
import { computeAtsScore } from '../../utils/atsScore';

const TONE = {
  good: { text: 'text-emerald-400', bar: 'bg-emerald-500', ring: '#10b981', Icon: HiOutlineCheckCircle },
  warn: { text: 'text-amber-400', bar: 'bg-amber-500', ring: '#f59e0b', Icon: HiOutlineExclamationCircle },
  bad: { text: 'text-rose-400', bar: 'bg-rose-500', ring: '#ef4444', Icon: HiOutlineXCircle },
};

// Conic-gradient ring — no SVG math, scales cleanly, respects dark mode.
const ScoreRing = ({ score, tone, size = 104 }) => {
  const color = TONE[tone].ring;
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, background: `conic-gradient(${color} ${score * 3.6}deg, rgba(148,163,184,0.18) 0deg)` }}
    >
      <div className="rounded-full bg-[#0a0a0a] flex flex-col items-center justify-center" style={{ width: size - 18, height: size - 18 }}>
        <span className={`text-2xl font-bold ${TONE[tone].text}`}>{score}</span>
        <span className="text-[10px] uppercase tracking-wider text-white/50">/ 100</span>
      </div>
    </div>
  );
};

const CategoryRow = ({ cat }) => {
  const [open, setOpen] = useState(false);
  const tone = TONE[cat.status];
  const pct = Math.round((cat.score / cat.max) * 100);
  const hasTips = cat.tips.length > 0;
  return (
    <div className="py-2.5 border-b border-white/[0.08] last:border-0">
      <button
        onClick={() => hasTips && setOpen((o) => !o)}
        className={`w-full flex items-center gap-3 text-left ${hasTips ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <tone.Icon className={`w-4 h-4 flex-shrink-0 ${tone.text}`} />
        <span className="text-sm text-white/70 flex-1">{cat.label}</span>
        <span className="text-xs font-semibold text-white/60 tabular-nums">{cat.score}/{cat.max}</span>
        {hasTips && <HiOutlineChevronDown className={`w-4 h-4 text-white/50 transition-transform ${open ? 'rotate-180' : ''}`} />}
      </button>
      <div className="mt-1.5 ml-7 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div className={`h-full rounded-full ${tone.bar} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      {open && hasTips && (
        <ul className="mt-2 ml-7 space-y-1">
          {cat.tips.map((t, i) => (
            <li key={i} className="text-xs text-white/60 flex gap-1.5">
              <span className="text-indigo-400 mt-0.5">→</span>{t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Chip = ({ children, variant }) => (
  <span
    className={`text-xs px-2 py-0.5 rounded-full ${
      variant === 'matched'
        ? 'bg-emerald-500/15 text-emerald-300'
        : 'bg-rose-500/15 text-rose-300'
    }`}
  >
    {children}
  </span>
);

const AtsScorePanel = ({ data }) => {
  const [jd, setJd] = useState('');
  const [showJd, setShowJd] = useState(false);
  const result = useMemo(() => computeAtsScore(data, jd), [data, jd]);
  const { overall, label, categories, jobMatch } = result;
  const matchTone = jobMatch ? (jobMatch.score >= 70 ? 'good' : jobMatch.score >= 40 ? 'warn' : 'bad') : 'warn';

  return (
    <section className="bg-white/[0.03] rounded-2xl p-6 border border-white/[0.1] print:hidden">
      <div className="flex items-center gap-2 mb-4">
        <HiOutlineSparkles className="w-5 h-5 text-indigo-400" />
        <h3 className="font-bold text-white">ATS Score</h3>
        <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${TONE[label.tone].text} bg-white/[0.06]`}>
          {label.text}
        </span>
      </div>

      {/* Overall */}
      <div className="flex items-center gap-5 mb-5">
        <ScoreRing score={overall} tone={label.tone} />
        <p className="text-sm text-white/60 leading-relaxed">
          How well your resume reads to an automated applicant tracking system. Expand any row below for tips to raise it.
        </p>
      </div>

      {/* Category breakdown */}
      <div>
        {categories.map((c) => <CategoryRow key={c.key} cat={c} />)}
      </div>

      {/* Job match */}
      <div className="mt-5 pt-4 border-t border-white/[0.08]">
        <button
          onClick={() => setShowJd((s) => !s)}
          className="w-full flex items-center gap-2 text-sm font-medium text-white/70"
        >
          <HiOutlineBriefcase className="w-4 h-4 text-indigo-400" />
          Match against a job description
          <HiOutlineChevronDown className={`w-4 h-4 text-white/50 ml-auto transition-transform ${showJd ? 'rotate-180' : ''}`} />
        </button>

        {showJd && (
          <div className="mt-3">
            <textarea
              rows={4}
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the job description here to see how many of its keywords your resume covers…"
              className="w-full px-3 py-2 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none text-sm resize-none"
            />

            {jobMatch && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white/70">
                    Keyword match
                    <span className="font-normal text-white/50"> · {jobMatch.matched.length}/{jobMatch.total} keywords</span>
                  </span>
                  <span className={`text-lg font-bold ${TONE[matchTone].text}`}>{jobMatch.score}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden mb-4">
                  <div className={`h-full rounded-full ${TONE[matchTone].bar} transition-all`} style={{ width: `${jobMatch.score}%` }} />
                </div>

                {jobMatch.missing.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5">
                      Missing keywords — add these if relevant
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {jobMatch.missing.slice(0, 18).map((k) => <Chip key={k} variant="missing">{k}</Chip>)}
                    </div>
                  </div>
                )}

                {jobMatch.matched.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5">
                      Matched keywords
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {jobMatch.matched.slice(0, 18).map((k) => <Chip key={k} variant="matched">{k}</Chip>)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AtsScorePanel;
