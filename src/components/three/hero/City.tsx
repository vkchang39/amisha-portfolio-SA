"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { seededRand } from "./utils";

export function SuburbBlocks() {
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

export function LosSantosSkyline() {
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
