"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#missions", label: "Missions" },
  { href: "#projects", label: "Projects" },
  { href: "#stats", label: "Stats" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-night/90 backdrop-blur-md border-b border-sand/15 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="mx-auto max-w-6xl px-6 flex items-center justify-between">
        <a
          href="#top"
          className="gta-title-light text-2xl text-sand hover:text-money transition-colors"
        >
          AS
        </a>
        <ul className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-[family-name:var(--font-oswald)] uppercase tracking-[0.2em] text-xs text-sand/70 hover:text-money transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="/Amisha_Sharma_CV.pdf"
          download
          className="font-[family-name:var(--font-oswald)] uppercase tracking-[0.2em] text-xs bg-money text-night px-4 py-2 hover:bg-sand transition-colors"
        >
          Download CV
        </a>
      </nav>
    </header>
  );
}
