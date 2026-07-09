import { useState } from 'react';
import { HiOutlineMail, HiOutlineLocationMarker, HiOutlinePhone, HiOutlinePaperAirplane } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { sendContactMessageAPI } from '../services/api';

const inputClass = 'w-full rounded-lg border border-ink-300 dark:border-[#262c36] bg-white dark:bg-[#0d1117] px-3.5 py-2.5 text-ink-900 dark:text-white placeholder-ink-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition text-sm';
const labelClass = 'block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error('Please fill required fields');
    setSending(true);
    try {
      await sendContactMessageAPI(form);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
      {/* ===== Hero ===== */}
      <section className="bg-ink-50 dark:bg-[#11161f] border-b border-ink-200 dark:border-[#262c36]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-3">Contact us</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink-900 dark:text-white text-balance leading-[1.1]">
            Get in touch
          </h1>
          <p className="mt-5 text-lg text-ink-600 dark:text-ink-400 max-w-xl mx-auto text-balance">
            Have questions? We'd love to hear from you. Our team typically replies within one business day.
          </p>
        </div>
      </section>

      {/* ===== Body ===== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Contact Info */}
          <div className="space-y-4">
            {[
              { icon: HiOutlineMail, title: 'Email', info: 'hirhubsupport@gmail.com' },
              { icon: HiOutlinePhone, title: 'Phone', info: '+91 1800-123-4567' },
              { icon: HiOutlineLocationMarker, title: 'Address', info: 'Bangalore, Karnataka, India' },
            ].map((c, i) => (
              <div key={i} className="rounded-xl p-5 bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36]">
                <span className="w-11 h-11 rounded-lg bg-primary-50 dark:bg-primary-600/10 flex items-center justify-center mb-3">
                  <c.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </span>
                <h3 className="font-semibold text-ink-900 dark:text-white">{c.title}</h3>
                <p className="text-sm text-ink-600 dark:text-ink-400 mt-0.5">{c.info}</p>
              </div>
            ))}

            {/* Support hours card */}
            <div className="rounded-xl p-5 bg-primary-50 dark:bg-primary-600/10 border border-primary-100 dark:border-primary-600/20">
              <h3 className="font-semibold text-ink-900 dark:text-white mb-1">Support Hours</h3>
              <p className="text-sm text-ink-600 dark:text-ink-400">Mon - Fri, 9:00 AM - 6:00 PM IST</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-8">
            <h2 className="text-xl font-semibold text-ink-900 dark:text-white mb-1">Send us a message</h2>
            <p className="text-sm text-ink-600 dark:text-ink-400 mb-6">Fill out the form and we'll be in touch shortly.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Subject</label>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Message *</label>
                <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputClass} resize-none`} />
              </div>
              <button type="submit" disabled={sending} className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-60">
                {sending ? 'Sending…' : (<><HiOutlinePaperAirplane className="w-5 h-5 -rotate-45" /> Send Message</>)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
