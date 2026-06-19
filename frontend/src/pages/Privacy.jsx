import { HiOutlineShieldCheck } from 'react-icons/hi';

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
  <div className="min-h-screen bg-[#030303] text-white">
    {/* ===== Hero ===== */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 right-10 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl"></div>
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-28 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 border border-white/[0.1] px-3 py-1 rounded-full mb-6">
          <HiOutlineShieldCheck className="w-4 h-4" /> Legal
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-6 text-balance text-white">
          Privacy <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Policy</span>
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto text-balance">
          Your privacy matters. Here's what we collect, why, and how we protect it.
        </p>
      </div>
    </section>

    {/* ===== Content ===== */}
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
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
          Questions about your privacy? Reach us via the <a href="/contact" className="text-indigo-300 font-medium hover:underline">Contact</a> page.
        </div>
      </div>
    </div>
  </div>
);

export default Privacy;
