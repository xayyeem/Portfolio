import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Lock, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import RevealText from '../components/RevealText';
import { useProjects } from '../lib/hooks';

function LockedCard({ index, project }: { index: number; project?: any }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -6, y: x * 6 });
    setMousePos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  const handleLeave = () => {
    setTilt({ x: 0, y: 0 });
    setMousePos({ x: 50, y: 50 });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      className="relative glass overflow-hidden group h-80 lg:h-96 preserve-3d"
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid bg-grid-size opacity-20" />

      {/* Mouse-following glow */}
      <div
        className="absolute w-48 h-48 rounded-full opacity-20 blur-[60px] transition-opacity duration-300 group-hover:opacity-40"
        style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%`, transform: 'translate(-50%, -50%)', background: 'radial-gradient(circle, rgba(26,179,175,0.5), transparent 70%)' }}
      />

      {/* Scanning line */}
      <div className="absolute inset-x-0 h-20 bg-gradient-to-b from-brand-400/15 to-transparent animate-scan" style={{ animationDelay: `${index * 0.4}s` }} />

      {/* Blurred preview */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2/3 h-2/3 rounded-xl bg-gradient-to-br from-brand-500/10 to-accent-500/5 blur-2xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center gap-4 p-6">
        <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-ink-900/50 backdrop-blur-sm">
          <Lock className="w-6 h-6 text-gray-500" />
        </div>
        <p className="shimmer-text font-display text-sm font-medium tracking-wide">PROJECT COMING SOON</p>
        {project?.title && (
          <p className="text-xs text-gray-500 font-mono mt-2">{project.title}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const { data: projects, loading } = useProjects();
  const publishedProjects = projects?.filter((p) => p.is_published) || [];
  const showLocked = publishedProjects.length === 0;

  return (
    <PageTransition>
      <SEO title="Projects" description="Selected projects and case studies from Khalid Haider Jafri — currently being documented." />

      {/* HERO */}
      <section className="pt-32 lg:pt-40 pb-20">
        <div className="max-w-site container-px">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-brand-400/60" />
            <span className="section-label">Projects</span>
          </motion.div>

          <RevealText as="h1" className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
            PROJECTS ARE COOKING.
          </RevealText>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-8 flex items-start gap-3 max-w-2xl">
            <Sparkles className="w-5 h-5 text-brand-400 shrink-0 mt-1" />
            <p className="text-gray-400 text-lg leading-relaxed">
              I'm currently preparing detailed case studies of the products, systems, and experiments I've worked on. They'll be here soon.
            </p>
          </motion.div>
        </div>
      </section>

      {/* LOCKED GRID */}
      {showLocked && (
        <section className="py-20 lg:py-32 border-t border-white/[0.04]">
          <div className="max-w-site container-px">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {[0, 1, 2, 3, 4, 5].map((i) => <LockedCard key={i} index={i} project={null} />)}
            </div>
          </div>
        </section>
      )}

      {/* PUBLISHED PROJECTS */}
      {!showLocked && !loading && publishedProjects.length > 0 && (
        <section className="py-20 lg:py-32 border-t border-white/[0.04]">
          <div className="max-w-site container-px">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {publishedProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass overflow-hidden group hover:border-brand-400/20 transition-all duration-300"
                >
                  {project.thumbnail_url && (
                    <div className="aspect-video overflow-hidden bg-ink-800">
                      <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{project.short_description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.slice(0, 3).map((tech, j) => (
                        <span key={j} className="text-xs font-mono text-gray-500 px-2 py-1 rounded border border-white/10">{tech}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-site container-px text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
            Want to see what I can build?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="text-gray-400 mb-8 max-w-xl mx-auto">
            While the case studies are being prepared, let's talk about what you're building.
          </motion.p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact" data-cursor="CONTACT" className="btn-primary">Let's Talk<ArrowUpRight className="w-4 h-4" /></Link>
            <Link to="/services" data-cursor="VIEW" className="btn-ghost">View Services</Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
