import { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDown, Mail, Github, Linkedin, Code, Server, Layers, Database } from 'lucide-react';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import RevealText from '../components/RevealText';
import { SITE, TECH_MARQUEE, ROLES } from '../lib/constants';
import { useSiteSettings, useProfile } from '../lib/hooks';

const Hero3D = lazy(() => import('../components/Hero3D'));

const FEATURED_EXPERTISE = [
  { title: 'Full-Stack Web Development', desc: 'End-to-end web applications with React, Node.js, and modern tooling — from database to deployment.', Icon: Code },
  { title: 'Backend & API Development', desc: 'Secure, well-documented REST APIs and backend systems designed for scale and maintainability.', Icon: Server },
  { title: '.NET Development', desc: 'Enterprise-grade applications with C#, ASP.NET Core, Entity Framework, and SQL Server.', Icon: Layers },
  { title: 'Database Engineering', desc: 'Schema design, complex queries, stored procedures, and performance optimization across SQL Server and MongoDB.', Icon: Database },
];

function RotatingRoles() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setIndex((p) => (p + 1) % ROLES.length), 2500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="h-8 overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="block text-brand-400 font-mono text-sm sm:text-base"
        >
          {ROLES[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function TechMarquee() {
  const items = [...TECH_MARQUEE, ...TECH_MARQUEE];
  return (
    <div className="relative overflow-hidden py-8 border-y border-white/[0.06] bg-ink-900/50">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((tech, i) => (
          <span key={i} className="mx-8 font-display text-2xl lg:text-3xl font-bold text-gray-600 hover:text-brand-400 transition-colors duration-300">
            {tech}<span className="mx-8 text-brand-400/30">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function StatCard({ stat, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass p-6 lg:p-8 hover:border-brand-400/20 transition-all duration-300"
    >
      <div className="flex items-baseline gap-1">
        <span className="font-display text-4xl lg:text-5xl font-bold text-gradient-brand">{stat.value}</span>
        <span className="text-2xl lg:text-3xl font-display font-bold text-brand-400">{stat.suffix}</span>
      </div>
      <p className="mt-2 text-sm text-gray-400">{stat.label}</p>
    </motion.div>
  );
}

function LockedProjectCard({ index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative glass overflow-hidden group h-72 lg:h-80"
    >
      <div className="absolute inset-0 bg-grid bg-grid-size opacity-20" />
      <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-brand-400/10 to-transparent animate-scan" style={{ animationDelay: `${index * 0.3}s` }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3/4 h-3/4 rounded-xl bg-gradient-to-br from-brand-500/10 to-accent-500/5 blur-2xl" />
      </div>
      <div className="relative z-10 h-full flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-ink-900/50 backdrop-blur-sm">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 0h10.5a2.25 2.25 0 012.25 2.25v6.75a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25v-6.75a2.25 2.25 0 012.25-2.25z" />
          </svg>
        </div>
        <p className="shimmer-text font-display text-sm font-medium tracking-wide">PROJECT COMING SOON</p>
      </div>
    </motion.div>
  );
}

function Hero3DWrapper() {
  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border-2 border-brand-400/20 border-t-brand-400 animate-spin" />
      </div>
    }>
      <Hero3D />
    </Suspense>
  );
}

export default function Home() {
  const { data: settings } = useSiteSettings();
  const { data: profile } = useProfile();
  const stats = settings?.stats || [
    { label: 'Professional Experience', value: '1+', suffix: 'Years' },
    { label: 'Technologies', value: '20+', suffix: '' },
    { label: 'Production Projects', value: '10+', suffix: '' },
    { label: 'Full-Stack Development', value: '100', suffix: '%' },
  ];
  const tagline = profile?.tagline || SITE.tagline;
  const intro = profile?.intro || SITE.intro;
  const availability = profile?.availability_status || 'Available for selected projects';

  return (
    <PageTransition>
      <SEO title="" description={intro} />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="max-w-site container-px w-full">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-400/20 bg-brand-400/5 mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-soft" />
                <span className="text-xs font-mono text-brand-300">{availability}</span>
              </motion.div>

              <RevealText
                as="h1"
                className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter text-white leading-[0.95]"
                delay={0.2}
              >
                {tagline}
              </RevealText>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-6 text-gray-400 text-base lg:text-lg max-w-xl leading-relaxed"
              >
                {intro}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="mt-6">
                <RotatingRoles />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1 }} className="mt-10 flex flex-wrap items-center gap-4">
                <Link to="/projects" data-cursor="EXPLORE" className="btn-primary">
                  Explore My Work
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link to="/contact" data-cursor="CONTACT" className="btn-ghost">Let's Talk</Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.2 }} className="mt-10 flex items-center gap-4">
                <a href={`mailto:${SITE.email}`} data-cursor="EMAIL" className="text-gray-500 hover:text-brand-400 transition-colors" aria-label="Email"><Mail className="w-5 h-5" /></a>
                <a href="https://github.com/xayyeem" target="_blank" rel="noreferrer" data-cursor="OPEN" className="text-gray-500 hover:text-brand-400 transition-colors" aria-label="GitHub"><Github className="w-5 h-5" /></a>
                <a href="https://www.linkedin.com/in/khalid-haider-jafri-78368220a/" target="_blank" rel="noreferrer" data-cursor="OPEN" className="text-gray-500 hover:text-brand-400 transition-colors" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
              </motion.div>
            </div>

            <div className="lg:col-span-5 h-[400px] lg:h-[600px] relative">
              <Hero3DWrapper />
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-gray-500">Scroll</span>
          <ArrowDown className="w-4 h-4 text-gray-500 animate-bounce" />
        </motion.div>
      </section>

      {/* TECH MARQUEE */}
      <TechMarquee />

      {/* SNAPSHOT */}
      <section className="py-24 lg:py-32">
        <div className="max-w-site container-px">
          <SectionHeading label="Developer Snapshot" title="By the numbers" subtitle="A quick snapshot of my professional journey so far." />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)}
          </div>
        </div>
      </section>

      {/* FEATURED EXPERTISE */}
      <section className="py-24 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-site container-px">
          <SectionHeading label="Featured Expertise" title="What I specialize in" subtitle="Four core areas where I deliver production-ready results." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {FEATURED_EXPERTISE.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass p-6 lg:p-8 hover:border-brand-400/20 hover:bg-white/[0.05] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-400/10 flex items-center justify-center mb-5 group-hover:bg-brand-400/20 transition-colors">
                  <item.Icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SELECTED WORK PREVIEW */}
      <section className="py-24 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-site container-px">
          <SectionHeading label="Selected Work" title="Projects are cooking" subtitle="I'm currently preparing detailed case studies of the products, systems, and experiments I've worked on. They'll be here soon." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[0, 1, 2, 3, 4, 5].map((i) => <LockedProjectCard key={i} index={i} />)}
          </div>
          <div className="mt-12 text-center">
            <Link to="/projects" data-cursor="EXPLORE" className="btn-ghost">
              Explore Projects
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FREELANCE CTA */}
      <section className="py-24 lg:py-40 border-t border-white/[0.04]">
        <div className="max-w-site container-px">
          <div className="relative glass-strong p-10 lg:p-20 overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(26,179,175,0.4), transparent 70%)' }} />
            <div className="relative z-10 max-w-3xl">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter text-white leading-tight"
              >
                HAVE AN IDEA? LET'S TURN IT INTO A REAL PRODUCT.
              </motion.h2>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-10 flex flex-wrap gap-4">
                <Link to="/contact" data-cursor="START" className="btn-primary">Start a Project<ArrowUpRight className="w-4 h-4" /></Link>
                <Link to="/contact" data-cursor="CONTACT" className="btn-ghost">Contact Me</Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
