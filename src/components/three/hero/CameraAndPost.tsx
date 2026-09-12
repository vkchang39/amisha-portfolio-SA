"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

export function CameraRig({
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

export function PostEffects({ enabled }: { enabled: boolean }) {
  return enabled ? <BloomPost /> : null;
}
