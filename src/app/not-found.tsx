import type { Metadata } from "next";
import Link from "next/link";
import { getBasePath } from "@/lib/basePath";
import { LOADING_SPLASHES } from "@/lib/loadingTips";

export const metadata: Metadata = {
  title: "Wasted — Page not found | Amisha Sharma",
  robots: { index: false, follow: false },
};

/** Static export emits this as /404.html, which GitHub Pages serves automatically. */
export default function NotFound() {
  const basePath = getBasePath();

  return (
    <main className="wasted-page">
      <div
        className="wasted-page-bg"
        style={{ backgroundImage: `url(${basePath}${LOADING_SPLASHES[0]})` }}
        aria-hidden
      />
      <div className="wasted-page-scrim" aria-hidden />

      <p className="wasted-title">Wasted</p>
      <p className="relative mt-6 font-[family-name:var(--font-oswald)] uppercase tracking-[0.22em] text-sm md:text-base text-sand/85">
        404 · This block of San Andreas doesn&apos;t exist
      </p>
      <p className="relative mt-3 max-w-md text-sand/70 leading-relaxed">
        The page you were looking for got moved, renamed, or never made it past
        the mission briefing.
      </p>

      <Link
        href="/"
        className="relative mt-10 inline-flex items-center gap-2 border-2 border-black/70 bg-money px-6 py-3 font-[family-name:var(--font-pricedown)] text-xl tracking-wide text-night shadow-[4px_4px_0_rgba(0,0,0,0.75)] transition-transform hover:-translate-x-px hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#54b948]"
      >
        Respawn at Grove Street
      </Link>
    </main>
  );
}
