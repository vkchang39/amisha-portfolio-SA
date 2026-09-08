"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StyledComponentsRegistry from "@/lib/registry";
import { AppReadyProvider } from "@/context/AppReadyContext";
import { registerGsapPlugins } from "@/lib/gsap";
import {
  SKIP_ANIMATIONS_EVENT,
  prefersReducedMotion,
  readSkipAnimationsPreference,
  registerLenis,
  setSmoothScrollEnabled,
} from "@/lib/smoothScroll";

registerGsapPlugins();

function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const motionReduced = prefersReducedMotion();
    const skipAnimations = readSkipAnimationsPreference();
    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;

    const teardownLenis = () => {
      if (raf) {
        gsap.ticker.remove(raf);
        raf = null;
      }
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
      registerLenis(null);
      setSmoothScrollEnabled(false);
      ScrollTrigger.scrollerProxy(document.documentElement, {});
      ScrollTrigger.defaults({ scroller: undefined });
      ScrollTrigger.refresh();
    };

    const setupLenis = () => {
      if (lenis) return;

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      registerLenis(lenis);
      setSmoothScrollEnabled(true);

      lenis.on("scroll", ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value) {
          if (arguments.length && value !== undefined) {
            lenis?.scrollTo(value, { immediate: true });
          }
          return lenis?.scroll ?? window.scrollY;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
      });

      ScrollTrigger.defaults({ scroller: document.documentElement });

      raf = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();
    };

    const syncSmoothScroll = () => {
      const disable =
        prefersReducedMotion() || readSkipAnimationsPreference();
      if (disable) {
        teardownLenis();
      } else {
        setupLenis();
      }
    };

    if (!motionReduced && !skipAnimations) {
      setupLenis();
    } else {
      ScrollTrigger.refresh();
    }

    const onSkipChange = () => syncSmoothScroll();
    const onMotionChange = () => syncSmoothScroll();

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionMq.addEventListener("change", onMotionChange);
    window.addEventListener(SKIP_ANIMATIONS_EVENT, onSkipChange);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      motionMq.removeEventListener("change", onMotionChange);
      window.removeEventListener(SKIP_ANIMATIONS_EVENT, onSkipChange);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      teardownLenis();
    };
  }, []);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false },
        },
      })
  );

  return (
    <StyledComponentsRegistry>
      <QueryClientProvider client={queryClient}>
        <AppReadyProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </AppReadyProvider>
      </QueryClientProvider>
    </StyledComponentsRegistry>
  );
}
