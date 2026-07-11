import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Code2, Database, Server, Cpu, Sparkles, Terminal } from 'lucide-react';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import RevealText from '../components/RevealText';
import { useProfile } from '../lib/hooks';

const EXPERIENCE_AREAS = [
  { label: 'Frontend Development', Icon: Code2 },
  { label: 'Backend Development', Icon: Server },
  { label: 'REST API Development', Icon: Terminal },
  { label: 'Database Development', Icon: Database },
  { label: 'Enterprise .NET Applications', Icon: Cpu },
  { label: 'MERN Stack Applications', Icon: Code2 },
  { label: 'SQL Server', Icon: Database },
  { label: 'Third-Party API Integrations', Icon: Server },
  { label: 'AI-Powered Document Processing', Icon: Sparkles },
  { label: 'Production Debugging & Optimization', Icon: Cpu },
];

const JOURNEY = [
  {
    year: 'Early Days',
    title: 'The Foundation',
    desc: 'Started with a curiosity for how things work on the web. Learned HTML, CSS, and JavaScript — building small projects and falling in love with the craft of turning ideas into interfaces.',
  },
  {
    year: 'Growing',
    title: 'Going Full-Stack',
    desc: 'Expanded into backend development with Node.js, Express, and MongoDB. Then dove into the .NET ecosystem — C#, ASP.NET Core, Entity Framework, and SQL Server — learning how enterprise software is built and maintained.',
  },
  {
    year: 'Now',
    title: 'Building Real Software',
    desc: 'Working as an Associate Software Developer at AcmeMinds, building and maintaining production applications across the full stack — from React frontends to .NET backends, SQL Server databases, and AI-powered document workflows.',
  },
];

const FOCUS = [
  { title: 'Clean Architecture', desc: 'Code that is readable, maintainable, and structured for long-term evolution.' },
  { title: 'Performance', desc: 'From optimized SQL queries to fast-loading frontends — speed matters at every layer.' },
  { title: 'Reliability', desc: 'Proper error handling, validation, and testing so systems work when it counts.' },
  { title: 'Continuous Learning', desc: 'Every project is an opportunity to deepen understanding and try new approaches.' },
];

export default function About() {
  const { data: profile } = useProfile();
  const bio = profile?.bio;
  const philosophy = profile?.philosophy;

  return (
    <PageTransition>
      <SEO title="About" description="The story, philosophy, and engineering approach of Khalid Haider Jafri — Full-Stack Software Developer." />

      {/* INTRO */}
      <section className="pt-32 lg:pt-40 pb-20">
        <div className="max-w-site container-px">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-brand-400/60" />
            <span className="section-label">About Me</span>
          </motion.div>

          <RevealText as="h1" className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter text-white leading-[0.95] max-w-4xl">
            I build software that solves real problems.
          </RevealText>

          <div className="grid lg:grid-cols-12 gap-12 mt-16">
            <div className="lg:col-span-7">
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-lg lg:text-xl text-gray-300 leading-relaxed">
                {bio || "I'm a Full-Stack Software Developer with professional experience building and maintaining real-world software systems. My work spans frontend development, backend architecture, REST API design, database engineering, enterprise .NET applications, and MERN stack development."}
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="mt-6 text-gray-400 leading-relaxed">
                I focus on writing clean, maintainable code that solves real problems — whether that's optimizing a slow SQL query, debugging a production issue, or building a new feature end-to-end. I care about the details that make software feel solid.
              </motion.p>
            </div>
            <div className="lg:col-span-5">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="glass p-6 lg:p-8">
                <h3 className="font-display text-sm font-bold text-white mb-4 uppercase tracking-wider">Experience Across</h3>
                <div className="grid grid-cols-2 gap-3">
                  {EXPERIENCE_AREAS.map((area, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.05 }} className="flex items-center gap-2 text-sm text-gray-400">
                      <area.Icon className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                      <span>{area.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="py-24 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-site container-px">
          <SectionHeading label="Developer Philosophy" title="How I think about engineering" />
          <div className="max-w-4xl">
            <motion.blockquote initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="font-display text-2xl lg:text-3xl text-white leading-relaxed tracking-tight border-l-2 border-brand-400 pl-8">
              {philosophy || "Great software is built layer by layer — from the database schema to the last pixel on screen. I believe in understanding the full stack deeply, choosing the right tool for each job, and never shipping something I wouldn't want to maintain."}
            </motion.blockquote>
          </div>
        </div>
      </section>

      {/* JOURNEY TIMELINE */}
      <section className="py-24 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-site container-px">
          <SectionHeading label="Career Journey" title="The path so far" subtitle="A visual timeline of how I got to where I am today." />
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-400/40 via-brand-400/20 to-transparent -translate-x-1/2" />

            {JOURNEY.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`relative flex items-start gap-6 mb-12 last:mb-0 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                {/* Dot */}
                <div className="absolute left-4 lg:left-1/2 -translate-x-1/2 z-10 mt-2">
                  <div className="w-4 h-4 rounded-full bg-brand-400 ring-4 ring-ink-950" />
                </div>

                {/* Content */}
                <div className={`lg:w-1/2 pl-12 lg:pl-0 ${i % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12'}`}>
                  <div className="glass p-6 lg:p-8 hover:border-brand-400/20 transition-all duration-300">
                    <span className="text-xs font-mono uppercase tracking-widest text-brand-400">{item.year}</span>
                    <h3 className="font-display text-xl font-bold text-white mt-2 mb-3">{item.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                <div className="hidden lg:block lg:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT I FOCUS ON */}
      <section className="py-24 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-site container-px">
          <SectionHeading label="What I Focus On" title="Principles that guide my work" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {FOCUS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass p-6 lg:p-8 hover:border-brand-400/20 transition-all duration-300"
              >
                <span className="font-display text-5xl font-bold text-brand-400/20">0{i + 1}</span>
                <h3 className="font-display text-lg font-bold text-white mt-3 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-site container-px text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="font-display text-3xl lg:text-4xl font-bold text-white mb-8">
            Want to know more?
          </motion.h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/skills" data-cursor="VIEW" className="btn-primary">Explore My Skills<ArrowUpRight className="w-4 h-4" /></Link>
            <Link to="/experience" data-cursor="VIEW" className="btn-ghost">See My Experience</Link>
            <Link to="/contact" data-cursor="TALK" className="btn-ghost">Get in Touch</Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
