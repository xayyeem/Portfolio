import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Code, Server, Layers, Database, Plug, Wrench, Check } from 'lucide-react';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import RevealText from '../components/RevealText';
import { useServices } from '../lib/hooks';

const ICONS = { Code, Server, Layers, Database, Plug, Wrench };

const SERVICE_DETAILS = {
  'Full-Stack Web Development': ['React.js & Node.js', 'Responsive design', 'API integration', 'Authentication systems', 'Deployment & CI/CD'],
  'Backend & API Development': ['REST API design', 'JWT authentication', 'Rate limiting & security', 'Error handling', 'API documentation'],
  '.NET Application Development': ['ASP.NET Core', 'Entity Framework', 'WCF services', 'Enterprise architecture', 'Background jobs'],
  'Database Development': ['SQL Server & MongoDB', 'Stored procedures', 'Query optimization', 'Schema design', 'Database migration'],
  'API & Third-Party Integrations': ['Payment gateways', 'AI/LLM APIs', 'Document processing', 'Cloud services', 'Webhook handling'],
  'Maintenance & Optimization': ['Production debugging', 'Performance tuning', 'Code reviews', 'Feature development', 'Technical debt reduction'],
};

function ServiceCard({ service, index }) {
  const Icon = ICONS[service.icon] || Code;
  const details = SERVICE_DETAILS[service.title] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass p-8 lg:p-10 hover:border-brand-400/20 hover:bg-white/[0.05] transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="w-14 h-14 rounded-2xl bg-brand-400/10 flex items-center justify-center group-hover:bg-brand-400/20 transition-colors">
          <Icon className="w-6 h-6 text-brand-400" />
        </div>
        <span className="font-display text-5xl font-bold text-white/[0.04]">0{index + 1}</span>
      </div>
      <h3 className="font-display text-xl lg:text-2xl font-bold text-white mb-3">{service.title}</h3>
      <p className="text-gray-400 leading-relaxed mb-6">{service.description}</p>
      {details.length > 0 && (
        <ul className="space-y-2">
          {details.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
              <Check className="w-4 h-4 text-brand-400 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

export default function Services() {
  const { data: services, loading, error } = useServices();

  return (
    <PageTransition>
      <SEO title="Services" description="Freelance development services — full-stack web development, backend & API development, .NET applications, database engineering, integrations, and maintenance." />

      {/* HERO */}
      <section className="pt-32 lg:pt-40 pb-20">
        <div className="max-w-site container-px">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-brand-400/60" />
            <span className="section-label">Services</span>
          </motion.div>
          <RevealText as="h1" className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter text-white leading-[0.95] max-w-4xl">
            What I can build for you.
          </RevealText>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-6 text-gray-400 text-lg max-w-2xl">
            From full-stack web applications to backend systems, database engineering, and ongoing maintenance — here's how I can help bring your product to life.
          </motion.p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-24 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-site container-px">
          <SectionHeading label="Offerings" title="Development services" subtitle="Each engagement is scoped to your needs. No cookie-cutter packages — just the right work for your project." />

          {loading && (
            <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
              {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="glass p-10 animate-pulse h-64" />)}
            </div>
          )}

          {error && <div className="glass p-8 text-center text-gray-400">Could not load services. Please try again later.</div>}

          {!loading && !error && (
            <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
              {services.map((service, i) => <ServiceCard key={service.id} service={service} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-site container-px">
          <SectionHeading label="How It Works" title="A simple, transparent process" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { step: '01', title: 'Discovery', desc: 'We discuss your idea, goals, and requirements to understand the scope.' },
              { step: '02', title: 'Proposal', desc: 'I deliver a clear plan with timeline, deliverables, and technical approach.' },
              { step: '03', title: 'Build', desc: 'Iterative development with regular updates and feedback checkpoints.' },
              { step: '04', title: 'Launch', desc: 'Deployment, documentation, and support to ensure a smooth go-live.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="relative">
                <span className="font-display text-6xl font-bold text-brand-400/15">{item.step}</span>
                <h3 className="font-display text-lg font-bold text-white mt-2 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-40 border-t border-white/[0.04]">
        <div className="max-w-site container-px">
          <div className="relative glass-strong p-10 lg:p-20 overflow-hidden text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full opacity-15 blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(26,179,175,0.4), transparent 70%)' }} />
            <div className="relative z-10 max-w-2xl mx-auto">
              <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-white leading-tight">
                Tell me about your project.
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="mt-4 text-gray-400">
                Whether it's a new build or improving an existing system — let's talk.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-8">
                <Link to="/contact" data-cursor="START" className="btn-primary">Tell Me About Your Project<ArrowUpRight className="w-4 h-4" /></Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
