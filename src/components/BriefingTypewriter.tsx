"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";

const CHARS_PER_SEC = 34;

function BriefingPanel({
  text,
  displayed,
  done,
  onSkip,
}: {
  text: string;
  displayed: string;
  done: boolean;
  onSkip?: () => void;
}) {
  return (
    <div
      className="briefing-panel"
      onClick={!done ? onSkip : undefined}
      onKeyDown={(e) => {
        if (!done && onSkip && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSkip();
        }
      }}
      role={!done ? "button" : undefined}
      tabIndex={!done ? 0 : undefined}
      aria-label={!done ? "Skip briefing typewriter" : undefined}
    >
      <p className="briefing-panel-header meta-label tracking-[0.18em]">
        Mission Briefing
      </p>
      <p className="briefing-panel-text text-base md:text-lg leading-relaxed text-sand/90">
        <span className="sr-only">{text}</span>
        <span aria-hidden="true">{displayed}</span>
        {!done && (
          <span className="briefing-cursor" aria-hidden>
            █
          </span>
        )}
      </p>
      {!done && (
        <p className="briefing-skip-hint meta-subtle text-xs mt-2 tracking-[0.1em]">
          Click or tap to skip
        </p>
      )}
    </div>
  );
}

function AnimatedBriefing({ text }: { text: string }) {
  const [visibleChars, setVisibleChars] = useState(0);
  const [done, setDone] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const skipToEnd = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setVisibleChars(text.length);
    setDone(true);
  }, [text.length]);

  useEffect(() => {
    startRef.current = null;

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = (now - startRef.current) / 1000;
      const next = Math.min(text.length, Math.floor(elapsed * CHARS_PER_SEC));
      setVisibleChars(next);

      if (next < text.length) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [text]);

  return (
    <BriefingPanel
      text={text}
      displayed={text.slice(0, visibleChars)}
      done={done}
      onSkip={skipToEnd}
    />
  );
}

export function BriefingTypewriter({ text }: { text: string }) {
  const { cinematicEnabled } = useCinematicMotion();

  if (!cinematicEnabled) {
    return <BriefingPanel text={text} displayed={text} done />;
  }

  return <AnimatedBriefing key={text} text={text} />;
}
