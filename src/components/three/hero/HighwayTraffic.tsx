"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

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

export function Highway() {
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

export function Traffic() {
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
