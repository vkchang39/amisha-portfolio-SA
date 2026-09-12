"use client";

import { useEffect, useMemo } from "react";
import { SA3D } from "@/lib/gtaSa3d";
import { makeLabelTexture } from "./utils";

export function PowerLines() {
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

export function StreetLamps() {
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

export function Signage() {
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
export function Overpass() {
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
