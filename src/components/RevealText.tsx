import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type Props = {
  children: string;
  className?: string;
  delay?: number;
  as?: string;
};

export default function RevealText({ children, className = '', delay = 0, as = 'div' }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  const words = children.split(' ');

  const Tag = as as any;

  return (
    <Tag ref={ref} className={className}>
      {words.map((word: string, i: number) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.6,
              delay: delay + i * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
