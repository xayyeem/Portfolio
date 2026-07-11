import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Briefcase, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import RevealText from '../components/RevealText';
import { useExperiences } from '../lib/hooks';

function ExperienceTimeline({ experiences, loading }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass p-10 animate-pulse h-96" />
      </div>
    );
  }

  if (!experiences.length) return null;

  const active = experiences[activeIndex] || experiences[0];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Timeline bar */}
      <div className="relative mb-12">
        <div className="absolute left-0 right-0 top-1/2 h-px bg-white/[0.06] -translate-y-1/2" />
        <div className="relative flex items-center justify-between gap-4 overflow-x-auto pb-4">
          {experiences.map((exp, i) => (
            <button
              key={exp.id}
              onClick={() => setActiveIndex(i)}
              data-cursor="VIEW"
              className={`relative shrink-0 flex flex-col items-center gap-2 px-4 py-2 transition-all duration-300 ${i === activeIndex ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
            >
              <div className={`w-4 h-4 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-brand-400 scale-125 ring-4 ring-brand-400/20' : 'bg-gray-600'}`} />
              <span className={`text-xs font-mono whitespace-nowrap ${i === activeIndex ? 'text-brand-400' : 'text-gray-500'}`}>
                {exp.start_date}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active experience card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong p-8 lg:p-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-12">
            <div className="lg:w-1/3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-400/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-brand-400" />
                </div>
                {active.current && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-400/10 border border-brand-400/20 text-xs font-mono text-brand-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-soft" />
                    Current
                  </span>
                )}
              </div>
              <h3 className="font-display text-2xl font-bold text-white">{active.role}</h3>
              <p className="text-brand-400 font-medium mt-1">{active.company}</p>
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{active.start_date} — {active.end_date || 'Present'}</span>
              </div>
            </div>

            <div className="lg:w-2/3 lg:border-l lg:border-white/[0.06] lg:pl-12">
              <p className="text-gray-300 leading-relaxed mb-6">{active.description}</p>

              <h4 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4">Focus Areas</h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {active.focus_areas?.map((area, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex items-start gap-2 text-sm text-gray-400"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <span>{area}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation hint */}
      {experiences.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 text-sm text-gray-500">
          <ChevronRight className="w-4 h-4" />
          <span>Click on the timeline markers to navigate</span>
        </div>
      )}
    </div>
  );
}

export default function Experience() {
  const { data: experiences, loading } = useExperiences();

  return (
    <PageTransition>
      <SEO title="Experience" description="Professional experience and career timeline of Khalid Haider Jafri — Associate Software Developer at AcmeMinds." />

      {/* HERO */}
      <section className="pt-32 lg:pt-40 pb-20">
        <div className="max-w-site container-px">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-brand-400/60" />
            <span className="section-label">Experience</span>
          </motion.div>
          <RevealText as="h1" className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter text-white leading-[0.95] max-w-4xl">
            Building real software in production.
          </RevealText>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-6 text-gray-400 text-lg max-w-2xl">
            My professional journey — the roles, the work, and the focus areas that shape how I build today.
          </motion.p>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-site container-px">
          <ExperienceTimeline experiences={experiences} loading={loading} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-site container-px text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="font-display text-3xl lg:text-4xl font-bold text-white mb-8">
            Let's build something together.
          </motion.h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact" data-cursor="CONTACT" className="btn-primary">Get in Touch<ArrowUpRight className="w-4 h-4" /></Link>
            <Link to="/services" data-cursor="VIEW" className="btn-ghost">View Services</Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
