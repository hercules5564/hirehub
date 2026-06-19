import { useState } from 'react';
import { HiOutlineMail, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineChatAlt2, HiOutlinePaperAirplane } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { ShaderCanvas } from '@/components/ui/interactive-shader';
import { sendContactMessageAPI } from '../services/api';

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
    <div className="relative min-h-screen overflow-hidden bg-[#030303] text-white pt-24">
      {/* Interactive WebGL shader background (mouse-reactive flow field) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <ShaderCanvas hue={248} speed={0.3} intensity={0.75} complexity={5} />
        {/* Dim + vignette so the form stays readable */}
        <div className="absolute inset-0 bg-[#030303]/70"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/50 via-transparent to-[#030303]"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full mb-4">
            <HiOutlineChatAlt2 className="w-4 h-4" /> Contact Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 text-balance">Get in <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">Touch</span></h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto text-balance">Have questions? We'd love to hear from you. Our team typically replies within one business day.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: HiOutlineMail, title: 'Email', info: 'hirhubsupport@gmail.com' },
              { icon: HiOutlinePhone, title: 'Phone', info: '+91 1800-123-4567' },
              { icon: HiOutlineLocationMarker, title: 'Address', info: 'Bangalore, Karnataka, India' },
            ].map((c, i) => (
              <div key={i} className="group bg-white/[0.03] border border-white/[0.1] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center mb-3 text-white shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                  <c.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white">{c.title}</h3>
                <p className="text-sm text-white/60">{c.info}</p>
              </div>
            ))}

            {/* Support hours card */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 text-white p-5 shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] overflow-hidden relative">
              <div className="relative">
                <h3 className="font-semibold text-white mb-1">Support Hours</h3>
                <p className="text-sm text-white/80">Mon - Fri, 9:00 AM - 6:00 PM IST</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.1] rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-1">Send us a message</h2>
            <p className="text-sm text-white/60 mb-6">Fill out the form and we'll be in touch shortly.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none text-sm transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none text-sm transition-shadow" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Subject</label>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none text-sm transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Message *</label>
                <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400/60 outline-none text-sm resize-none transition-shadow" />
              </div>
              <button type="submit" disabled={sending} className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]">
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
