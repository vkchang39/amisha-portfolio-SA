"use client";

import { useRef } from "react";
import styled from "styled-components";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SEGMENTS = 20;

const Track = styled.div`
  display: flex;
  gap: 3px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(232, 213, 160, 0.25);
`;

const Segment = styled.div<{ $filled: boolean }>`
  height: 14px;
  flex: 1;
  background: ${({ $filled }) =>
    $filled ? "linear-gradient(180deg, #7fd96f, #36682c)" : "rgba(232, 213, 160, 0.08)"};
  transform-origin: left center;
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
  font-family: var(--font-oswald), sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.85rem;
  color: #e8d5a0;

  span:last-child {
    font-family: var(--font-pricedown), Impact, sans-serif;
    font-size: 1.1rem;
    color: #54b948;
    letter-spacing: 0.04em;
  }
`;

export function StatBar({ label, value }: { label: string; value: number }) {
  const container = useRef<HTMLDivElement>(null);
  const filledCount = Math.round((value / 100) * SEGMENTS);

  useGSAP(
    () => {
      gsap.from(".stat-segment-filled", {
        scaleX: 0,
        opacity: 0,
        stagger: 0.045,
        duration: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 85%",
        },
      });
    },
    { scope: container }
  );

  return (
    <div ref={container}>
      <Label>
        <span>{label}</span>
        <span>{value}%</span>
      </Label>
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
