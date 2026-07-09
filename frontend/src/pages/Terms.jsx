const sections = [
  {
    title: 'Acceptance of terms',
    body: 'By creating an account or using HireHub, you agree to these Terms of Service. If you do not agree, please do not use the platform. These terms apply to candidates, recruiters, and all visitors.',
  },
  {
    title: 'Your account',
    body: 'You are responsible for the accuracy of the information you provide and for keeping your login credentials secure. You must be at least 18 years old, or the age of majority in your jurisdiction, to use HireHub.',
  },
  {
    title: 'Acceptable use',
    body: 'You agree not to post false, misleading, or unlawful content, scrape the platform, attempt to disrupt the service, or use HireHub to harass others. Job postings must describe genuine opportunities and comply with applicable employment laws.',
  },
  {
    title: 'Content & ownership',
    body: 'You retain ownership of the content you submit, such as your resume and profile. By posting it, you grant HireHub a license to display and process it for the purpose of operating the service — for example, showing your application to a recruiter you apply to.',
  },
  {
    title: 'Recruiter responsibilities',
    body: 'Recruiters must handle candidate data responsibly, use it only for legitimate hiring purposes, and comply with anti-discrimination and data-protection laws. Misuse of candidate information may result in account suspension.',
  },
  {
    title: 'Disclaimers',
    body: 'HireHub is a platform that connects candidates and recruiters; we do not guarantee employment, the accuracy of any posting, or the conduct of any user. The service is provided on an “as is” and “as available” basis.',
  },
  {
    title: 'Limitation of liability',
    body: 'To the maximum extent permitted by law, HireHub is not liable for indirect, incidental, or consequential damages arising from your use of the platform, including any hiring or employment decisions.',
  },
  {
    title: 'Termination',
    body: 'You may close your account at any time. We may suspend or terminate accounts that violate these terms. Provisions that by their nature should survive termination will continue to apply.',
  },
];

const Terms = () => (
  <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
    {/* ===== Hero ===== */}
    <section className="bg-ink-50 dark:bg-[#11161f] border-b border-ink-200 dark:border-[#262c36]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-3">Legal</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink-900 dark:text-white text-balance leading-[1.1]">
          Terms of Service
        </h1>
        <p className="mt-5 text-lg text-ink-600 dark:text-ink-400 max-w-2xl mx-auto text-balance">
          The ground rules for using HireHub — for candidates and recruiters alike.
        </p>
      </div>
    </section>

    {/* ===== Content ===== */}
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-sm text-ink-500 dark:text-ink-400 mb-10">Last updated: June 2026</p>
      <div className="space-y-10">
        {sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-xl font-semibold text-ink-900 dark:text-white mb-2.5 flex items-baseline gap-2.5">
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              {s.title}
            </h2>
            <p className="text-ink-600 dark:text-ink-400 leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
      <div className="mt-12 pt-6 border-t border-ink-200 dark:border-[#262c36] text-sm text-ink-500 dark:text-ink-400">
        Need clarification? Get in touch via the <a href="/contact" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Contact</a> page.
      </div>
    </div>
  </div>
);

export default Terms;
