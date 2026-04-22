"use client";

import type { ReactNode } from "react";

import { motion } from "motion/react";

type MotionFadeProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
};

export function MotionFade({
  children,
  className,
  delay = 0,
  distance = 18,
}: MotionFadeProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
