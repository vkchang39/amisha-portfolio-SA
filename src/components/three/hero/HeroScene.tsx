"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor, Stars } from "@react-three/drei";
import { useGameUi } from "@/context/GameUiContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CameraRig, PostEffects } from "./CameraAndPost";
import { LosSantosSkyline, SuburbBlocks } from "./City";
import { Highway, Traffic } from "./HighwayTraffic";
import { PalmForest } from "./Palms";
import { Overpass, PowerLines, Signage, StreetLamps } from "./Roadside";
import { DepthHaze, Mountains, Sky, Sun } from "./SkyAtmosphere";

/**
 * SA loading-screen DNA: striped sun, layered depth, dense Los Santos drive.
 * Adaptive quality drops bloom, traffic, lamps, and DPR when the device struggles.
 */
export default function HeroScene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  // Flipped by PerformanceMonitor when the device can't hold frame rate: drops
  // post-processing and DPR rather than letting the hero stutter.
  const [degraded, setDegraded] = useState(false);
  const { pauseOpen, mapOpen } = useGameUi();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isCoarsePointer = useMediaQuery("(pointer: coarse)");
  const lowQuality = isMobile || isCoarsePointer || degraded;
  const active = inView && tabVisible && !pauseOpen && !mapOpen;

  const dpr: [number, number] = degraded
    ? [1, 1]
    : isMobile || isCoarsePointer
      ? [1, 1.2]
      : [1, 1.65];

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 1.45, 10], fov: 64 }}
        gl={{
          antialias: false,
          powerPreference: lowQuality ? "low-power" : "high-performance",
        }}
        dpr={dpr}
        frameloop={active ? "always" : "never"}
      >
        <PerformanceMonitor
          flipflops={2}
          onDecline={() => setDegraded(true)}
          onFallback={() => setDegraded(true)}
        />
        <color attach="background" args={["#180814"]} />
        <fog attach="fog" args={["#6a2848", 14, 82]} />

        <Sky />
        <Stars
          radius={100}
          depth={45}
          count={lowQuality ? 280 : 1600}
          factor={2.8}
          saturation={0.45}
          fade
          speed={0.3}
        />
        <Sun />

        {/* Depth sandwich — near → far haze planes */}
        <DepthHaze z={-12} y={1.5} color="#ff6a28" opacity={0.08} scale={[80, 16, 1]} />
        <DepthHaze z={-26} y={2} color="#c42860" opacity={0.12} scale={[140, 22, 1]} pulse={0.6} />
        <DepthHaze z={-42} y={2.5} color="#ff7a28" opacity={0.18} scale={[180, 26, 1]} />
        <DepthHaze z={-62} y={1} color="#ff8a30" opacity={0.42} scale={[240, 20, 1]} pulse={0.5} />
        <DepthHaze z={-78} y={3} color="#5a1840" opacity={0.25} scale={[280, 40, 1]} />

        <Mountains />
        <LosSantosSkyline />
        <SuburbBlocks />
        <Overpass />
        <PalmForest />
        <Signage />
        <PowerLines />
        {!lowQuality && <StreetLamps />}
        {!lowQuality && <Traffic />}
        <Highway />

        <CameraRig enablePointer={!isCoarsePointer} scrollProgress={scrollProgress} />
        <PostEffects enabled={!lowQuality && active} />
      </Canvas>
      <div className="hero-scene-vignette" aria-hidden />
    </div>
  );
}
