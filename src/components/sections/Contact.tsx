"use client";

import { useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useResume } from "@/hooks/useResume";
import { GtaButtonSound } from "@/components/ui/GtaButtonSound";
import { CopyButton } from "@/components/ui/CopyButton";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useGameAudio } from "@/hooks/useGameAudio";
import { withBasePath } from "@/lib/basePath";
import { getSectionAccent } from "@/lib/sectionAccents";
import { hasContactForm } from "@/lib/siteConfig";
import "@/lib/gsap";

const PhoneBoothScene = dynamic(
  () => import("@/components/three/PhoneBoothScene"),
  { ssr: false }
);

function PhoneBoothFallback() {
  return (
    <svg
      className="phone-booth-fallback"
      viewBox="0 0 120 200"
      fill="none"
      aria-hidden
    >
      <rect x="22" y="18" width="76" height="165" rx="1" fill="#7a2228" opacity="0.35" />
      <rect x="22" y="18" width="76" height="165" rx="1" stroke="#4a1218" strokeWidth="2" opacity="0.5" />
      <rect x="30" y="28" width="60" height="90" fill="#8aa8c3" opacity="0.12" />
      <rect x="18" y="12" width="84" height="12" rx="1" fill="#4a1218" opacity="0.4" />
      <rect x="38" y="130" width="44" height="16" rx="1" fill="#54b948" opacity="0.25" />
      <text x="60" y="142" textAnchor="middle" fill="#54b948" opacity="0.35" fontSize="9" fontFamily="Impact">
        CALL
      </text>
    </svg>
  );
}

export function Contact({ year }: { year: number }) {
  const container = useRef<HTMLDivElement>(null);
  const { data } = useResume();
  const { cinematicEnabled } = useCinematicMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const show3D = cinematicEnabled && !isMobile;
  const { play } = useGameAudio();

  useGSAP(
    () => {
      if (!cinematicEnabled || !container.current) return;

      gsap.fromTo(
        ".contact-title",
        { scale: 3, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "power4.in",
          scrollTrigger: {
            trigger: container.current,
            start: "top 65%",
          },
        }
      );
    },
    { scope: container, dependencies: [cinematicEnabled] }
  );

  if (!data) return null;

  const focusEmailCta = () => {
    play("menuSelect");
    const cta = document.getElementById("contact-email-cta");
    cta?.focus();
    cta?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  return (
    <SectionBackground
      id="contact"
      image="/images/bg-hills-night.webp"
      opacity="opacity-[0.16]"
      accent={getSectionAccent("contact")}
      className="py-28 md:py-44 px-4 sm:px-6 bg-gradient-to-b from-night via-asphalt to-night"
      gradientClassName="bg-gradient-to-b from-night via-night/40 to-night"
    >
      <div ref={container} className="relative mx-auto max-w-4xl text-center">
        {show3D ? (
          <div className="phone-booth-scene-wrap">
            <div className="phone-booth-scene-canvas" aria-hidden>
              <PhoneBoothScene onActivate={focusEmailCta} />
            </div>
            <button
              type="button"
              className="phone-booth-activate"
              onClick={focusEmailCta}
            >
              Call booth — focus email CTA
            </button>
          </div>
        ) : (
          <PhoneBoothFallback />
        )}

        <p className="contact-title gta-title text-5xl sm:text-6xl md:text-8xl text-blood mb-6">
          Wasted?
        </p>
        <Reveal>
          <p className="meta-label tracking-[0.2em] text-sand/85 text-sm md:text-base">
            Nah. Just one mission away from your next great hire.
          </p>
          <p className="mt-6 text-sand/80 max-w-xl mx-auto leading-relaxed">
            Looking for someone to coordinate your next project from kickoff to
            deployment? Hit me up — respawn is instant.
          </p>
        </Reveal>

        <Reveal className="mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
          <GtaButtonSound
            id="contact-email-cta"
            href={`mailto:${data.email}`}
            $variant="money"
            aria-label={`Email Amisha Sharma at ${data.email}`}
          >
            send a message
            <span className="cta-hint">Email Amisha</span>
          </GtaButtonSound>
          <GtaButtonSound
            href={withBasePath(data.cvUrl)}
            download
            $variant="blood"
            aria-label="Download Amisha Sharma CV PDF"
          >
            download cv
            <span className="cta-hint">Get resume PDF</span>
          </GtaButtonSound>
          <GtaButtonSound
            href={data.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            $variant="sand"
            aria-label="Open Amisha Sharma LinkedIn profile"
          >
            linkedin
            <span className="cta-hint">Connect on LinkedIn</span>
          </GtaButtonSound>
        </Reveal>

        {hasContactForm && (
          <Reveal className="mt-14 md:mt-16">
            <div className="mx-auto max-w-3xl text-left">
              <ContactForm fallbackEmail={data.email} />
            </div>
          </Reveal>
        )}

        <Reveal className="mt-14 md:mt-16">
          <div className="mx-auto grid max-w-3xl items-stretch gap-6 md:grid-cols-2 text-left">
            <div className="mission-card group p-3">
              <div className="relative h-full min-h-52 md:min-h-56 overflow-hidden">
                <Image
                  src={withBasePath("/images/contact-payphone.webp")}
                  alt="GTA San Andreas style payphone on a Los Santos street"
                  fill
                  sizes="(min-width: 768px) 24rem, 100vw"
                  className="object-cover sepia-[0.2] transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-transparent" />
                <p className="gta-title-light absolute bottom-3 left-4 text-lg md:text-xl text-sand">
                  Answer the phone, it&apos;s a mission
                </p>
              </div>
            </div>

            <div className="mission-card p-5 md:p-6 space-y-4 flex flex-col justify-center">
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4 text-sm">
                <span className="meta-label">Phone</span>
                <a
                  href={`tel:${data.phone.replace(/[^+\d]/g, "")}`}
                  className="text-sand hover:text-money transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-money"
                >
                  {data.phone}
                </a>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4 text-sm">
                <span className="meta-label">Email</span>
                <span className="flex items-center gap-2 sm:justify-end">
                  <a
                    href={`mailto:${data.email}`}
                    className="text-sand hover:text-money transition-colors break-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-money"
                  >
                    {data.email}
                  </a>
                  <CopyButton value={data.email} label="Email address" />
                </span>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4 text-sm">
                <span className="meta-label">LinkedIn</span>
                <a
                  href={data.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sand hover:text-money transition-colors break-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-money"
                >
                  {data.linkedin}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <footer className="relative mt-20 md:mt-24 text-center">
        <p className="meta-subtle tracking-[0.2em] uppercase">
          © {year} Amisha Sharma · Built with Next.js, Three.js & respect for Grove Street
        </p>
      </footer>
    </SectionBackground>
  );
}
