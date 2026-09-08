"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { SA3D } from "@/lib/gtaSa3d";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const SUN_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SUN_FRAGMENT = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vec2 p = vUv - 0.5;
    float d = length(p) * 2.0;
    if (d > 1.0) discard;

    float stripe = sin(vUv.y * 38.0 - uTime * 0.45);
    float cut = smoothstep(0.0, 0.88, vUv.y);
    if (stripe < mix(0.5, -1.0, cut)) discard;

    vec3 top = vec3(1.0, 0.82, 0.38);
    vec3 bottom = vec3(0.92, 0.28, 0.22);
    vec3 col = mix(bottom, top, vUv.y);
    float edge = smoothstep(1.0, 0.78, d);
    gl_FragColor = vec4(col * 1.25, edge);
  }
`;

const SKY_FRAGMENT = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vec3 deep = vec3(0.04, 0.02, 0.09);
    vec3 violet = vec3(0.28, 0.11, 0.34);
    vec3 orange = vec3(0.91, 0.45, 0.16);
    vec3 pink = vec3(0.82, 0.32, 0.38);

    float y = vUv.y;
    vec3 col = mix(orange, pink, smoothstep(0.0, 0.32, y));
    col = mix(col, violet, smoothstep(0.22, 0.58, y));
    col = mix(col, deep, smoothstep(0.48, 1.0, y));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const SKY_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function Sky() {
  return (
    <mesh position={[0, 16, -90]} scale={[280, 120, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={SKY_VERTEX}
        fragmentShader={SKY_FRAGMENT}
        depthWrite={false}
      />
    </mesh>
  );
}

function Sun() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[2, 6.5, -82]} scale={[38, 38, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={SUN_VERTEX}
        fragmentShader={SUN_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function DistantHills() {
  const hills = useMemo(
    () => [
      { x: -55, z: -78, w: 40, h: 8 },
      { x: -15, z: -80, w: 50, h: 12 },
      { x: 30, z: -79, w: 45, h: 10 },
      { x: 62, z: -77, w: 35, h: 7 },
    ],
    []
  );

  return (
    <group position={[0, -2, 0]}>
      {hills.map((hill, i) => (
        <mesh key={i} position={[hill.x, hill.h / 2 - 2, hill.z]} scale={[hill.w, hill.h, 1]}>
          <coneGeometry args={[0.5, 1, 4]} />
          <meshBasicMaterial color={SA3D.silhouette} />
        </mesh>
      ))}
    </group>
  );
}

function Grid({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const group = useRef<THREE.Group>(null);
  const linesMat = useRef<THREE.LineBasicMaterial>(null);
  const scrollRef = useRef(scrollProgress);
  const SPACING = 2.2;

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  const lines = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const points: number[] = [];
    const width = 160;
    const depth = 140;

    for (let x = -width / 2; x <= width / 2; x += SPACING) {
      points.push(x, 0, 0, x, 0, -depth);
    }
    for (let z = 0; z >= -depth; z -= SPACING) {
      points.push(-width / 2, 0, z, width / 2, 0, z);
    }
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return geometry;
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.position.z = (state.clock.elapsedTime * 2.4) % SPACING;
    }
    if (linesMat.current) {
      linesMat.current.opacity = THREE.MathUtils.lerp(
        linesMat.current.opacity,
        0.48 * (1 - scrollRef.current * 0.55),
        0.08
      );
    }
  });

  return (
    <group ref={group} position={[0, -2.2, 8]}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial ref={linesMat} color={SA3D.gridLine} transparent opacity={0.48} />
      </lineSegments>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -70]}>
        <planeGeometry args={[300, 200]} />
        <meshBasicMaterial color={SA3D.road} />
      </mesh>
      {/* Center lane stripe */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -35]}>
        <planeGeometry args={[0.35, 120]} />
        <meshBasicMaterial color={SA3D.sand} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function PalmTree({
  position,
  scale = 1,
  lean = 0,
}: {
  position: [number, number, number];
  scale?: number;
  lean?: number;
}) {
  const frondAngles = useMemo(() => {
    const count = 8;
    return Array.from({ length: count }, (_, i) => (i / count) * Math.PI * 2);
  }, []);

  return (
    <group position={position} scale={scale} rotation={[0, 0, lean]}>
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.08, 0.18, 4.8, 5]} />
        <meshBasicMaterial color={SA3D.trunk} />
      </mesh>
      <group position={[0, 4.9, 0]}>
        {frondAngles.map((angle, i) => (
          <mesh
            key={i}
            rotation={[0.55, angle, 0]}
            position={[Math.sin(angle) * 0.1, 0, Math.cos(angle) * 0.1]}
          >
            <planeGeometry args={[0.12, 2.6]} />
            <meshBasicMaterial color={SA3D.palm} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Palms() {
  return (
    <group position={[0, -2.2, 0]}>
      <PalmTree position={[-13, 0, -18]} scale={1.5} lean={0.06} />
      <PalmTree position={[-18, 0, -30]} scale={2.0} lean={-0.04} />
      <PalmTree position={[14, 0, -20]} scale={1.7} lean={-0.07} />
      <PalmTree position={[20, 0, -34]} scale={2.2} lean={0.05} />
      <PalmTree position={[-26, 0, -44]} scale={2.6} lean={0.02} />
      <PalmTree position={[27, 0, -48]} scale={2.4} lean={-0.03} />
    </group>
  );
}

function Skyline() {
  const buildings = useMemo(() => {
    const items: {
      position: [number, number, number];
      scale: [number, number, number];
      color: string;
      windows: boolean;
    }[] = [];
    let x = -70;
    let seed = 7;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    const colors = [SA3D.silhouette, SA3D.silhouetteAlt, "#120818"];

    while (x < 70) {
      const width = 3 + random() * 6;
      const height = 4 + random() * 14;
      items.push({
        position: [x + width / 2, height / 2 - 2.2, -72],
        scale: [width, height, 3],
        color: colors[Math.floor(random() * colors.length)],
        windows: random() > 0.35,
      });
      x += width + random() * 3.5;
    }
    return items;
  }, []);

  return (
    <group>
      {buildings.map((building, i) => (
        <group key={i} position={building.position}>
          <mesh scale={building.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={building.color} />
          </mesh>
          {building.windows && (
            <mesh position={[0, building.scale[1] * 0.15, 0.52]} scale={[building.scale[0] * 0.7, building.scale[1] * 0.55, 0.1]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color={SA3D.windowDim} transparent opacity={0.6} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

function CameraRig({
  enablePointer,
  scrollProgress = 0,
}: {
  enablePointer: boolean;
  scrollProgress?: number;
}) {
  const scrollRef = useRef(scrollProgress);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useFrame((state) => {
    const { camera, pointer } = state;
    const t = state.clock.elapsedTime;
    const progress = scrollRef.current;
    const targetX = enablePointer ? pointer.x * 1.4 : 0;
    const baseY = 1.4 + Math.sin(t * 0.35) * (enablePointer ? 0.12 : 0.06);
    const targetY = enablePointer ? baseY + pointer.y * 0.65 : baseY;
    const targetZ = 10 + progress * 2;
    const targetRotX = progress * -0.07;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotX, 0.06);
    camera.lookAt(0, 2.2, -60);
  });

  return null;
}

function PostEffects({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;

  return (
    <EffectComposer>
      <Bloom
        intensity={0.45}
        luminanceThreshold={0.35}
        luminanceSmoothing={0.8}
        mipmapBlur
      />
      <Noise opacity={0.045} blendFunction={BlendFunction.OVERLAY} />
      <Vignette eskil={false} offset={0.22} darkness={0.9} />
    </EffectComposer>
  );
}

export default function HeroScene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isCoarsePointer = useMediaQuery("(pointer: coarse)");
  const lowQuality = isMobile || isCoarsePointer;

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

  const starCount = lowQuality ? 400 : 1200;
  const dpr: [number, number] = lowQuality ? [1, 1.25] : [1, 1.5];

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 1.4, 10], fov: 58 }}
        gl={{ antialias: false, powerPreference: lowQuality ? "low-power" : "high-performance" }}
        dpr={dpr}
        frameloop={visible ? "always" : "never"}
      >
        <color attach="background" args={[SA3D.nightDeep]} />
        <fog attach="fog" args={[SA3D.fogHero, 28, 105]} />

        <Sky />
        <Stars
          radius={85}
          depth={35}
          count={starCount}
          factor={2.5}
          saturation={0.25}
          fade
          speed={0.4}
        />
        <Sun />
        <DistantHills />
        <Skyline />
        <Palms />
        <Grid scrollProgress={scrollProgress} />
        <CameraRig enablePointer={!isCoarsePointer} scrollProgress={scrollProgress} />

        <PostEffects enabled={!lowQuality} />
      </Canvas>
    </div>
  );
}
