"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { seededRand } from "./utils";

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

export function PalmForest() {
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
