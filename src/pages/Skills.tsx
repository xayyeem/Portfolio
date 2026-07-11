import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Code2, Layers, Wrench, Plug } from 'lucide-react';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import RevealText from '../components/RevealText';
import { useSkills } from '../lib/hooks';

const ICONS = { Code: Code2, Layers, Wrench, Plug };

function SkillChip({ name, index }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={{ scale: 1.05 }}
      className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-sm text-gray-300 hover:border-brand-400/30 hover:bg-brand-400/5 hover:text-brand-300 transition-all duration-300 cursor-default"
    >
      {name}
    </motion.span>
  );
}

function SkillCard({ category, index }) {
  const Icon = ICONS[category.icon] || Code2;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -8, y: x * 8 });
  };

  const handleLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      className="glass p-6 lg:p-8 hover:border-brand-400/20 transition-all duration-300 preserve-3d"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-brand-400/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-brand-400" />
        </div>
        <h3 className="font-display text-lg font-bold text-white">{category.name}</h3>
      </div>
      {category.description && <p className="text-sm text-gray-400 mb-5 leading-relaxed">{category.description}</p>}
      <div className="flex flex-wrap gap-2">
        {category.skills?.map((skill, i) => <SkillChip key={skill.id || i} name={skill.name} index={i} />)}
      </div>
    </motion.div>
  );
}

function OrbitSystem() {
  const technologies = ['React', 'Node.js', '.NET', 'C#', 'MongoDB', 'SQL Server', 'Express', 'Docker'];
  return (
    <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center">
      {/* Center */}
      <div className="absolute w-20 h-20 rounded-full bg-brand-400/10 border border-brand-400/30 flex items-center justify-center z-10">
        <span className="font-display text-xs font-bold text-brand-400 text-center leading-tight">KHJ<br/>Stack</span>
      </div>

      {/* Orbits */}
      {[0, 1, 2].map((ring) => (
        <div key={ring} className={`absolute rounded-full border border-white/[0.06] ${ring === 0 ? 'w-48 h-48' : ring === 1 ? 'w-80 h-80' : 'w-[28rem] h-[28rem]'}`}>
          <div className={`absolute inset-0 rounded-full ${ring === 0 ? 'animate-spin-slow' : ring === 1 ? 'animate-spin-slower' : ''}`} style={{ animationDuration: `${20 + ring * 15}s` }}>
            {technologies.slice(ring * 3, ring * 3 + 3).map((tech, i) => {
              const angle = (i / 3) * 360;
              return (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ transform: `rotate(${angle}deg) translateY(-${ring === 0 ? 96 : ring === 1 ? 160 : 224}px) rotate(-${angle}deg)` }}
                >
                  <span className="inline-block px-3 py-1.5 rounded-full border border-white/10 bg-ink-800 text-xs font-mono text-gray-300 whitespace-nowrap">
                    {tech}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Skills() {
  const { data: categories, loading, error } = useSkills();

  return (
    <PageTransition>
      <SEO title="Skills" description="Technical skills across full-stack JavaScript, .NET development, tools, and engineering practices." />

      {/* HERO */}
      <section className="pt-32 lg:pt-40 pb-20">
        <div className="max-w-site container-px">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-brand-400/60" />
            <span className="section-label">Skills & Stack</span>
          </motion.div>
          <RevealText as="h1" className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter text-white leading-[0.95] max-w-4xl">
            Technologies I build with.
          </RevealText>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-6 text-gray-400 text-lg max-w-2xl">
            A deep toolkit spanning the full JavaScript ecosystem, the .NET enterprise stack, and the engineering practices that tie it all together.
          </motion.p>
        </div>
      </section>

      {/* ORBIT */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="max-w-site container-px">
          <OrbitSystem />
        </div>
      </section>

      {/* SKILL CATEGORIES */}
      <section className="py-24 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-site container-px">
          <SectionHeading label="Tech Stack" title="Organized by domain" subtitle="Interactive cards — hover to explore each technology cluster." />

          {loading && (
            <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="glass p-8 animate-pulse h-64" />
              ))}
            </div>
          )}

          {error && (
            <div className="glass p-8 text-center text-gray-400">
              Could not load skills. Please try again later.
            </div>
          )}

          {!loading && !error && (
            <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
              {categories.map((cat, i) => <SkillCard key={cat.id} category={cat} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-site container-px text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="font-display text-3xl lg:text-4xl font-bold text-white mb-8">
            See how I apply these skills.
          </motion.h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/experience" data-cursor="VIEW" className="btn-primary">View Experience<ArrowUpRight className="w-4 h-4" /></Link>
            <Link to="/projects" data-cursor="VIEW" className="btn-ghost">Explore Projects</Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
