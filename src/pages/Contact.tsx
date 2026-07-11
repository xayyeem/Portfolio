import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Linkedin, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import RevealText from '../components/RevealText';
import { supabase } from '../lib/supabase';
import { useSocials } from '../lib/hooks';
import { SITE } from '../lib/constants';

const PROJECT_TYPES = [
  'Full-Stack Web App',
  'Backend / API',
  '.NET Application',
  'Database Work',
  'API Integration',
  'Maintenance & Optimization',
  'Other',
];

const BUDGET_RANGES = [
  'Under $1,000',
  '$1,000 - $5,000',
  '$5,000 - $10,000',
  '$10,000+',
  'Let\'s discuss',
];

const SOCIAL_ICONS = { Github, Linkedin, Mail };

export default function Contact() {
  const { data: socials } = useSocials();
  const [form, setForm] = useState<Record<string, string>>({
    name: '', email: '', company: '', project_type: '', budget_range: '', message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: string) => (e: any) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();
  //   if (!validate()) return;

  //   setStatus('loading');
  //   setErrorMsg('');

  //   try {
  //     // const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact-submit`;
  //     // const res = await fetch(apiUrl, {
  //     //   method: 'POST',
  //     //   headers: {
  //     //     'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  //     //     'Content-Type': 'application/json',
  //     //   },
  //     //   body: JSON.stringify(form),
  //     // });
  //     const apiUrl = `${import.meta.env.VITE_API_URL}/api/contact`;

  //     const res = await fetch(apiUrl, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(form),
  //     });
  //     const data = await res.json() as any;

  //     if (!res.ok) {
  //       throw new Error(data.error || 'Failed to submit message');
  //     }

  //     setStatus('success');
  //     setForm({ name: '', email: '', company: '', project_type: '', budget_range: '', message: '' });
  //   } catch (err: any) {
  //     setStatus('error');
  //     setErrorMsg(err.message || 'Something went wrong. Please try again.');
  //   }
  // };

  const handleSubmit = async (e: any) => {
  e.preventDefault();

  if (!validate()) return;

  setStatus('loading');
  setErrorMsg('');

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/contact`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();
    console.log('Response from API:', data);
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit message');
    }

    setStatus('success');

    setForm({
      name: '',
      email: '',
      company: '',
      project_type: '',
      budget_range: '',
      message: '',
    });
  } catch (err: any) {
    setStatus('error');
    setErrorMsg(
      err.message || 'Something went wrong. Please try again.'
    );
  }
};

  return (
    <PageTransition>
      <SEO title="Contact" description="Get in touch with Khalid Haider Jafri — available for selected projects." />

      {/* HERO */}
      <section className="pt-32 lg:pt-40 pb-12">
        <div className="max-w-site container-px">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-brand-400/60" />
            <span className="section-label">Contact</span>
          </motion.div>
          <RevealText as="h1" className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter text-white leading-[0.95] max-w-4xl">
            Let's build something.
          </RevealText>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-6 text-gray-400 text-lg max-w-2xl">
            Have a project in mind? Fill out the form below and I'll get back to you within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* CONTACT GRID */}
      <section className="py-12 lg:py-20">
        <div className="max-w-site container-px">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* FORM */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="glass p-6 lg:p-10 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={handleChange('name')}
                      className="w-full bg-ink-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-brand-400/40 focus:outline-none focus:ring-1 focus:ring-brand-400/20 transition-all"
                      placeholder="Your name"
                    />
                    {errors.name && <p className="mt-2 text-xs text-danger-400">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={handleChange('email')}
                      className="w-full bg-ink-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-brand-400/40 focus:outline-none focus:ring-1 focus:ring-brand-400/20 transition-all"
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="mt-2 text-xs text-danger-400">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Company <span className="text-gray-600">(optional)</span></label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={handleChange('company')}
                      className="w-full bg-ink-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-brand-400/40 focus:outline-none focus:ring-1 focus:ring-brand-400/20 transition-all"
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Project Type</label>
                    <select
                      value={form.project_type}
                      onChange={handleChange('project_type')}
                      className="w-full bg-ink-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-400/40 focus:outline-none focus:ring-1 focus:ring-brand-400/20 transition-all"
                    >
                      <option value="">Select a type</option>
                      {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Budget Range <span className="text-gray-600">(optional)</span></label>
                  <select
                    value={form.budget_range}
                    onChange={handleChange('budget_range')}
                    className="w-full bg-ink-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-400/40 focus:outline-none focus:ring-1 focus:ring-brand-400/20 transition-all"
                  >
                    <option value="">Select a range</option>
                    {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={handleChange('message')}
                    rows={5}
                    className="w-full bg-ink-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-brand-400/40 focus:outline-none focus:ring-1 focus:ring-brand-400/20 transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                  {errors.message && <p className="mt-2 text-xs text-danger-400">{errors.message}</p>}
                </div>

                {/* Status messages */}
                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3 p-4 rounded-xl bg-success-500/10 border border-success-500/20">
                      <CheckCircle2 className="w-5 h-5 text-success-400 shrink-0" />
                      <p className="text-sm text-success-400">Message sent! I'll get back to you within 24 hours.</p>
                    </motion.div>
                  )}
                  {status === 'error' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3 p-4 rounded-xl bg-danger-500/10 border border-danger-500/20">
                      <AlertCircle className="w-5 h-5 text-danger-400 shrink-0" />
                      <p className="text-sm text-danger-400">{errorMsg}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  data-cursor="SEND"
                  className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* INFO */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass p-6 lg:p-8">
                <h3 className="font-display text-lg font-bold text-white mb-4">Direct Contact</h3>
                <a href={`mailto:${SITE.email}`} data-cursor="EMAIL" className="flex items-center gap-3 text-gray-400 hover:text-brand-400 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-brand-400/10 flex items-center justify-center group-hover:bg-brand-400/20 transition-colors">
                    <Mail className="w-4 h-4 text-brand-400" />
                  </div>
                  <span className="text-sm">{SITE.email}</span>
                </a>
              </div>

              <div className="glass p-6 lg:p-8">
                <h3 className="font-display text-lg font-bold text-white mb-4">Connect</h3>
                <div className="flex flex-col gap-3">
                  {(socials.length ? socials : [
                    { platform: 'GitHub', url: 'https://github.com/xayyeem', icon: 'Github' },
                    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/khalid-haider-jafri-78368220a/', icon: 'Linkedin' },
                  ]).map((social, i) => {
                    const Icon = SOCIAL_ICONS[social.icon] || (social.icon === 'Mail' ? Mail : social.icon === 'Github' ? Github : Linkedin);
                    return (
                      <a key={i} href={social.url} target="_blank" rel="noreferrer" data-cursor="OPEN" className="flex items-center gap-3 text-gray-400 hover:text-brand-400 transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-brand-400/10 flex items-center justify-center group-hover:bg-brand-400/20 transition-colors">
                          <Icon className="w-4 h-4 text-brand-400" />
                        </div>
                        <span className="text-sm">{social.platform}</span>
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="glass p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-soft" />
                  <span className="text-xs font-mono text-brand-300">Currently Available</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Available for selected projects. I typically respond within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
