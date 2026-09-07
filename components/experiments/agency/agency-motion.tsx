"use client";

import {
  createContext,
  useContext,
  useRef,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import styles from "./agency.module.css";

const MotionPreference = createContext({ paused: true, compact: true });
const compactQuery = "(max-width: 760px)";
const reducedQuery = "(prefers-reduced-motion: reduce)";
function subscribeReduced(callback: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
export function useAgencyReducedMotion() {
  // The server and hydration render share a static pose before reading the OS preference.
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(reducedQuery).matches,
    () => true,
  );
}
function subscribeCompact(callback: () => void) {
  const query = window.matchMedia(compactQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function AgencyMotion({
  paused,
  children,
}: {
  paused: boolean;
  children: ReactNode;
}) {
  const compact = useSyncExternalStore(
    subscribeCompact,
    () => window.matchMedia(compactQuery).matches,
    () => true,
  );
  return (
    <MotionPreference.Provider value={{ paused, compact }}>
      {children}
    </MotionPreference.Provider>
  );
}

export function useAgencyMotion() {
  return useContext(MotionPreference);
}

export function useSceneProgress(
  target: RefObject<HTMLElement | null>,
  mode: "leave" | "enter" | "travel" = "travel",
) {
  const { scrollYProgress } = useScroll({
    target,
    offset:
      mode === "leave"
        ? ["start start", "end start"]
        : mode === "enter"
          ? ["start end", "start 0.4"]
          : ["start end", "end start"],
  });
  return scrollYProgress;
}

// Measure normal-flow parents and transform only their visual children.
export function ScrollLayer({
  children,
  progress,
  className,
  x = [0, 0],
  y = [0, 0],
  rotate = [0, 0],
  scale = [1, 1],
  testId,
  disabled = false,
  as = "div",
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  className?: string;
  x?: [number, number];
  y?: [number, number];
  rotate?: [number, number];
  scale?: [number, number];
  testId?: string;
  disabled?: boolean;
  as?: "div" | "span";
}) {
  const { paused, compact } = useAgencyMotion();
  const amount = compact ? 0.3 : 1;
  const tx = useTransform(
    progress,
    [0, 1],
    x.map((v) => v * amount),
  );
  const ty = useTransform(
    progress,
    [0, 1],
    y.map((v) => v * amount),
  );
  const rotation = useTransform(
    progress,
    [0, 1],
    rotate.map((v) => v * amount),
  );
  const zoom = useTransform(
    progress,
    [0, 1],
    scale.map((v) => 1 + (v - 1) * amount),
  );
  const transform = useMotionTemplate`translate3d(${tx}px, ${ty}px, 0) rotate(${rotation}deg) scale(${zoom})`;
  const Component = as === "span" ? motion.span : motion.div;
  return (
    <Component
      className={className}
      style={{ transform: paused || disabled ? "none" : transform }}
      data-testid={testId}
    >
      {children}
    </Component>
  );
}

export function ScrollReveal({
  children,
  className,
  distance = 48,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const target = useRef<HTMLDivElement>(null);
  const progress = useSceneProgress(target, "enter");
  return (
    <div ref={target} className={className}>
      <ScrollLayer progress={progress} y={[distance, 0]}>
        {children}
      </ScrollLayer>
    </div>
  );
}

export function ProjectParallax({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  const target = useRef<HTMLDivElement>(null);
  const progress = useSceneProgress(target, "enter");
  return (
    <div ref={target} className={styles.projectTrack}>
      <ScrollLayer
        progress={progress}
        y={[index % 2 ? 92 : 42, 0]}
        testId="project-scroll-layer"
      >
        {children}
      </ScrollLayer>
    </div>
  );
}
