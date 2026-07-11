import { motion } from 'framer-motion';

export default function SectionHeading({ label, title, subtitle, align = 'left' }: { label?: string; title?: string; subtitle?: string; align?: string }) {
  return (
    <div className={`mb-12 lg:mb-16 ${align === 'center' ? 'text-center mx-auto' : ''}`}>
      {label && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`flex items-center gap-3 mb-5 ${align === 'center' ? 'justify-center' : ''}`}
        >
          <span className="w-8 h-px bg-brand-400/60" />
          <span className="section-label">{label}</span>
        </motion.div>
      )}
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="section-heading"
        >
          {title}
        </motion.h2>
      )}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`mt-5 text-gray-400 text-base lg:text-lg max-w-2xl leading-relaxed ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
