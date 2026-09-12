"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Becomes true once `ref` is within `rootMargin` of the viewport.
 * Used to defer below-fold WebGL chunk downloads.
 */
export function useNearViewport<T extends Element>(
  rootMargin = "200px 0px"
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || near) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [near, rootMargin]);

  return [ref, near];
}
