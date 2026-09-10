"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGameUi } from "@/context/GameUiContext";
import { withBasePath } from "@/lib/basePath";

const LINKS = [
  { href: "#missions", label: "Missions", id: "missions" },
  { href: "#projects", label: "Projects", id: "projects" },
  { href: "#stats", label: "Stats", id: "stats" },
  { href: "#education", label: "Education", id: "education" },
  { href: "#contact", label: "Contact", id: "contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { activeSection, navigateToSection } = useGameUi();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const goTo = useCallback(
    (sectionId: string) => {
      navigateToSection(sectionId);
      closeMenu();
    },
    [navigateToSection, closeMenu]
  );

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return;
      }
      closeMenu();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen, closeMenu]);

  const linkClass = (id: string) =>
    `font-[family-name:var(--font-oswald)] uppercase tracking-[0.14em] text-sm min-h-11 min-w-11 inline-flex items-center transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-money ${
      activeSection === id
        ? "text-money nav-link-active"
        : "text-sand/80 hover:text-money"
    }`;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-night/90 backdrop-blur-md border-b border-sand/15 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav
        className="mx-auto max-w-6xl px-6 flex items-center justify-between gap-4"
        aria-label="Main navigation"
      >
        <a
          href="#top"
          className="gta-title-light text-2xl text-sand hover:text-money transition-colors min-h-11 min-w-11 inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-money"
          onClick={(e) => {
            e.preventDefault();
            goTo("top");
          }}
        >
          AS
          <span className="sr-only"> — Amisha Sharma, back to top</span>
        </a>

        <ul className="hidden md:flex items-center gap-6 lg:gap-8">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={linkClass(link.id)}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(link.id);
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <span className="hidden lg:inline-flex meta-subtle text-[0.65rem] tracking-[0.14em] uppercase border border-sand/20 px-2.5 py-1.5 rounded-sm">
            ESC — Pause
          </span>
          <a
            href={withBasePath("/Amisha_Sharma_CV.pdf")}
            download
            className="hidden sm:inline-flex font-[family-name:var(--font-oswald)] uppercase tracking-[0.12em] text-xs bg-money text-night px-4 py-2.5 min-h-11 items-center hover:bg-sand transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand"
          >
            Download CV
          </a>

          <button
            ref={buttonRef}
            type="button"
            className="md:hidden min-h-11 min-w-11 inline-flex items-center justify-center border border-sand/30 text-sand hover:text-money hover:border-money transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-money"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          ref={menuRef}
          id="mobile-nav"
          className="md:hidden border-t border-sand/15 bg-night/95 backdrop-blur-md"
        >
          <ul className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`${linkClass(link.id)} w-full py-2`}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(link.id);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2 border-t border-sand/15 mt-2">
              <a
                href={withBasePath("/Amisha_Sharma_CV.pdf")}
                download
                className="font-[family-name:var(--font-oswald)] uppercase tracking-[0.12em] text-xs bg-money text-night px-4 py-3 min-h-11 inline-flex items-center w-full justify-center hover:bg-sand transition-colors"
                onClick={closeMenu}
              >
                Download CV
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
