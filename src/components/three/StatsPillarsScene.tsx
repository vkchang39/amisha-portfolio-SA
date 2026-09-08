"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { SkillStat } from "@/lib/resume";
import { SA3D } from "@/lib/gtaSa3d";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";
import "@/lib/gsap";

function lerpColor(a: string, b: string, t: number): string {
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  return ca.lerp(cb, t).getStyle();
}

function createLabelTexture(label: string, value: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(8, 12, 22, 0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = SA3D.hud;
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
  ctx.fillStyle = SA3D.sand;
  ctx.font = "bold 28px Oswald, Impact, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label.toUpperCase(), canvas.width / 2, 40);
  ctx.fillStyle = SA3D.moneyBright;
  ctx.font = "bold 34px Impact, sans-serif";
  ctx.fillText(String(value), canvas.width / 2, 78);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function StatBar3D({
  skill,
  index,
  total,
  animated,
}: {
  skill: SkillStat;
  index: number;
  total: number;
  animated: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const barRef = useRef<THREE.Mesh>(null);
  const capRef = useRef<THREE.Mesh>(null);
  const progress = useRef(animated ? 0 : 1);
  const labelTexture = useMemo(
    () => createLabelTexture(skill.label.split(" ")[0] ?? skill.label, skill.value),
    [skill.label, skill.value]
  );

  useEffect(() => {
    return () => {
      labelTexture?.dispose();
    };
  }, [labelTexture]);

  const spacing = 1.35;
  const startX = -((total - 1) * spacing) / 2;
  const x = startX + index * spacing;
  const targetHeight = (skill.value / 100) * 2.8 + 0.35;
  const barColor = lerpColor(SA3D.grove, SA3D.moneyBright, skill.value / 100);
  const capColor = skill.value >= 85 ? SA3D.moneyBright : SA3D.money;

  useFrame((_, delta) => {
    if (!animated || progress.current >= 1) return;
    progress.current = Math.min(1, progress.current + delta * 1.4);
    const eased = 1 - Math.pow(1 - progress.current, 3);
    const h = targetHeight * eased;

    if (barRef.current) {
      barRef.current.scale.y = Math.max(0.01, h);
      barRef.current.position.y = h / 2 + 0.08;
    }
    if (capRef.current) {
      capRef.current.position.y = h + 0.1;
      capRef.current.scale.setScalar(eased);
    }
  });

  useEffect(() => {
    if (animated) {
      progress.current = 0;
      return;
    }
    progress.current = 1;
    if (barRef.current) {
      barRef.current.scale.y = targetHeight;
      barRef.current.position.y = targetHeight / 2 + 0.08;
    }
    if (capRef.current) {
      capRef.current.position.y = targetHeight + 0.1;
      capRef.current.scale.setScalar(1);
    }
  }, [animated, targetHeight]);

  return (
    <group ref={groupRef} position={[x, 0, 0]}>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.72, 0.08, 0.72]} />
        <meshBasicMaterial color={SA3D.concreteDark} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.58, 0.04, 0.58]} />
        <meshBasicMaterial color={SA3D.concrete} />
      </mesh>

      <mesh ref={barRef} position={[0, targetHeight / 2 + 0.08, 0]} scale={[0.42, targetHeight, 0.42]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={barColor} />
      </mesh>

      <mesh ref={capRef} position={[0, targetHeight + 0.1, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshBasicMaterial color={capColor} />
      </mesh>

      <mesh position={[0, 0.22, 0.22]}>
        <boxGeometry args={[0.5, 0.06, 0.02]} />
        <meshBasicMaterial color={SA3D.hud} />
      </mesh>

      {labelTexture && (
        <mesh position={[0, -0.18, 0.42]}>
          <planeGeometry args={[0.95, 0.36]} />
          <meshBasicMaterial map={labelTexture} transparent toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

function GymRoom({ skills, animated }: { skills: SkillStat[]; animated: boolean }) {
  return (
    <group position={[0, -0.5, 0]}>
      <mesh position={[0, 1.6, -1.8]}>
        <boxGeometry args={[10, 3.2, 0.15]} />
        <meshBasicMaterial color={SA3D.gymWall} />
      </mesh>
      <mesh position={[0, 1.6, -1.72]}>
        <boxGeometry args={[9.2, 2.6, 0.02]} />
        <meshBasicMaterial color={SA3D.hudDark} transparent opacity={0.35} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[10, 4]} />
        <meshBasicMaterial color={SA3D.gymFloor} />
      </mesh>

      {Array.from({ length: 9 }, (_, i) => (
        <mesh
          key={`grid-v-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-4 + i, 0.01, 0]}
        >
          <planeGeometry args={[0.02, 3.6]} />
          <meshBasicMaterial color={SA3D.hud} transparent opacity={0.12} />
        </mesh>
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh
          key={`grid-h-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.012, -1.4 + i * 0.7]}
        >
          <planeGeometry args={[8.2, 0.02]} />
          <meshBasicMaterial color={SA3D.hud} transparent opacity={0.1} />
        </mesh>
      ))}

      <mesh position={[0, 3.1, -1.2]}>
        <boxGeometry args={[3.5, 0.08, 0.2]} />
        <meshBasicMaterial color={SA3D.sand} transparent opacity={0.85} />
      </mesh>
      <pointLight position={[0, 3, -0.8]} intensity={0.4} color={SA3D.sand} distance={8} />

      {skills.map((skill, i) => (
        <StatBar3D
          key={skill.label}
          skill={skill}
          index={i}
          total={skills.length}
          animated={animated}
        />
      ))}
    </group>
  );
}

function SceneContent({ skills, animated }: { skills: SkillStat[]; animated: boolean }) {
  const cameraGroup = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!cameraGroup.current) return;
    const t = state.clock.elapsedTime;
    cameraGroup.current.position.y = Math.sin(t * 0.7) * 0.04;
    cameraGroup.current.rotation.y = Math.sin(t * 0.35) * 0.02;
  });

  return (
    <group ref={cameraGroup}>
      <ambientLight intensity={0.65} />
      <directionalLight position={[2, 5, 3]} intensity={0.5} color={SA3D.sand} />
      <pointLight position={[0, 3, 1]} intensity={0.35} color={SA3D.hud} />
      <GymRoom skills={skills} animated={animated} />
    </group>
  );
}

export default function StatsPillarsScene({ skills }: { skills: SkillStat[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [animateBars, setAnimateBars] = useState(false);
  const { cinematicEnabled } = useCinematicMotion();

  useGSAP(
    () => {
      if (!cinematicEnabled || !containerRef.current) return;
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
            onEnter: () => setAnimateBars(true),
          },
        }
      );
    },
    { scope: containerRef, dependencies: [cinematicEnabled] }
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="stats-pillars-scene" aria-hidden>
      <Canvas
        camera={{ position: [0, 2.2, 5.5], fov: 42 }}
        gl={{ antialias: false, powerPreference: "low-power" }}
        dpr={[1, 1.5]}
        frameloop={visible ? "always" : "never"}
      >
        <color attach="background" args={[SA3D.nightDeep]} />
        <fog attach="fog" args={[SA3D.fogStats, 5, 16]} />
        <SceneContent skills={skills} animated={animateBars && cinematicEnabled} />
      </Canvas>
    </div>
  );
}
