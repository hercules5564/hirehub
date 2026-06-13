import { useState } from 'react';
import { HiOutlineMail, HiOutlineLocationMarker, HiOutlinePhone } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error('Please fill required fields');
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-4">Get in <span className="gradient-text">Touch</span></h1>
          <p className="text-lg text-dark-500">Have questions? We'd love to hear from you.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6 animate-fade-in">
            {[
              { icon: HiOutlineMail, title: 'Email', info: 'support@hirehub.com', color: 'from-blue-500 to-indigo-600' },
              { icon: HiOutlinePhone, title: 'Phone', info: '+91 1800-123-4567', color: 'from-purple-500 to-pink-600' },
              { icon: HiOutlineLocationMarker, title: 'Address', info: 'Bangalore, Karnataka, India', color: 'from-emerald-500 to-teal-600' },
            ].map((c, i) => (
              <div key={i} className="bg-white dark:bg-dark-800 rounded-2xl p-5 border border-gray-100 dark:border-dark-700 card-hover">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3`}>
                  <c.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-dark-900 dark:text-white">{c.title}</h3>
                <p className="text-sm text-dark-500">{c.info}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-100 dark:border-dark-700 animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-700 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-700 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Subject</label>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-700 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Message *</label>
                <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-700 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm resize-none" />
              </div>
              <button type="submit" className="btn-primary w-full justify-center">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
