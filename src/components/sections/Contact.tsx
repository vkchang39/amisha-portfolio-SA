"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useResume } from "@/hooks/useResume";
import { GtaButton } from "@/components/ui/GtaButton";
import { Reveal } from "@/components/ui/Reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Contact() {
  const container = useRef<HTMLDivElement>(null);
  const { data } = useResume();

  useGSAP(
    () => {
      gsap.from(".contact-title", {
        scale: 3,
        opacity: 0,
        duration: 0.6,
        ease: "power4.in",
        scrollTrigger: {
          trigger: container.current,
          start: "top 65%",
        },
      });
    },
    { scope: container }
  );

  if (!data) return null;

  return (
    <section
      ref={container}
      id="contact"
      className="relative py-32 md:py-44 px-6 bg-gradient-to-b from-night via-asphalt to-night overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src="/images/bg-hills-night.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.16]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night via-night/40 to-night" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <p className="contact-title gta-title text-6xl md:text-8xl text-blood mb-6">
          Wasted?
        </p>
        <Reveal>
          <p className="font-[family-name:var(--font-oswald)] uppercase tracking-[0.3em] text-sand/80 text-sm md:text-base">
            Nah. Just one mission away from your next great hire.
          </p>
          <p className="mt-6 text-sand/70 max-w-xl mx-auto leading-relaxed">
            Looking for someone to coordinate your next project from kickoff to
            deployment? Hit me up — respawn is instant.
          </p>
        </Reveal>

        <Reveal className="mt-12 flex flex-wrap items-center justify-center gap-5">
          <GtaButton href={`mailto:${data.email}`} $variant="money">
            send a message
          </GtaButton>
          <GtaButton href={data.cvUrl} download $variant="blood">
            download cv
          </GtaButton>
          <GtaButton
            href={data.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            $variant="sand"
          >
            linkedin
          </GtaButton>
        </Reveal>

        <Reveal className="mt-16">
          <div className="mx-auto grid max-w-3xl items-stretch gap-6 md:grid-cols-2 text-left">
            <div className="mission-card group p-3">
              <div className="relative h-full min-h-56 overflow-hidden">
                <Image
                  src="/images/contact-payphone.jpg"
                  alt="GTA San Andreas style payphone on a Los Santos street"
                  fill
                  sizes="(min-width: 768px) 24rem, 100vw"
                  className="object-cover sepia-[0.2] transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-transparent" />
                <p className="gta-title-light absolute bottom-3 left-4 text-xl text-sand">
                  Answer the phone, it&apos;s a mission
                </p>
              </div>
            </div>

            <div className="mission-card p-6 space-y-3 flex flex-col justify-center">
            <p className="flex justify-between gap-4 text-sm">
              <span className="font-[family-name:var(--font-oswald)] uppercase tracking-[0.2em] text-sand/50">
                Phone
              </span>
              <a href={`tel:${data.phone.replace(/[^+\d]/g, "")}`} className="text-sand hover:text-money transition-colors">
                {data.phone}
              </a>
            </p>
            <p className="flex justify-between gap-4 text-sm">
              <span className="font-[family-name:var(--font-oswald)] uppercase tracking-[0.2em] text-sand/50">
                Email
              </span>
              <a href={`mailto:${data.email}`} className="text-sand hover:text-money transition-colors break-all">
                {data.email}
              </a>
            </p>
            <p className="flex justify-between gap-4 text-sm">
              <span className="font-[family-name:var(--font-oswald)] uppercase tracking-[0.2em] text-sand/50">
                LinkedIn
              </span>
              <a
                href={data.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sand hover:text-money transition-colors break-all"
              >
                {data.linkedin}
              </a>
            </p>
            </div>
          </div>
        </Reveal>
      </div>

      <footer className="relative mt-24 text-center">
        <p className="font-[family-name:var(--font-oswald)] text-[0.65rem] uppercase tracking-[0.35em] text-sand/35">
          © {new Date().getFullYear()} Amisha Sharma · Built with Next.js, Three.js & respect for Grove Street
        </p>
      </footer>
    </section>
  );
}
