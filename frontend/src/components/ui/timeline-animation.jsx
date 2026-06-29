"use client";

import { motion, useInView } from "motion/react";

/**
 * TimelineContent — reveals its children when `timelineRef` scrolls into view,
 * driving a staggered animation off the `animationNum` index (passed to motion's
 * `custom`). This dependency wasn't supplied with the component, so it's authored
 * here from the standard implementation, adapted to plain JS + `motion/react`
 * (the original libraries ship it as TS / framer-motion).
 */
export const TimelineContent = ({
  children,
  animationNum,
  className,
  timelineRef,
  as = "div",
  customVariants,
  once = false,
  ...props
}) => {
  const defaultSequenceVariants = {
    visible: (i) => ({
      filter: "blur(0px)",
      translateY: 0,
      opacity: 1,
      transition: { delay: i * 0.4, duration: 0.5 },
    }),
    hidden: { filter: "blur(20px)", translateY: 20, opacity: 0 },
  };

  const sequenceVariants = customVariants || defaultSequenceVariants;
  const isInView = useInView(timelineRef, { once });
  const MotionComponent = motion[as] || motion.div;

  return (
    <MotionComponent
      custom={animationNum}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sequenceVariants}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};
