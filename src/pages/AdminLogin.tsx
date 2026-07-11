import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import { useAuth } from '../lib/auth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { session, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) navigate('/admin/dashboard');
  }, [session, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <>
      <SEO title="Admin Login" description="Admin access — Khalid Haider Jafri portfolio." />
      <div className="min-h-screen flex items-center justify-center px-5 relative">
        <div className="absolute inset-0 bg-grid bg-grid-size opacity-20" style={{ maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="glass-strong p-8 lg:p-10">
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-brand-400/10 border border-brand-400/20 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-brand-400" />
              </div>
              <h1 className="font-display text-2xl font-bold text-white">Admin Access</h1>
              <p className="text-sm text-gray-500 mt-2 text-center">Sign in to manage portfolio content</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 mb-6">
                <AlertCircle className="w-4 h-4 text-danger-400 shrink-0" />
                <p className="text-sm text-danger-400">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-ink-800/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:border-brand-400/40 focus:outline-none focus:ring-1 focus:ring-brand-400/20 transition-all"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-ink-800/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:border-brand-400/40 focus:outline-none focus:ring-1 focus:ring-brand-400/20 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                data-cursor="LOGIN"
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <a href="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-brand-400 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to website
            </a>
          </div>
        </motion.div>
      </div>
    </>
  );
}
