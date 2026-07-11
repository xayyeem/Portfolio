import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { NAV_LINKS } from '../lib/constants';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-ink-950/80 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent border-transparent'
        }`}
      >
        <nav className="max-w-site container-px flex items-center justify-between h-16 lg:h-20">
          <Link to="/" data-cursor="HOME" className="group flex items-center gap-2">
            <span className="font-display text-xl font-bold tracking-tighter text-white">
              KHJ<span className="text-brand-400">.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    data-cursor={link.label.toUpperCase()}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                      active ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full bg-white/5"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:block">
            <Link to="/contact" data-cursor="LET'S TALK" className="btn-primary text-xs">
              Let's Work Together
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white p-2"
            aria-label="Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 lg:hidden bg-ink-950/95 backdrop-blur-xl pt-20"
          >
            <ul className="flex flex-col items-center justify-center gap-6 mt-12">
              {NAV_LINKS.map((link, i) => {
                const active = location.pathname === link.path;
                return (
                  <motion.li
                    key={link.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <Link
                      to={link.path}
                      className={`text-3xl font-display font-bold tracking-tighter ${
                        active ? 'text-brand-400' : 'text-gray-300'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}
              <motion.li
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6"
              >
                <Link to="/contact" className="btn-primary">
                  Let's Work Together
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
