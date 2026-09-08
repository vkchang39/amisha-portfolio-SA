"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { SA3D } from "@/lib/gtaSa3d";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function createCallTexture(text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(8, 12, canvas.width - 16, canvas.height - 24);
  ctx.strokeStyle = SA3D.moneyBright;
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 14, canvas.width - 20, canvas.height - 28);
  ctx.font = "bold 52px Impact, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = SA3D.moneyBright;
  ctx.shadowColor = SA3D.grove;
  ctx.shadowBlur = 18;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function StreetLamp() {
  return (
    <group position={[2.2, 0, 0.5]}>
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 3.6, 6]} />
        <meshBasicMaterial color={SA3D.concrete} />
      </mesh>
      <mesh position={[0, 3.5, 0.15]}>
        <boxGeometry args={[0.35, 0.12, 0.35]} />
        <meshBasicMaterial color={SA3D.sand} />
      </mesh>
      <pointLight position={[0, 3.4, 0.3]} intensity={0.6} color={SA3D.sunset} distance={6} />
    </group>
  );
}

function PhoneHandset() {
  return (
    <group position={[0, 1.35, 0.35]}>
      <mesh rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.12, 0.35, 0.08]} />
        <meshBasicMaterial color={SA3D.nightDeep} />
      </mesh>
      <mesh position={[0, -0.22, 0.05]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.18, 6]} />
        <meshBasicMaterial color={SA3D.nightDeep} />
      </mesh>
    </group>
  );
}

function NeonTube({
  position,
  rotation = [0, 0, 0] as [number, number, number],
  args,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  args: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <meshBasicMaterial color={SA3D.moneyBright} transparent opacity={0.85} />
    </mesh>
  );
}

function Booth({ onActivate }: { onActivate?: () => void }) {
  const signRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const isCoarsePointer = useMediaQuery("(pointer: coarse)");
  const callTexture = useMemo(() => createCallTexture("CALL"), []);

  useEffect(() => {
    return () => {
      callTexture?.dispose();
    };
  }, [callTexture]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (signRef.current) {
      const mat = signRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.72 + Math.sin(t * 2.5) * 0.22;
    }
    if (groupRef.current && !isCoarsePointer) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        state.pointer.x * 0.12,
        0.04
      );
    }
  });

  const handleActivate = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onActivate?.();
  };

  return (
    <group
      ref={groupRef}
      position={[0, -0.6, 0]}
      onClick={handleActivate}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[8, 5]} />
        <meshBasicMaterial color={SA3D.asphalt} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial color={SA3D.concrete} />
      </mesh>

      <mesh position={[0, 1.35, 0]}>
        <boxGeometry args={[1.15, 2.5, 1.15]} />
        <meshBasicMaterial color={SA3D.blood} />
      </mesh>

      <mesh position={[0, 1.35, 0]}>
        <boxGeometry args={[1.24, 2.6, 1.24]} />
        <meshBasicMaterial color={SA3D.bloodDark} wireframe transparent opacity={0.18} />
      </mesh>

      <mesh position={[0, 2.72, 0]}>
        <boxGeometry args={[1.35, 0.18, 1.35]} />
        <meshBasicMaterial color={SA3D.bloodDark} />
      </mesh>
      <mesh position={[0, 2.85, 0]}>
        <boxGeometry args={[1.1, 0.06, 1.1]} />
        <meshBasicMaterial color={SA3D.nightDeep} />
      </mesh>

      <mesh position={[-0.42, 1.55, 0]}>
        <planeGeometry args={[0.22, 1.6]} />
        <meshBasicMaterial color={SA3D.hud} transparent opacity={0.32} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.42, 1.55, 0]}>
        <planeGeometry args={[0.22, 1.6]} />
        <meshBasicMaterial color={SA3D.hud} transparent opacity={0.32} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.55, 0.58]}>
        <planeGeometry args={[0.75, 1.6]} />
        <meshBasicMaterial color={SA3D.hudDark} transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>

      <NeonTube position={[-0.55, 1.55, 0.58]} args={[0.04, 1.7, 0.04]} />
      <NeonTube position={[0.55, 1.55, 0.58]} args={[0.04, 1.7, 0.04]} />
      <NeonTube position={[0, 2.4, 0.58]} args={[1.05, 0.04, 0.04]} />

      <mesh position={[0, 1.3, 0.2]}>
        <boxGeometry args={[0.7, 2, 0.5]} />
        <meshBasicMaterial color={SA3D.nightDeep} />
      </mesh>

      <PhoneHandset />

      <mesh ref={signRef} position={[0, 2.35, 0.62]}>
        <planeGeometry args={[0.78, 0.3]} />
        <meshBasicMaterial
          map={callTexture ?? undefined}
          color={callTexture ? "#ffffff" : SA3D.moneyBright}
          transparent
          opacity={0.9}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0, 2.35, 0.9]} intensity={0.55} color={SA3D.moneyBright} distance={3.5} />

      <StreetLamp />
    </group>
  );
}

export default function PhoneBoothScene({
  onActivate,
}: {
  onActivate?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="phone-booth-scene" aria-hidden>
      <Canvas
        camera={{ position: [0, 1.6, 4.2], fov: 38 }}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        dpr={[1, 1.5]}
        frameloop={visible ? "always" : "never"}
      >
        <fog attach="fog" args={[SA3D.violetDeep, 4, 12]} />
        <ambientLight intensity={0.45} color={SA3D.violet} />
        <Booth onActivate={onActivate} />
      </Canvas>
    </div>
  );
}
