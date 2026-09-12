"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { seededRand } from "./utils";

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

    float bands = sin(vUv.y * 32.0 - uTime * 0.28);
    float mask = step(0.05, bands);
    float horizonCut = smoothstep(0.0, 0.38, vUv.y);
    if (mask < 0.5 && vUv.y > 0.1) discard;
    if (vUv.y < 0.06) discard;

    vec3 top = vec3(1.0, 0.94, 0.45);
    vec3 mid = vec3(1.0, 0.52, 0.1);
    vec3 bottom = vec3(0.95, 0.2, 0.06);
    vec3 col = mix(bottom, mid, smoothstep(0.12, 0.48, vUv.y));
    col = mix(col, top, smoothstep(0.48, 0.95, vUv.y));
    float edge = smoothstep(1.0, 0.8, d) * horizonCut;
    gl_FragColor = vec4(col * 1.4, edge);
  }
`;

const SKY_FRAGMENT = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec3 deep = vec3(0.05, 0.015, 0.12);
    vec3 purple = vec3(0.36, 0.05, 0.46);
    vec3 pink = vec3(0.95, 0.18, 0.46);
    vec3 orange = vec3(1.0, 0.4, 0.06);
    vec3 gold = vec3(1.0, 0.75, 0.22);

    float y = vUv.y;
    vec3 col = mix(gold, orange, smoothstep(0.0, 0.18, y));
    col = mix(col, pink, smoothstep(0.1, 0.38, y));
    col = mix(col, purple, smoothstep(0.32, 0.64, y));
    col = mix(col, deep, smoothstep(0.55, 1.0, y));

    float glow = exp(-pow((y - 0.17) * 5.2, 2.0));
    col = mix(col, gold, glow * 0.9);

    float c1 = noise(vec2(vUv.x * 2.6 + uTime * 0.01, y * 4.8));
    float c2 = noise(vec2(vUv.x * 6.0 - uTime * 0.016, y * 10.0));
    float clouds = c1 * 0.6 + c2 * 0.4;
    clouds *= smoothstep(0.22, 0.48, y) * smoothstep(0.92, 0.52, y);
    col = mix(col, vec3(0.78, 0.26, 0.48), clouds * 0.45);

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

export function Sky() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((state) => {
    if (material.current) material.current.uniforms.uTime.value = state.clock.elapsedTime;
  });
  return (
    <mesh position={[0, 14, -96]} scale={[340, 150, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={SKY_VERTEX}
        fragmentShader={SKY_FRAGMENT}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

export function Sun() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((state) => {
    if (material.current) material.current.uniforms.uTime.value = state.clock.elapsedTime;
  });
  return (
    <group position={[0, 2.4, -84]}>
      <mesh scale={[110, 70, 1]} position={[0, 0, -3]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#ff4a10" transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <mesh scale={[70, 70, 1]} position={[0, 0, -1.5]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#ffb040" transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <mesh scale={[62, 62, 1]}>
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
    </group>
  );
}

/** Atmospheric depth slabs between world layers */
export function DepthHaze({
  z,
  y = 2,
  color,
  opacity,
  scale = [220, 28, 1] as [number, number, number],
  pulse = 0,
}: {
  z: number;
  y?: number;
  color: string;
  opacity: number;
  scale?: [number, number, number];
  pulse?: number;
}) {
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const base = opacity;
  useFrame((state) => {
    if (!mat.current || !pulse) return;
    mat.current.opacity = base + Math.sin(state.clock.elapsedTime * pulse) * 0.04;
  });
  return (
    <mesh position={[0, y, z]} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        ref={mat}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  );
}

export function Mountains() {
  const peaks = useMemo(() => {
    const seed = { v: 99 };
    return Array.from({ length: 14 }, (_, i) => ({
      x: -110 + i * 17 + seededRand(seed) * 6,
      w: 28 + seededRand(seed) * 36,
      h: 12 + seededRand(seed) * 22,
      z: seededRand(seed) * 4,
    }));
  }, []);

  return (
    <group position={[0, -2.8, -88]}>
      {peaks.map((p, i) => (
        <mesh key={i} position={[p.x, p.h * 0.32, p.z]} scale={[p.w, p.h, 1]}>
          <coneGeometry args={[0.55, 1, 3]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#040208" : "#07040e"} />
        </mesh>
      ))}
      <mesh position={[0, 1.5, 3]} scale={[260, 10, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#06030c" />
      </mesh>
    </group>
  );
}
