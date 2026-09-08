"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor, Stars } from "@react-three/drei";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { SA3D } from "@/lib/gtaSa3d";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/* ─────────────────────────────────────────────────────────────────────────
   SA loading-screen DNA: striped sun, layered depth, dense Los Santos drive
   ───────────────────────────────────────────────────────────────────────── */

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

function seededRand(seed: { v: number }) {
  seed.v = (seed.v * 16807) % 2147483647;
  return (seed.v - 1) / 2147483646;
}

function makeLabelTexture(
  lines: string[],
  bg: string,
  fg: string,
  w = 512,
  h = 256
) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = fg;
  ctx.lineWidth = 10;
  ctx.strokeRect(12, 12, w - 24, h - 24);
  ctx.fillStyle = fg;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const size = lines.length > 1 ? 52 : 72;
  ctx.font = `bold ${size}px Impact, Arial Black, sans-serif`;
  lines.forEach((line, i) => {
    const y = h / 2 + (i - (lines.length - 1) / 2) * (size + 8);
    ctx.fillText(line.toUpperCase(), w / 2, y);
  });
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function Sky() {
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

function Sun() {
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
function DepthHaze({
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

function Mountains() {
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

/** Static repeated prop rendered as a single InstancedMesh. */
function InstancedRepeat({
  count,
  place,
  children,
}: {
  count: number;
  place: (index: number, matrix: THREE.Matrix4) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      place(i, m);
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [count, place]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      {children}
    </instancedMesh>
  );
}

function Highway() {
  const grid = useRef<THREE.Group>(null);
  const dashes = useRef<THREE.Group>(null);
  const SPACING = 1.6;

  const gridGeo = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const pts: number[] = [];
    for (let x = -22; x <= 22; x += SPACING) pts.push(x, 0, 6, x, 0, -150);
    for (let z = 6; z >= -150; z -= SPACING) pts.push(-22, 0, z, 22, 0, z);
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geometry;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (grid.current) grid.current.position.z = (t * 5.2) % SPACING;
    if (dashes.current) dashes.current.position.z = (t * 16) % 5.5;
  });

  return (
    <group position={[0, -2.2, 8]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -70]}>
        <planeGeometry args={[52, 190]} />
        <meshBasicMaterial color="#241610" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-18, -0.04, -70]}>
        <planeGeometry args={[16, 190]} />
        <meshBasicMaterial color="#3a2618" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[18, -0.04, -70]}>
        <planeGeometry args={[16, 190]} />
        <meshBasicMaterial color="#3a2618" />
      </mesh>
      {/* Grass strips */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-12.5, -0.03, -50]}>
        <planeGeometry args={[3.5, 120]} />
        <meshBasicMaterial color="#1a2a10" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[12.5, -0.03, -50]}>
        <planeGeometry args={[3.5, 120]} />
        <meshBasicMaterial color="#1a2a10" />
      </mesh>

      <group ref={grid}>
        <lineSegments geometry={gridGeo}>
          <lineBasicMaterial color="#e87828" transparent opacity={0.58} />
        </lineSegments>
      </group>

      <group ref={dashes}>
        <InstancedRepeat
          count={36}
          place={(i, m) =>
            m.compose(
              new THREE.Vector3(0, 0.025, -i * 5.5),
              new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)),
              new THREE.Vector3(1, 1, 1)
            )
          }
        >
          <planeGeometry args={[0.32, 2.6]} />
          <meshBasicMaterial color="#e8d5a0" />
        </InstancedRepeat>
      </group>

      {[-5.4, 5.4].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, -60]}>
          <planeGeometry args={[0.14, 150]} />
          <meshBasicMaterial color="#c8b070" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Jersey barriers — tapered prism, elongated along the curb (one instanced draw) */}
      <InstancedRepeat
        count={36}
        place={(i, m) => {
          const x = i % 2 === 0 ? -6.6 : 6.6;
          const row = Math.floor(i / 2);
          m.compose(
            new THREE.Vector3(x, 0.35, (x < 0 ? -4 : -6) - row * 7),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 4, 0)),
            new THREE.Vector3(0.55, 1, 2.6)
          );
        }}
      >
        <cylinderGeometry args={[0.32, 0.58, 0.7, 4]} />
        <meshBasicMaterial color="#4a4038" />
      </InstancedRepeat>
    </group>
  );
}

/** Bake a solid colour into a geometry's vertex colours so parts can be merged into one draw call. */
function paintGeometry(geo: THREE.BufferGeometry, hex: string): THREE.BufferGeometry {
  const c = new THREE.Color(hex);
  const count = geo.attributes.position.count;
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

/** Trunk + rings merged into one geometry (was 5 meshes per palm). */
function buildPalmTrunkGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const trunk = new THREE.CylinderGeometry(0.07, 0.24, 5.6, 7);
  trunk.translate(0, 2.8, 0);
  parts.push(paintGeometry(trunk, "#3a2818"));
  for (const y of [1.1, 2.2, 3.3, 4.3]) {
    const ring = new THREE.TorusGeometry(0.16 - y * 0.012, 0.035, 5, 8);
    ring.rotateX(Math.PI / 2);
    ring.translate(0, y, 0);
    parts.push(paintGeometry(ring, "#2a1c12"));
  }
  const merged = mergeGeometries(parts, false);
  parts.forEach((p) => p.dispose());
  return merged;
}

/** Crown + 12 fronds merged into one geometry (was 13 meshes per palm). Origin at canopy pivot. */
function buildPalmCanopyGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const crown = new THREE.SphereGeometry(0.55, 6, 5);
  crown.translate(0, 0.1, 0);
  parts.push(paintGeometry(crown, "#081608"));
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const frond = new THREE.ConeGeometry(0.22, 3.6, 4);
    // Equivalent of Euler [0.95, angle, 0.15] (XYZ order) applied to an object.
    frond.rotateZ(0.15);
    frond.rotateY(angle);
    frond.rotateX(0.95);
    frond.translate(Math.sin(angle) * 0.2, 0.05, Math.cos(angle) * 0.2);
    parts.push(paintGeometry(frond, i % 2 ? "#07140a" : "#0c1e0e"));
  }
  const merged = mergeGeometries(parts, false);
  parts.forEach((p) => p.dispose());
  return merged;
}

function PalmTree({
  position,
  scale = 1,
  lean = 0,
  trunkGeo,
  canopyGeo,
  material,
}: {
  position: [number, number, number];
  scale?: number;
  lean?: number;
  trunkGeo: THREE.BufferGeometry;
  canopyGeo: THREE.BufferGeometry;
  material: THREE.Material;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const canopyRef = useRef<THREE.Mesh>(null);
  const phase = position[0] * 0.08 + position[2] * 0.04;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.z = lean + Math.sin(t * 0.5 + phase) * 0.04;
    }
    if (canopyRef.current) {
      canopyRef.current.rotation.y = Math.sin(t * 0.75 + phase) * 0.07;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh geometry={trunkGeo} material={material} />
      <mesh ref={canopyRef} geometry={canopyGeo} material={material} position={[0, 5.5, 0]} />
    </group>
  );
}

function PalmForest() {
  const palms = useMemo(() => {
    const seed = { v: 55 };
    const list: { pos: [number, number, number]; s: number; lean: number }[] = [];
    for (let i = 0; i < 12; i++) {
      list.push({
        pos: [-9.2 - seededRand(seed) * 2.5, 0, -4 - i * 5.5],
        s: 1.4 + seededRand(seed) * 0.9,
        lean: (seededRand(seed) - 0.5) * 0.12,
      });
      list.push({
        pos: [9.2 + seededRand(seed) * 2.5, 0, -6 - i * 5.5],
        s: 1.4 + seededRand(seed) * 0.9,
        lean: (seededRand(seed) - 0.5) * 0.12,
      });
    }
    for (let i = 0; i < 8; i++) {
      list.push({
        pos: [-20 - seededRand(seed) * 10, 0, -25 - i * 8],
        s: 2.2 + seededRand(seed) * 1.2,
        lean: (seededRand(seed) - 0.5) * 0.08,
      });
      list.push({
        pos: [20 + seededRand(seed) * 10, 0, -28 - i * 8],
        s: 2.2 + seededRand(seed) * 1.2,
        lean: (seededRand(seed) - 0.5) * 0.08,
      });
    }
    return list;
  }, []);

  const trunkGeo = useMemo(() => buildPalmTrunkGeometry(), []);
  const canopyGeo = useMemo(() => buildPalmCanopyGeometry(), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ vertexColors: true }), []);
  useEffect(
    () => () => {
      trunkGeo.dispose();
      canopyGeo.dispose();
      material.dispose();
    },
    [trunkGeo, canopyGeo, material]
  );

  return (
    <group position={[0, -2.2, 0]}>
      {palms.map((p, i) => (
        <PalmTree
          key={i}
          position={p.pos}
          scale={p.s}
          lean={p.lean}
          trunkGeo={trunkGeo}
          canopyGeo={canopyGeo}
          material={material}
        />
      ))}
    </group>
  );
}

function PowerLines() {
  const poles = useMemo(() => {
    const list: { x: number; z: number }[] = [];
    for (let z = -8; z > -75; z -= 11) {
      list.push({ x: -7.8, z }, { x: 7.8, z });
    }
    return list;
  }, []);

  return (
    <group position={[0, -2.2, 0]}>
      {poles.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]}>
          <mesh position={[0, 2.8, 0]}>
            <cylinderGeometry args={[0.09, 0.14, 5.6, 6]} />
            <meshBasicMaterial color="#161018" />
          </mesh>
          <mesh position={[0, 5.3, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 2.6, 5]} />
            <meshBasicMaterial color="#161018" />
          </mesh>
          {/* Insulators */}
          <mesh position={[-0.9, 5.3, 0]}>
            <sphereGeometry args={[0.1, 5, 4]} />
            <meshBasicMaterial color="#2a1c20" />
          </mesh>
          <mesh position={[0.9, 5.3, 0]}>
            <sphereGeometry args={[0.1, 5, 4]} />
            <meshBasicMaterial color="#2a1c20" />
          </mesh>
          <mesh position={[0, 5.55, 0]}>
            <sphereGeometry args={[0.07, 4, 4]} />
            <meshBasicMaterial color="#1a1014" />
          </mesh>
        </group>
      ))}
      {[-8, -19, -30, -41, -52, -63].map((z, i) => (
        <group key={`wire-${i}`}>
          <mesh position={[0, 3.05, z]} rotation={[0, 0, Math.PI / 2 + 0.015]}>
            <cylinderGeometry args={[0.012, 0.012, 15.4, 4]} />
            <meshBasicMaterial color="#0a080c" />
          </mesh>
          <mesh position={[0, 2.85, z]} rotation={[0, 0, Math.PI / 2 - 0.01]}>
            <cylinderGeometry args={[0.01, 0.01, 15.4, 4]} />
            <meshBasicMaterial color="#0a080c" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function StreetLamps() {
  const lamps = useMemo(() => {
    const list: { x: number; z: number }[] = [];
    for (let z = -6; z > -70; z -= 9) {
      list.push({ x: -6.1, z }, { x: 6.1, z: z - 2 });
    }
    return list;
  }, []);

  return (
    <group position={[0, -2.2, 0]}>
      {lamps.map((l, i) => {
        const inward = l.x > 0 ? -1 : 1;
        return (
          <group key={i} position={[l.x, 0, l.z]}>
            <mesh position={[0, 2.0, 0]}>
              <cylinderGeometry args={[0.06, 0.1, 4.0, 6]} />
              <meshBasicMaterial color="#1c1418" />
            </mesh>
            {/* Curved arm via two angled cylinders */}
            <mesh
              position={[inward * 0.35, 3.95, 0]}
              rotation={[0, 0, inward * 0.9]}
            >
              <cylinderGeometry args={[0.04, 0.05, 0.9, 5]} />
              <meshBasicMaterial color="#1c1418" />
            </mesh>
            <mesh position={[inward * 0.85, 3.7, 0]}>
              <sphereGeometry args={[0.18, 6, 5]} />
              <meshBasicMaterial color="#ffe8a8" />
            </mesh>
            <pointLight
              position={[inward * 0.85, 3.55, 0.1]}
              intensity={0.48}
              color="#ffb060"
              distance={10}
            />
          </group>
        );
      })}
    </group>
  );
}

function Billboard({
  position,
  lines,
  bg,
  fg,
  w = 6,
  h = 3,
}: {
  position: [number, number, number];
  lines: string[];
  bg: string;
  fg: string;
  w?: number;
  h?: number;
}) {
  const tex = useMemo(() => makeLabelTexture(lines, bg, fg), [lines, bg, fg]);
  useEffect(() => () => tex?.dispose(), [tex]);

  return (
    <group position={position}>
      <mesh position={[0, 2.6, 0]}>
        <cylinderGeometry args={[0.11, 0.16, 5.2, 6]} />
        <meshBasicMaterial color="#120c10" />
      </mesh>
      <mesh position={[0.9, 2.2, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 4.4, 6]} />
        <meshBasicMaterial color="#120c10" />
      </mesh>
      {/* Frame with rounded corners feel via rim + face */}
      <mesh position={[0.45, 5.3, 0.05]}>
        <boxGeometry args={[w + 0.35, h + 0.35, 0.18]} />
        <meshBasicMaterial color="#0a0610" />
      </mesh>
      {[
        [-w * 0.5, -h * 0.5],
        [w * 0.5, -h * 0.5],
        [-w * 0.5, h * 0.5],
        [w * 0.5, h * 0.5],
      ].map(([cx, cy], i) => (
        <mesh key={i} position={[0.45 + cx, 5.3 + cy, 0.05]}>
          <sphereGeometry args={[0.12, 5, 4]} />
          <meshBasicMaterial color="#0a0610" />
        </mesh>
      ))}
      <mesh position={[0.45, 5.3, 0.18]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial
          map={tex ?? undefined}
          color={tex ? "#ffffff" : bg}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Signage() {
  return (
    <group position={[0, -2.2, 0]}>
      <Billboard
        position={[-14, 0, -18]}
        lines={["Grove", "Street"]}
        bg={SA3D.money}
        fg="#07120a"
        w={5.5}
        h={2.8}
      />
      <Billboard
        position={[15, 0, -32]}
        lines={["Los Santos"]}
        bg="#d36ba6"
        fg="#1a0814"
        w={6.2}
        h={2.4}
      />
      <Billboard
        position={[-15.5, 0, -48]}
        lines={["Welcome", "to SA"]}
        bg="#f2772f"
        fg="#1a0c08"
        w={5.2}
        h={2.6}
      />
      {/* Highway shield */}
      <group position={[8.5, 0, -14]}>
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 4.4, 5]} />
          <meshBasicMaterial color="#1a1418" />
        </mesh>
        <mesh position={[0, 4.5, 0.1]}>
          <circleGeometry args={[0.85, 6]} />
          <meshBasicMaterial color="#36682c" />
        </mesh>
        <mesh position={[0, 4.5, 0.12]}>
          <ringGeometry args={[0.55, 0.75, 6]} />
          <meshBasicMaterial color="#e8d5a0" />
        </mesh>
      </group>
    </group>
  );
}

/** Freeway overpass — cylindrical pillars, not cubes */
function Overpass() {
  return (
    <group position={[0, -2.2, -28]}>
      {[-14, -5, 5, 14].map((x) => (
        <mesh key={x} position={[x, 3.8, 0]}>
          <cylinderGeometry args={[1.1, 1.35, 7.6, 8]} />
          <meshBasicMaterial color="#1a161c" />
        </mesh>
      ))}
      <mesh position={[0, 7.6, 0]}>
        <boxGeometry args={[36, 1.0, 8.4]} />
        <meshBasicMaterial color="#221c24" />
      </mesh>
      {/* Soft deck edges */}
      <mesh position={[0, 7.6, 4.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.55, 0.55, 36, 8]} />
        <meshBasicMaterial color="#221c24" />
      </mesh>
      <mesh position={[0, 7.6, -4.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.55, 0.55, 36, 8]} />
        <meshBasicMaterial color="#221c24" />
      </mesh>
      <mesh position={[0, 8.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[36, 9]} />
        <meshBasicMaterial color="#2a2228" />
      </mesh>
      {/* Curved rail posts */}
      {Array.from({ length: 12 }, (_, i) => {
        const x = -16 + i * 2.9;
        return (
          <group key={i}>
            <mesh position={[x, 9.0, 4.2]}>
              <cylinderGeometry args={[0.06, 0.06, 1.0, 5]} />
              <meshBasicMaterial color="#4a4448" />
            </mesh>
            <mesh position={[x, 9.0, -4.2]}>
              <cylinderGeometry args={[0.06, 0.06, 1.0, 5]} />
              <meshBasicMaterial color="#4a4448" />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, 9.45, 4.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 34, 5]} />
        <meshBasicMaterial color="#5a5458" />
      </mesh>
      <mesh position={[0, 9.45, -4.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 34, 5]} />
        <meshBasicMaterial color="#5a5458" />
      </mesh>
    </group>
  );
}

function SuburbBlocks() {
  const houses = useMemo(() => {
    const seed = { v: 77 };
    const items: {
      x: number;
      z: number;
      w: number;
      h: number;
      d: number;
      color: string;
      roof: "gable" | "hip" | "flat";
      chimney: boolean;
    }[] = [];
    const colors = ["#1a0c14", "#140a12", "#1c1018", "#100810", "#180e16", "#221018"];
    const roofs: Array<"gable" | "hip" | "flat"> = ["gable", "hip", "flat"];
    for (let i = 0; i < 14; i++) {
      for (const side of [-1, 1] as const) {
        items.push({
          x: side * (17 + seededRand(seed) * 10),
          z: -(side === -1 ? 5 : 7) - i * 5.5,
          w: 2.8 + seededRand(seed) * 3.5,
          h: 1.4 + seededRand(seed) * 1.8,
          d: 2.6 + seededRand(seed) * 2.2,
          color: colors[Math.floor(seededRand(seed) * colors.length)],
          roof: roofs[Math.floor(seededRand(seed) * roofs.length)],
          chimney: seededRand(seed) > 0.55,
        });
      }
    }
    return items;
  }, []);

  return (
    <group position={[0, -2.2, 0]}>
      {houses.map((h, i) => (
        <group key={i} position={[h.x, 0, h.z]}>
          <mesh position={[0, h.h / 2, 0]}>
            <boxGeometry args={[h.w, h.h, h.d]} />
            <meshBasicMaterial color={h.color} />
          </mesh>
          {h.roof === "gable" && (
            <mesh
              position={[0, h.h + h.w * 0.22, 0]}
              rotation={[0, 0, 0]}
              scale={[h.w * 0.72, h.w * 0.45, h.d * 1.05]}
            >
              <coneGeometry args={[0.85, 1.1, 4]} />
              <meshBasicMaterial color="#0c0610" />
            </mesh>
          )}
          {h.roof === "hip" && (
            <mesh position={[0, h.h + 0.55, 0]} scale={[h.w * 0.55, 1.1, h.d * 0.55]}>
              <coneGeometry args={[1, 1, 4]} />
              <meshBasicMaterial color="#100810" />
            </mesh>
          )}
          {h.roof === "flat" && (
            <mesh position={[0, h.h + 0.12, 0]}>
              <cylinderGeometry args={[Math.max(h.w, h.d) * 0.55, Math.max(h.w, h.d) * 0.58, 0.24, 6]} />
              <meshBasicMaterial color="#0a060c" />
            </mesh>
          )}
          {h.chimney && (
            <mesh position={[h.w * 0.28, h.h + 0.7, -h.d * 0.15]}>
              <cylinderGeometry args={[0.18, 0.2, 0.9, 5]} />
              <meshBasicMaterial color="#2a1818" />
            </mesh>
          )}
          <mesh position={[0, 0.55, h.d * 0.51]}>
            <planeGeometry args={[0.5, 1.05]} />
            <meshBasicMaterial color="#2a1810" />
          </mesh>
          <mesh position={[-h.w * 0.25, h.h * 0.55, h.d * 0.52]}>
            <circleGeometry args={[0.28, 6]} />
            <meshBasicMaterial color="#f2c040" transparent opacity={0.55} />
          </mesh>
          <mesh position={[h.w * 0.28, h.h * 0.55, h.d * 0.52]}>
            <planeGeometry args={[h.w * 0.22, h.h * 0.28]} />
            <meshBasicMaterial color="#c87828" transparent opacity={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

type Bldg = {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  windows: boolean;
  blink: number;
  form: "rect" | "cyl" | "taper" | "cross" | "octagon";
  antenna?: boolean;
  ledge?: boolean;
  waterTower?: boolean;
  spire?: boolean;
};

function buildSkyline(z: number, yBase: number, scaleH: number, seedStart: number): Bldg[] {
  const items: Bldg[] = [];
  let x = -95;
  const seed = { v: seedStart };
  const colors = ["#05030a", "#0a0612", "#100a18", "#080610", "#0e0814"];
  const forms: Bldg["form"][] = ["rect", "cyl", "taper", "cross", "octagon"];

  while (x < 95) {
    const width = 1.8 + seededRand(seed) * 7.5;
    const tall = seededRand(seed) > 0.65;
    const height = (tall ? 12 + seededRand(seed) * 22 : 4 + seededRand(seed) * 11) * scaleH;
    const form = forms[Math.floor(seededRand(seed) * forms.length)];
    items.push({
      position: [x + width / 2, height / 2 + yBase, z + seededRand(seed) * 3],
      scale: [width, height, 2.2 + seededRand(seed) * 2.8],
      color: colors[Math.floor(seededRand(seed) * colors.length)],
      windows: seededRand(seed) > 0.18,
      blink: seededRand(seed),
      form: tall && seededRand(seed) > 0.4 ? form : seededRand(seed) > 0.5 ? "rect" : form,
      antenna: tall && seededRand(seed) > 0.5,
      ledge: seededRand(seed) > 0.4,
      waterTower: !tall && seededRand(seed) > 0.82,
      spire: tall && seededRand(seed) > 0.7,
    });
    x += width + 0.4 + seededRand(seed) * 2;
  }
  return items;
}

function Building({ building }: { building: Bldg }) {
  const windowMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!windowMat.current || !building.windows) return;
    windowMat.current.opacity =
      0.5 +
      Math.sin(state.clock.elapsedTime * (1 + building.blink) + building.blink * 12) * 0.32;
  });

  const [sx, sy, sz] = building.scale;
  const r = Math.min(sx, sz) * 0.5;

  return (
    <group position={building.position}>
      {building.form === "rect" && (
        <mesh scale={building.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={building.color} />
        </mesh>
      )}
      {building.form === "cyl" && (
        <mesh>
          <cylinderGeometry args={[r * 0.95, r, sy, 8]} />
          <meshBasicMaterial color={building.color} />
        </mesh>
      )}
      {building.form === "taper" && (
        <mesh>
          <cylinderGeometry args={[r * 0.55, r * 1.05, sy, 6]} />
          <meshBasicMaterial color={building.color} />
        </mesh>
      )}
      {building.form === "octagon" && (
        <mesh>
          <cylinderGeometry args={[r, r, sy, 8]} />
          <meshBasicMaterial color={building.color} />
        </mesh>
      )}
      {building.form === "cross" && (
        <>
          <mesh scale={[sx, sy, sz * 0.45]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={building.color} />
          </mesh>
          <mesh scale={[sx * 0.45, sy * 0.92, sz]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={building.color} />
          </mesh>
        </>
      )}

      {building.ledge && (
        <mesh position={[0, sy * 0.35, 0]}>
          <cylinderGeometry args={[r * 1.15, r * 1.15, 0.18, 8]} />
          <meshBasicMaterial color="#120a16" />
        </mesh>
      )}
      {building.spire && (
        <mesh position={[0, sy * 0.55 + 1.4, 0]}>
          <coneGeometry args={[r * 0.35, 2.8, 5]} />
          <meshBasicMaterial color="#1a1018" />
        </mesh>
      )}
      {building.antenna && (
        <mesh position={[0, sy * 0.55 + (building.spire ? 2.8 : 1.2), 0]}>
          <cylinderGeometry args={[0.035, 0.05, 2.2, 5]} />
          <meshBasicMaterial color="#2a2228" />
        </mesh>
      )}
      {building.waterTower && (
        <group position={[0, sy * 0.55 + 0.8, 0]}>
          <mesh>
            <sphereGeometry args={[0.65, 7, 5]} />
            <meshBasicMaterial color="#3a3038" />
          </mesh>
          <mesh position={[0, -0.7, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.9, 5]} />
            <meshBasicMaterial color="#2a2228" />
          </mesh>
        </group>
      )}
      {building.windows && (
        <mesh
          position={[0, sy * 0.02, building.form === "rect" ? sz * 0.34 : 0]}
          scale={
            building.form === "rect"
              ? [sx * 0.72, sy * 0.58, 0.04]
              : [1, 1, 1]
          }
        >
          {building.form === "rect" ? (
            <boxGeometry args={[1, 1, 1]} />
          ) : (
            <cylinderGeometry args={[r * 0.88, r * 0.88, sy * 0.65, 8, 1, true]} />
          )}
          <meshBasicMaterial
            ref={windowMat}
            color="#ffc040"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

function LosSantosSkyline() {
  const far = useMemo(() => buildSkyline(-74, -2.2, 1.15, 13), []);
  const mid = useMemo(() => buildSkyline(-60, -2.2, 0.88, 29), []);
  const near = useMemo(() => buildSkyline(-48, -2.2, 0.55, 47), []);

  return (
    <group>
      {far.map((b, i) => (
        <Building key={`f${i}`} building={b} />
      ))}
      {mid.map((b, i) => (
        <Building key={`m${i}`} building={b} />
      ))}
      {near.map((b, i) => (
        <Building key={`n${i}`} building={b} />
      ))}
    </group>
  );
}

function Traffic() {
  const cars = useRef<THREE.Group>(null);
  const fleet = useMemo(
    () => [
      { lane: -2.8, speed: 10, color: "#54b948", w: 1.15, kind: "sedan" as const },
      { lane: 2.6, speed: 12, color: "#f2772f", w: 1.35, kind: "muscle" as const },
      { lane: -3.2, speed: 8.5, color: "#8aa8c3", w: 1.05, kind: "van" as const },
      { lane: 3.0, speed: 11, color: "#e8d5a0", w: 1.2, kind: "coupe" as const },
      { lane: -2.2, speed: 13, color: "#b3262a", w: 1.1, kind: "sedan" as const },
      { lane: 2.2, speed: 9.5, color: "#36682c", w: 1.25, kind: "lowrider" as const },
    ],
    []
  );

  useFrame((state) => {
    if (!cars.current) return;
    cars.current.children.forEach((child, i) => {
      const car = fleet[i];
      child.position.z = 5 - ((state.clock.elapsedTime * car.speed + i * 14) % 85);
    });
  });

  return (
    <group ref={cars} position={[0, -1.88, 0]}>
      {fleet.map((car, i) => (
        <group key={i} position={[car.lane, 0, -i * 10]}>
          {/* Body hull — rounded */}
          <mesh position={[0, 0.28, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.34, car.w * 0.7, 4, 8]} />
            <meshBasicMaterial color={car.color} />
          </mesh>
          <mesh position={[0, 0.3, 0]} scale={[car.w * 0.92, 0.38, 1.85]}>
            <capsuleGeometry args={[0.5, 0.6, 4, 8]} />
            <meshBasicMaterial color={car.color} />
          </mesh>
          {/* Cabin bubble */}
          <mesh
            position={[0, car.kind === "van" ? 0.68 : 0.58, car.kind === "van" ? 0 : -0.12]}
            scale={[
              car.w * 0.72,
              car.kind === "van" ? 0.5 : 0.34,
              car.kind === "van" ? 1.25 : 0.95,
            ]}
          >
            <capsuleGeometry args={[0.55, 0.35, 4, 8]} />
            <meshBasicMaterial color="#0a0610" />
          </mesh>
          {/* Rounded hood */}
          <mesh position={[0, 0.36, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.26, 0.34, car.w * 0.8, 8]} />
            <meshBasicMaterial color={car.color} />
          </mesh>
          {/* Trunk taper */}
          <mesh position={[0, 0.34, -0.95]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.24, car.w * 0.75, 8]} />
            <meshBasicMaterial color={car.color} />
          </mesh>
          {/* Wheels */}
          {[
            [-0.45, -0.85],
            [0.45, -0.85],
            [-0.45, 0.85],
            [0.45, 0.85],
          ].map(([x, z], wi) => (
            <mesh key={wi} position={[x, 0.18, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.22, 0.22, 0.18, 8]} />
              <meshBasicMaterial color="#121018" />
            </mesh>
          ))}
          <mesh position={[-0.28, 0.35, 1.15]}>
            <sphereGeometry args={[0.1, 5, 4]} />
            <meshBasicMaterial color="#ffe8a0" />
          </mesh>
          <mesh position={[0.28, 0.35, 1.15]}>
            <sphereGeometry args={[0.1, 5, 4]} />
            <meshBasicMaterial color="#ffe8a0" />
          </mesh>
          <mesh position={[-0.28, 0.35, -1.1]}>
            <sphereGeometry args={[0.08, 5, 4]} />
            <meshBasicMaterial color="#ff3030" />
          </mesh>
          <mesh position={[0.28, 0.35, -1.1]}>
            <sphereGeometry args={[0.08, 5, 4]} />
            <meshBasicMaterial color="#ff3030" />
          </mesh>
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
    const targetX = enablePointer ? pointer.x * 1.15 : Math.sin(t * 0.1) * 0.4;
    const baseY = 1.45 + Math.sin(t * 0.35) * 0.07;
    const targetY = enablePointer ? baseY + pointer.y * 0.4 : baseY;
    const targetZ = 10 + progress * 3.5;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    camera.lookAt(0, 1.8 - progress * 0.6, -48);
  });

  return null;
}

/**
 * Bloom via three's own UnrealBloomPass (~35 KB) instead of the
 * @react-three/postprocessing stack (~280 KB). Vignette and colour fringe are
 * CSS (`.hero-scene-vignette`); film grain comes from the page-wide `.grain-overlay`.
 * A useFrame with priority > 0 takes over rendering from R3F.
 */
function BloomPost() {
  const { gl, scene, camera, size } = useThree();

  const composer = useMemo(() => {
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    c.addPass(new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 0.85, 0.55, 0.22));
    c.addPass(new OutputPass());
    return c;
    // size handled in the effect below; only rebuild when renderer/scene/camera change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, camera]);

  useEffect(() => {
    composer.setPixelRatio(gl.getPixelRatio());
    composer.setSize(size.width, size.height);
  }, [composer, gl, size]);

  useEffect(() => () => composer.dispose(), [composer]);

  useFrame(() => {
    composer.render();
  }, 1);

  return null;
}

function PostEffects({ enabled }: { enabled: boolean }) {
  return enabled ? <BloomPost /> : null;
}

export default function HeroScene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  // Flipped by PerformanceMonitor when the device can't hold frame rate: drops
  // post-processing and DPR rather than letting the hero stutter.
  const [degraded, setDegraded] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isCoarsePointer = useMediaQuery("(pointer: coarse)");
  const lowQuality = isMobile || isCoarsePointer || degraded;

  const dpr: [number, number] = degraded
    ? [1, 1]
    : isMobile || isCoarsePointer
      ? [1, 1.2]
      : [1, 1.65];

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
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 1.45, 10], fov: 64 }}
        gl={{
          antialias: false,
          powerPreference: lowQuality ? "low-power" : "high-performance",
        }}
        dpr={dpr}
        frameloop={visible ? "always" : "never"}
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
        <PostEffects enabled={!lowQuality} />
      </Canvas>
      <div className="hero-scene-vignette" aria-hidden />
    </div>
  );
}
