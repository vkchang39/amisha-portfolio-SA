"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

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

    // Horizontal stripes that slide downward, thicker near the bottom
    float stripe = sin(vUv.y * 42.0 - uTime * 0.6);
    float cut = smoothstep(0.0, 0.9, vUv.y);
    if (stripe < mix(0.55, -1.0, cut)) discard;

    vec3 top = vec3(1.0, 0.85, 0.45);
    vec3 bottom = vec3(0.95, 0.32, 0.35);
    vec3 col = mix(bottom, top, vUv.y);

    float edge = smoothstep(1.0, 0.82, d);
    gl_FragColor = vec4(col * 1.35, edge);
  }
`;

const SKY_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SKY_FRAGMENT = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vec3 deep = vec3(0.045, 0.03, 0.10);
    vec3 violet = vec3(0.23, 0.10, 0.30);
    vec3 orange = vec3(0.88, 0.42, 0.18);
    vec3 pink = vec3(0.85, 0.35, 0.45);

    float y = vUv.y;
    vec3 col = mix(orange, pink, smoothstep(0.0, 0.28, y));
    col = mix(col, violet, smoothstep(0.18, 0.55, y));
    col = mix(col, deep, smoothstep(0.45, 1.0, y));

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Sky() {
  return (
    <mesh position={[0, 18, -90]} scale={[260, 110, 1]}>
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
    <mesh position={[0, 8, -80]} scale={[34, 34, 1]}>
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

function Grid() {
  const group = useRef<THREE.Group>(null);
  const SPACING = 2.4;

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
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3)
    );
    return geometry;
  }, []);

  useFrame((state) => {
    if (group.current) {
      // Endless forward drive
      group.current.position.z =
        (state.clock.elapsedTime * 2.2) % SPACING;
    }
  });

  return (
    <group ref={group} position={[0, -2.2, 8]}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color="#7a3fa0" transparent opacity={0.55} />
      </lineSegments>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -70]}>
        <planeGeometry args={[300, 200]} />
        <meshBasicMaterial color="#0c0913" />
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
  const fronds = useMemo(() => {
    const result: { rotation: [number, number, number] }[] = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      result.push({
        rotation: [Math.PI / 3.2, angle, 0],
      });
    }
    return result;
  }, []);

  return (
    <group position={position} scale={scale} rotation={[0, 0, lean]}>
      <mesh position={[0, 2.6, 0]}>
        <cylinderGeometry args={[0.09, 0.2, 5.2, 6]} />
        <meshBasicMaterial color="#120b1c" />
      </mesh>
      <group position={[0, 5.2, 0]}>
        {fronds.map((frond, i) => (
          <group key={i} rotation={frond.rotation}>
            <mesh position={[0, 1.1, 0]}>
              <coneGeometry args={[0.22, 2.4, 4]} />
              <meshBasicMaterial color="#120b1c" />
            </mesh>
          </group>
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
    }[] = [];
    let x = -70;
    let seed = 7;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    while (x < 70) {
      const width = 3 + random() * 6;
      const height = 3 + random() * 12;
      items.push({
        position: [x + width / 2, height / 2 - 2.2, -72],
        scale: [width, height, 3],
      });
      x += width + random() * 4;
    }
    return items;
  }, []);

  return (
    <group>
      {buildings.map((building, i) => (
        <mesh key={i} position={building.position} scale={building.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#150d20" />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig() {
  useFrame((state) => {
    const { camera, pointer } = state;
    const t = state.clock.elapsedTime;
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      pointer.x * 1.6,
      0.04
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      1.5 + pointer.y * 0.8 + Math.sin(t * 0.4) * 0.15,
      0.04
    );
    camera.lookAt(0, 2.5, -60);
  });

  return null;
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 1.5, 10], fov: 60 }}
        gl={{ antialias: false }}
        dpr={[1, 1.75]}
      >
        <color attach="background" args={["#0c0913"]} />
        <fog attach="fog" args={["#2a1430", 30, 110]} />

        <Sky />
        <Stars
          radius={90}
          depth={40}
          count={1600}
          factor={3}
          saturation={0.4}
          fade
          speed={0.6}
        />
        <Sun />
        <Skyline />
        <Palms />
        <Grid />
        <CameraRig />

        <EffectComposer>
          <Bloom
            intensity={0.85}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.7}
            mipmapBlur
          />
          <ChromaticAberration offset={[0.0012, 0.0008]} />
          <Noise opacity={0.06} blendFunction={BlendFunction.OVERLAY} />
          <Vignette eskil={false} offset={0.18} darkness={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
