"use client";

import { useEffect, useRef, useState } from "react";
import { useGameAudio } from "@/hooks/useGameAudio";

/** Small copy-to-clipboard control with a transient "Copied" state and a live-region announcement. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);
  const { play } = useGameAudio();

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      play("menuSelect");
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked (insecure context / permissions) — the mailto link still works.
    }
  };

  return (
    <button
      type="button"
      className={`copy-btn ${copied ? "copy-btn-done" : ""}`}
      onClick={copy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
    >
      {copied ? "Copied" : "Copy"}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? `${label} copied to clipboard` : ""}
      </span>
    </button>
  );
}
