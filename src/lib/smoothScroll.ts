import type Lenis from "lenis";

export const SKIP_ANIMATIONS_KEY = "portfolio-skip-animations";
export const SKIP_ANIMATIONS_EVENT = "portfolio:skip-animations";

type SkipAnimationsDetail = { skipAnimations: boolean };

let lenisInstance: Lenis | null = null;
let smoothEnabled = true;

export function registerLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function isSmoothScrollEnabled() {
  return smoothEnabled && lenisInstance !== null;
}

export function setSmoothScrollEnabled(enabled: boolean) {
  smoothEnabled = enabled;
  if (!lenisInstance) return;
  if (enabled) {
    lenisInstance.start();
  } else {
    lenisInstance.stop();
  }
}

export function dispatchSkipAnimationsChange(skipAnimations: boolean) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<SkipAnimationsDetail>(SKIP_ANIMATIONS_EVENT, {
      detail: { skipAnimations },
    })
  );
}

export function readSkipAnimationsPreference(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SKIP_ANIMATIONS_KEY) === "true";
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function shouldUseInstantScroll(skipAnimations?: boolean): boolean {
  const skip =
    skipAnimations ??
    (typeof window !== "undefined" ? readSkipAnimationsPreference() : false);
  return skip || prefersReducedMotion();
}

/** Scroll to a section element via Lenis when smooth scroll is active. */
export function scrollToElement(
  element: HTMLElement,
  options?: { immediate?: boolean; offset?: number }
) {
  const immediate = options?.immediate ?? shouldUseInstantScroll();
  const offset = options?.offset ?? 0;

  if (lenisInstance && smoothEnabled && !immediate) {
    lenisInstance.scrollTo(element, { offset, duration: 1.1 });
    return;
  }

  if (immediate) {
    const top =
      element.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "auto" });
    return;
  }

  element.scrollIntoView({ behavior: "smooth", block: "start" });
}
