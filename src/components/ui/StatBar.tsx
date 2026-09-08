"use client";

import { useRef } from "react";
import styled from "styled-components";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";
import "@/lib/gsap";

const SEGMENTS = 20;

const Track = styled.div`
  display: flex;
  gap: 3px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid var(--surface-border);
`;

const Segment = styled.div<{ $filled: boolean }>`
  height: 14px;
  flex: 1;
  background: ${({ $filled }) =>
    $filled
      ? "linear-gradient(180deg, #7fd96f, var(--color-grove))"
      : "rgba(232, 213, 160, 0.08)"};
  transform-origin: left center;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 6px;
  font-family: var(--font-oswald), sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.85rem;
  color: var(--color-sand);
`;

const Label = styled.span`
  flex: 1;
`;

const Value = styled.span`
  font-family: var(--font-pricedown), Impact, sans-serif;
  font-size: 1.1rem;
  color: var(--color-money);
  letter-spacing: 0.04em;
  flex-shrink: 0;
`;

function StatArrow({ direction }: { direction: "up" | "down" }) {
  return (
    <svg
      className="gym-stat-arrow"
      viewBox="0 0 12 12"
      width="12"
      height="12"
      aria-hidden
    >
      {direction === "up" ? (
        <path d="M6 2 L10 8 L2 8 Z" fill="currentColor" />
      ) : (
        <path d="M6 10 L2 4 L10 4 Z" fill="currentColor" />
      )}
    </svg>
  );
}

export function StatBar({ label, value }: { label: string; value: number }) {
  const container = useRef<HTMLDivElement>(null);
  const { cinematicEnabled } = useCinematicMotion();
  const filledCount = Math.round((value / 100) * SEGMENTS);
  const showArrow = value >= 85;

  useGSAP(
    () => {
      if (!cinematicEnabled || !container.current) return;

      gsap.set(".stat-segment-filled", { scaleX: 0, opacity: 0 });
      gsap.to(".stat-segment-filled", {
        scaleX: 1,
        opacity: 1,
        stagger: 0.045,
        duration: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 85%",
        },
      });
    },
    { scope: container, dependencies: [cinematicEnabled] }
  );

  return (
    <div ref={container} className="gym-stat-row">
      <LabelRow>
        <Label>{label}</Label>
        {showArrow && <StatArrow direction="up" />}
        <Value>{value}%</Value>
      </LabelRow>
      <Track>
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <Segment
            key={i}
            $filled={i < filledCount}
            className={i < filledCount ? "stat-segment-filled" : undefined}
          />
        ))}
      </Track>
    </div>
  );
}
