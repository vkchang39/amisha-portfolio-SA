"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useAppReady } from "@/context/AppReadyContext";
import { useLoadingAssets } from "@/hooks/useLoadingAssets";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import "@/lib/gsap";

const MIN_DISPLAY_MS = 1200;

export function LoadingScreen() {
  const container = useRef<HTMLDivElement>(null);
  const mountTimeRef = useRef(0);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const { tip, splash } = useLoadingAssets();
  const { setAppReady } = useAppReady();
  const reducedMotion = useReducedMotion();

  const finishLoading = useCallback(() => {
    const elapsed = mountTimeRef.current
      ? Date.now() - mountTimeRef.current
      : MIN_DISPLAY_MS;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

    window.setTimeout(() => {
      setDone(true);
      setAppReady();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, remaining);
  }, [setAppReady]);

  useEffect(() => {
    mountTimeRef.current = Date.now();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      finishLoading();
    }
  }, [reducedMotion, finishLoading]);

  useGSAP(
    () => {
      if (reducedMotion) return;

      const counter = { value: 0 };
      gsap.to(counter, {
        value: 100,
        duration: 1.1,
        ease: "power2.inOut",
        onUpdate: () => setProgress(Math.round(counter.value)),
      });

      const tl = gsap.timeline({ onComplete: finishLoading });

      tl.to(".loading-bar-fill", {
        scaleX: 1,
        duration: 1.1,
        ease: "power2.inOut",
      })
        .to(".loading-text", { opacity: 0, duration: 0.25 }, "+=0.15")
        .to(
          container.current,
          { opacity: 0, duration: 0.45, ease: "power2.inOut" },
          "-=0.1"
        );
    },
    { scope: container, dependencies: [reducedMotion, finishLoading] }
  );

  if (done) return null;

  const displayProgress = reducedMotion ? 100 : progress;

  return (
    <div
      ref={container}
      className="loading-screen fixed inset-0 z-[var(--z-loading)] bg-black"
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div
        className={`loading-splash ${reducedMotion ? "" : "loading-splash-animated"}`}
        style={{ backgroundImage: `url(${splash})` }}
        aria-hidden
      />
      {/* Soft vignette so LOADING UI stays readable over the collage */}
      <div className="loading-splash-scrim" aria-hidden />

      <div className="loading-text absolute inset-0 flex flex-col items-center justify-center gap-5 px-4">
        <p className="gta-title text-4xl md:text-6xl text-sand tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          LOADING…
        </p>
        <p className="gta-title text-3xl md:text-5xl text-sand/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          Amisha Sharma
        </p>
        <div className="w-56 md:w-72 border border-sand/50 bg-black/55 p-1">
          <div className="loading-bar-fill h-2 w-full origin-left scale-x-0 bg-gradient-to-r from-grove to-money" />
        </div>
        <p className="loading-percent">{displayProgress}%</p>
        <p className="loading-tip">{tip}</p>
      </div>
    </div>
  );
}
