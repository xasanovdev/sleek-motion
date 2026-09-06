"use client";

import Image from "next/image";
import Link from "next/link";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowUpRightIcon, CursorArrowRaysIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { useMotionPreference } from "@/registry/internal/use-motion-preference";
import styles from "./thread-preview-study.module.css";

type Geometry = { x: number; y: number; end: number; targetX: number; targetY: number; below: boolean };
type Point = { x: number; y: number };
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
const mixPoint = (from: Point, to: Point, amount: number): Point => ({ x: mix(from.x, to.x, amount), y: mix(from.y, to.y, amount) });
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

export function ThreadPreviewStudy() {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [slow, setSlow] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const [geometry, setGeometry] = useState<Geometry>();
  const systemReduced = useMotionPreference();
  const reduce = reduced || systemReduced;
  const instant = reduce || keyboard;
  const regionId = useId();
  const hintId = useId();
  const arrowId = useId();
  const hero = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const dock = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLElement>(null);
  const hovering = useRef(false);
  const suppressed = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const progress = useMotionValue(0);

  const measure = useCallback(() => {
    if (!hero.current || !trigger.current || !dock.current) return;
    const root = hero.current.getBoundingClientRect();
    const word = trigger.current.getBoundingClientRect();
    const target = dock.current.getBoundingClientRect();
    const below = target.top >= word.bottom;
    const next = {
      x: word.left - root.left,
      y: word.bottom - root.top - 5,
      end: word.right - root.left,
      targetX: target.left - root.left + (below ? target.width - 24 : 0),
      targetY: target.top - root.top + (below ? 0 : target.height - 26),
      below,
    };
    setGeometry((previous) => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
  }, []);

  useLayoutEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    for (const node of [hero.current, trigger.current, dock.current]) if (node) observer.observe(node);
    let active = true;
    void document.fonts.ready.then(() => { if (active) measure(); });
    window.addEventListener("resize", measure);
    return () => { active = false; observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [measure]);

  useEffect(() => {
    // One shared progress value keeps the thread and image connected on reversals.
    const target = open ? 1 : 0;
    const playback = animate(progress, target, {
      type: "tween", duration: instant ? 0 : (open ? 0.58 : 0.42) * Math.abs(target - progress.get()) * (slow ? 2.5 : 1),
      ease: "linear",
    });
    return () => playback.stop();
  }, [open, instant, slow, progress]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  function cancelClose() { clearTimeout(closeTimer.current); }
  function dismiss(restoreFocus = false) {
    cancelClose();
    suppressed.current = true;
    hovering.current = false;
    setPinned(false);
    setOpen(false);
    if (restoreFocus) trigger.current?.focus({ preventScroll: true });
  }
  function scheduleClose() {
    cancelClose();
    if (!pinned && !keyboard) closeTimer.current = setTimeout(() => setOpen(false), 160);
  }

  // Keep the preview open while crossing the space between the word and image.
  function inBridge(x: number, y: number) {
    const word = trigger.current?.getBoundingClientRect();
    const target = dock.current?.getBoundingClientRect();
    if (!word || !target) return false;
    const inside = (box: DOMRect) => x >= box.left - 10 && x <= box.right + 10 && y >= box.top - 10 && y <= box.bottom + 10;
    if (inside(word) || inside(target)) return true;
    return target.left > word.right
      ? x >= word.right - 10 && x <= target.left + 10 && y >= Math.min(word.top, target.top) - 10 && y <= Math.max(word.bottom, target.bottom) + 10
      : y >= word.bottom - 10 && y <= target.top + 10 && x >= Math.min(word.left, target.left) - 10 && x <= Math.max(word.right, target.right) + 10;
  }

  const thread = useTransform(() => {
    if (!geometry) return "M 0 0 L 0 0 C 0 0 0 0 0 0";
    const t = smooth(clamp(progress.get() / 0.52));
    const { x, y, end, targetX, targetY, below } = geometry;
    const start = { x: end, y };
    const first = { x: mix(end, targetX, 0.65), y };
    const second = below
      ? { x: targetX, y: mix(y, targetY, 0.35) }
      : { x: mix(end, targetX, 0.65), y: targetY };
    const finish = { x: targetX, y: targetY };
    // Split a fixed downward curve so the growing tip follows the path itself.
    // Enter a stacked card from above and a side-by-side card from the left.
    const a = mixPoint(start, first, t);
    const b = mixPoint(first, second, t);
    const c = mixPoint(second, finish, t);
    const d = mixPoint(a, b, t);
    const e = mixPoint(b, c, t);
    const tip = mixPoint(d, e, t);
    return `M ${x} ${y} L ${end} ${y} C ${a.x} ${a.y}, ${d.x} ${d.y}, ${tip.x} ${tip.y}`;
  });
  const arrowOpacity = useTransform(progress, [0, 0.15, 1], [0, 1, 1]);
  const cardOpacity = useTransform(progress, [0, 0.52, 0.62, 1], [0, 0, 1, 1]);
  const cardClip = useTransform(() => {
    const amount = (1 - smooth(clamp((progress.get() - 0.52) / 0.48))) * 100;
    return geometry?.below ? `inset(0 0 ${amount}% 0 round 12px)` : `inset(${amount}% 0 0 0 round 12px)`;
  });
  const cardRotate = useTransform(() => -5 * (1 - smooth(clamp((progress.get() - 0.52) / 0.48))));
  const noteOpacity = useTransform(progress, [0, 0.22, 1], [1, 0, 0]);
  const captionOpacity = useTransform(progress, [0, 0.65, 1], [0, 0, 1]);

  return <main className={`${styles.page} antialiased`}
    onKeyDown={(event) => {
      if (event.key === "Escape" && open) { event.preventDefault(); event.stopPropagation(); setKeyboard(true); dismiss(preview.current?.contains(document.activeElement)); }
    }}>
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" aria-label="Sleekmation homepage" className={styles.wordmark}>studio<span> / one</span></Link>
        <p className={styles.headerNote}>Independent design & development</p>
        <Link href="/animations" className={styles.libraryLink}><ArrowLeftIcon className="size-4 shrink-0" aria-hidden="true" />Library</Link>
      </header>

      <div ref={hero} className={styles.composition} data-open={open} data-measured={!!geometry}
        onPointerMove={(event) => {
          if (event.pointerType !== "mouse" || !hovering.current || pinned || keyboard) return;
          if (inBridge(event.clientX, event.clientY)) cancelClose(); else scheduleClose();
        }}
        onPointerLeave={() => { hovering.current = false; suppressed.current = false; scheduleClose(); }}>
        <div className={styles.introduction}>
          <p className={styles.eyebrow}><span aria-hidden="true" />A little thought. A lot of care.</p>
          <h1 className={`${styles.headline} text-6xl`}>I turn rough<br />ideas into<br />
            <button ref={trigger} type="button" className={styles.word} aria-expanded={open} aria-controls={regionId} aria-describedby={hintId}
              onPointerEnter={(event) => {
                if (event.pointerType !== "mouse") return;
                suppressed.current = false; hovering.current = true; cancelClose(); setKeyboard(false); setOpen(true);
              }}
              onPointerLeave={() => { suppressed.current = false; scheduleClose(); }}
              onFocus={(event) => {
                if (event.currentTarget.matches(":focus-visible") && !suppressed.current) { setKeyboard(true); setOpen(true); }
              }}
              onBlur={(event) => {
                if (preview.current?.contains(event.relatedTarget)) return;
                setKeyboard(false); suppressed.current = false;
                if (!pinned && !hovering.current) setOpen(false);
              }}
              onClick={(event) => {
                setKeyboard(event.detail === 0); cancelClose();
                if (pinned) dismiss(); else { suppressed.current = false; setPinned(true); setOpen(true); }
              }}>
              interfaces<span className={styles.fallbackLine} aria-hidden="true" />
            </button><br />people enjoy.
          </h1>
          <p className={styles.description}>Thoughtful websites. Useful details. The kind of work that feels as good as it looks.</p>
          <p id={hintId} className={styles.hint}><CursorArrowRaysIcon className="size-4 shrink-0" aria-hidden="true" /><span>There’s a little more behind <em>interfaces</em>.<small>Hover to peek. Tap to keep it open.</small></span></p>
        </div>

        <div className={styles.previewColumn}>
          <div ref={dock} className={styles.dock}>
            <motion.div className={styles.waitingNote} style={{ opacity: noteOpacity }} aria-hidden="true">
              <p className={styles.noteNumber}>01 / A closer look</p>
              <p className={styles.noteText}>Good work has<br />a story behind it.</p>
              <p className={styles.noteHint}>Follow the thread.</p>
            </motion.div>
            <motion.figure ref={preview} id={regionId} role="region" aria-label="Sleekmation project preview" className={styles.project}
              inert={!open} aria-hidden={!open} data-testid="thread-project"
              style={{ opacity: cardOpacity, clipPath: instant ? "none" : cardClip, rotate: instant ? 0 : cardRotate, transformOrigin: geometry?.below ? "right top" : "left bottom" }}
              onPointerEnter={() => { hovering.current = true; cancelClose(); }}
              onPointerLeave={scheduleClose}
              onFocusCapture={() => { setKeyboard(true); cancelClose(); }}
              onBlurCapture={(event) => {
                if (event.currentTarget.contains(event.relatedTarget) || event.relatedTarget === trigger.current) return;
                setKeyboard(false);
                if (!pinned) setOpen(false);
              }}>
              <div className={styles.projectTop}><p><span aria-hidden="true" />sleekmation</p><button type="button" aria-label="Close project preview" className={styles.close} onClick={(event) => { setKeyboard(event.detail === 0); dismiss(true); }}><XMarkIcon className="size-4 shrink-0" aria-hidden="true" /></button></div>
              <div className={styles.projectVisual}><Image src="/experiments/thread-preview/sleekmation.png" alt="Sleekmation’s homepage, with its motion playground and animation examples." width={1280} height={920} priority unoptimized /></div>
              <figcaption className={styles.projectBottom}><div><p>A little motion.<br />A better experience.</p><small>Design & development · Sleekmation</small></div><Link href="/animations" aria-label="Explore Sleekmation animations"><ArrowUpRightIcon className="size-4 shrink-0" aria-hidden="true" /></Link></figcaption>
            </motion.figure>
          </div>
          <motion.p className={styles.projectCaption} style={{ opacity: captionOpacity }} aria-hidden={!open}>A word becomes a window into the work.</motion.p>
        </div>

        <svg className={styles.thread} aria-hidden="true">
          <motion.path data-testid="thread-path" d={thread} markerEnd={`url(#${arrowId})`} />
          <defs><marker id={arrowId} markerWidth={10} markerHeight={10} refX={8} refY={5} orient="auto" markerUnits="userSpaceOnUse"><motion.path d="M 2 1 L 8 5 L 2 9" style={{ opacity: arrowOpacity }} /></marker></defs>
        </svg>
      </div>

      <footer className={styles.footer}>
        <div><p className={styles.footerTitle}>ThreadPreview <span>/ Study 01</span></p><p className={styles.footerDescription}>An expressive detail in a real portfolio setting.</p></div>
        <div className={styles.controls}>
          <label><input type="checkbox" checked={slow} disabled={reduce} onChange={(event) => setSlow(event.target.checked)} />Slow motion</label>
          <label><input type="checkbox" checked={reduce} disabled={systemReduced} onChange={(event) => setReduced(event.target.checked)} />{systemReduced ? "Reduced motion (system)" : "Reduced motion"}</label>
        </div>
      </footer>
    </div>
  </main>;
}
