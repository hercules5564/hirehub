const sections = [
  {
    title: 'Information we collect',
    body: 'We collect information you provide directly — such as your name, email, resume, work history, and skills — as well as data generated when you use HireHub, including jobs you view, applications you submit, and basic device and usage information.',
  },
  {
    title: 'How we use your information',
    body: 'Your information is used to operate the platform: matching you with relevant jobs, sharing applications with recruiters you apply to, computing your resume ATS score, sending notifications you opt into, and improving our services. We never sell your personal data.',
  },
  {
    title: 'Sharing with recruiters',
    body: 'When you apply to a job, the recruiter for that posting can view your application, profile, and resume. Recruiters may also discover candidate profiles that match their openings. You control what is on your profile and can update or remove it at any time.',
  },
  {
    title: 'Data security',
    body: 'Passwords are hashed, data is transmitted over encrypted connections, and access to systems is restricted. While no method of transmission is 100% secure, we work continuously to protect your information using industry-standard safeguards.',
  },
  {
    title: 'Your rights & choices',
    body: 'You can access, update, or delete your account data from your profile and settings at any time. You may also unsubscribe from marketing emails and request a copy or deletion of your data by contacting us.',
  },
  {
    title: 'Cookies',
    body: 'We use essential cookies to keep you signed in and remember preferences such as theme. We may use analytics cookies to understand how the product is used so we can improve it.',
  },
  {
    title: 'Changes to this policy',
    body: 'We may update this Privacy Policy from time to time. Material changes will be communicated through the platform, and the “last updated” date below will reflect the latest revision.',
  },
];

const Privacy = () => (
  <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
    {/* ===== Hero ===== */}
    <section className="bg-ink-50 dark:bg-[#11161f] border-b border-ink-200 dark:border-[#262c36]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-3">Legal</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink-900 dark:text-white text-balance leading-[1.1]">
          Privacy Policy
        </h1>
        <p className="mt-5 text-lg text-ink-600 dark:text-ink-400 max-w-2xl mx-auto text-balance">
          Your privacy matters. Here's what we collect, why, and how we protect it.
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
        Questions about your privacy? Reach us via the <a href="/contact" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Contact</a> page.
      </div>
    </div>
  </div>
);

export default Privacy;
