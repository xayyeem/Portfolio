import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, Github, Linkedin } from 'lucide-react';
import { SITE } from '../lib/constants';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-ink-950">
      <div className="max-w-site container-px py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="font-display text-2xl font-bold tracking-tighter text-white">
              KHJ<span className="text-brand-400">.</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm max-w-sm leading-relaxed">
              {SITE.role} building scalable web applications, APIs, and modern digital experiences.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href={`mailto:${SITE.email}`}
                data-cursor="EMAIL"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-brand-400 hover:border-brand-400/40 transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/xayyeem"
                target="_blank"
                rel="noreferrer"
                data-cursor="OPEN"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-brand-400 hover:border-brand-400/40 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/khalid-haider-jafri-78368220a/"
                target="_blank"
                rel="noreferrer"
                data-cursor="OPEN"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-brand-400 hover:border-brand-400/40 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500 mb-4">Navigate</h4>
            <ul className="grid grid-cols-2 gap-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'About', path: '/about' },
                { label: 'Skills', path: '/skills' },
                { label: 'Experience', path: '/experience' },
                { label: 'Projects', path: '/projects' },
                { label: 'Services', path: '/services' },
                { label: 'Contact', path: '/contact' },
              ].map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500 mb-4">Let's Build</h4>
            <Link to="/contact" data-cursor="START" className="btn-ghost text-xs w-full justify-between">
              Start a Project
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <p className="mt-4 text-xs text-gray-500">
              Contact Me
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 font-mono">
            © {new Date().getFullYear()} Khalid Haider Jafri. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 font-mono">
            Designed & Built with precision
          </p>
        </div>
      </div>
    </footer>
  );
}
