import { HiOutlineDocumentText } from 'react-icons/hi';

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
  <div className="min-h-screen bg-[#030303] text-white">
    {/* ===== Hero ===== */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 right-10 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl"></div>
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 border border-white/[0.1] px-3 py-1 rounded-full mb-6">
          <HiOutlineDocumentText className="w-4 h-4" /> Legal
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-6 text-balance text-white">
          Terms of <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Service</span>
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto text-balance">
          The ground rules for using HireHub — for candidates and recruiters alike.
        </p>
      </div>
    </section>

    {/* ===== Content ===== */}
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
      <div className="relative overflow-hidden bg-white/[0.03] border border-white/[0.1] rounded-2xl p-8 sm:p-10">
        <p className="text-sm text-white/50 mb-8">Last updated: June 2026</p>
        <div className="space-y-8">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-indigo-400">{String(i + 1).padStart(2, '0')}</span>
                {s.title}
              </h2>
              <p className="text-white/70 leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-white/[0.08] text-sm text-white/60">
          Need clarification? Get in touch via the <a href="/contact" className="text-indigo-300 font-medium hover:underline">Contact</a> page.
        </div>
      </div>
    </div>
  </div>
);

export default Terms;
