"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { SA3D } from "@/lib/gtaSa3d";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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

function Booth() {
  const signRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const isCoarsePointer = useMediaQuery("(pointer: coarse)");

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (signRef.current) {
      const mat = signRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.75 + Math.sin(t * 2.5) * 0.2;
    }
    if (groupRef.current && !isCoarsePointer) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        state.pointer.x * 0.12,
        0.04
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Sidewalk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[8, 5]} />
        <meshBasicMaterial color={SA3D.asphalt} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial color={SA3D.concrete} />
      </mesh>

      {/* Booth body — classic SA red */}
      <mesh position={[0, 1.35, 0]}>
        <boxGeometry args={[1.15, 2.5, 1.15]} />
        <meshBasicMaterial color={SA3D.blood} />
      </mesh>

      {/* Dark frame trim */}
      <mesh position={[0, 1.35, 0]}>
        <boxGeometry args={[1.22, 2.58, 1.22]} />
        <meshBasicMaterial color={SA3D.bloodDark} wireframe transparent opacity={0.15} />
      </mesh>

      {/* Roof cap */}
      <mesh position={[0, 2.72, 0]}>
        <boxGeometry args={[1.35, 0.18, 1.35]} />
        <meshBasicMaterial color={SA3D.bloodDark} />
      </mesh>
      <mesh position={[0, 2.85, 0]}>
        <boxGeometry args={[1.1, 0.06, 1.1]} />
        <meshBasicMaterial color={SA3D.nightDeep} />
      </mesh>

      {/* Glass panels */}
      <mesh position={[-0.42, 1.55, 0]}>
        <planeGeometry args={[0.22, 1.6]} />
        <meshBasicMaterial color={SA3D.hud} transparent opacity={0.28} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.42, 1.55, 0]}>
        <planeGeometry args={[0.22, 1.6]} />
        <meshBasicMaterial color={SA3D.hud} transparent opacity={0.28} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.55, 0.58]}>
        <planeGeometry args={[0.75, 1.6]} />
        <meshBasicMaterial color={SA3D.hudDark} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Interior shadow */}
      <mesh position={[0, 1.3, 0.2]}>
        <boxGeometry args={[0.7, 2, 0.5]} />
        <meshBasicMaterial color={SA3D.nightDeep} />
      </mesh>

      <PhoneHandset />

      {/* CALL sign — Grove green neon */}
      <mesh ref={signRef} position={[0, 2.35, 0.6]}>
        <planeGeometry args={[0.65, 0.22]} />
        <meshBasicMaterial color={SA3D.moneyBright} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 2.35, 0.59]}>
        <planeGeometry args={[0.55, 0.02]} />
        <meshBasicMaterial color={SA3D.grove} />
      </mesh>

      <StreetLamp />
    </group>
  );
}

export default function PhoneBoothScene() {
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
        <Booth />
      </Canvas>
    </div>
  );
}
