/**
 * Animation Constants
 * Centralized animation utilities and constants for consistent motion
 */

import { Variants } from "framer-motion";

// Animation Durations
export const durations = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.75,
  slowest: 1.0,
} as const;

// Easing Functions
export const easing = {
  linear: "linear",
  easeIn: [0.4, 0, 1, 1] as [number, number, number, number],
  easeOut: [0, 0, 0.2, 1] as [number, number, number, number],
  easeInOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
  spring: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
} as const;

// Check for reduced motion preference
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Get reduced motion setting from localStorage
export const getReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("setting_reducedMotion") === "true" || prefersReducedMotion();
};

// Animation variants that respect reduced motion
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: getReducedMotion() ? 0 : durations.normal,
      ease: easing.easeOut,
    },
  },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: getReducedMotion() ? 0 : durations.normal,
      ease: easing.easeOut,
    },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: getReducedMotion() ? 0 : durations.normal,
      ease: easing.spring,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: getReducedMotion() ? 0 : 0.1,
      delayChildren: getReducedMotion() ? 0 : 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: getReducedMotion() ? 0 : durations.normal,
      ease: easing.easeOut,
    },
  },
};

// Success animation (celebration)
export const successAnimation = {
  scale: [1, 1.1, 1],
  rotate: [0, 5, -5, 0],
  transition: {
    duration: getReducedMotion() ? 0 : durations.normal,
    ease: easing.spring,
  },
};

// Error animation (shake)
export const errorAnimation = {
  x: [0, -10, 10, -10, 10, 0],
  transition: {
    duration: getReducedMotion() ? 0 : durations.fast,
    ease: easing.easeOut,
  },
};

// Page transition
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: getReducedMotion() ? 0 : durations.normal,
    ease: easing.easeOut,
  },
};
