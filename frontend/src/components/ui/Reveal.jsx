import { motion } from 'motion/react';

// Smooth, physics-friendly easing used across reveals.
const EASE = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/**
 * Reveal — animates a single element into view on scroll.
 * Usage: <Reveal as="section" className="...">...</Reveal>
 */
export function Reveal({ children, className, as = 'div', delay = 0, y = 24, once = true }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * RevealGroup — a stagger container. Pair with <RevealItem> children so they
 * cascade in as the group scrolls into view.
 */
export function RevealGroup({ children, className, as = 'div', amount = 0.2, once = true }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      {children}
    </MotionTag>
  );
}

/** RevealItem — a single staggered child inside a <RevealGroup>. */
export function RevealItem({ children, className, as = 'div', ...rest }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag className={className} variants={itemVariants} {...rest}>
      {children}
    </MotionTag>
  );
}

export default Reveal;
