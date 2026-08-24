"use client";

import { useEffect, useRef, useState } from "react";

/** Where the leading edge sits, as a fraction of viewport height. */
const ANCHOR = 0.72;
/** Within this of either end the head is parked, so it should be hidden. */
const HEAD_EPSILON = 0.004;

interface Props {
  children: React.ReactNode;
}

/**
 * Scroll-linked connector behind the timeline entries.
 *
 * Kept as its own client component so the entries themselves stay server
 * rendered — they are passed through as `children` and never enter the bundle.
 */
export default function TimelineRail({ children }: Props) {
  const listRef = useRef<HTMLUListElement>(null);
  const frameRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    // Reduced motion: show the connector fully drawn, never animate it.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    setAnimated(true);

    const measure = () => {
      frameRef.current = 0;
      const { top, height } = list.getBoundingClientRect();
      if (height === 0) return; // inactive tab panel is display:none
      const anchor = window.innerHeight * ANCHOR;
      setProgress(Math.min(1, Math.max(0, (anchor - top) / height)));
    };

    // Coalesce scroll/resize bursts into one measurement per frame.
    const schedule = () => {
      if (!frameRef.current) frameRef.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    // Re-measure when the Work/Education tabs show or hide this panel.
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(list);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resizeObserver.disconnect();
    };
  }, []);

  const headVisible =
    animated && progress > HEAD_EPSILON && progress < 1 - HEAD_EPSILON;

  return (
    <ul ref={listRef} className="relative ml-10">
      {/* Unlit track — feathered at both ends instead of stopping hard. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-border to-transparent"
      />

      {/* Lit portion, drawn downward as the reader scrolls. */}
      <span
        aria-hidden="true"
        style={{ transform: `scaleY(${progress})` }}
        className="pointer-events-none absolute inset-y-0 left-0 w-px origin-top bg-gradient-to-b from-transparent via-foreground/60 to-foreground [will-change:transform]"
      />

      {/* Full-height carrier: translateY(%) resolves against the rail height,
          so the head lands exactly on the leading edge. */}
      {animated && (
        <span
          aria-hidden="true"
          style={{
            transform: `translateY(${progress * 100}%)`,
            opacity: headVisible ? 1 : 0,
          }}
          className="pointer-events-none absolute inset-y-0 left-0 w-px transition-opacity duration-500 [will-change:transform,opacity]"
        >
          <span className="absolute -left-[3px] -top-[3px] size-[7px] rounded-full bg-foreground shadow-[0_0_12px_3px] shadow-foreground/25" />
        </span>
      )}

      {children}
    </ul>
  );
}
