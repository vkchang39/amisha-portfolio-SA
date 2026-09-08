"use client";

import type { ComponentProps, MouseEvent } from "react";
import { GtaButton } from "@/components/ui/GtaButton";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useGameUi } from "@/context/GameUiContext";

type GtaButtonProps = ComponentProps<typeof GtaButton>;

function sectionIdFromHref(href: string | undefined): string | null {
  if (!href || !href.startsWith("#") || href.length < 2) return null;
  return href.slice(1);
}

export function GtaButtonSound(props: GtaButtonProps) {
  const { play } = useGameAudio();
  const { navigateToSection } = useGameUi();
  const { onClick, onMouseEnter, href, ...rest } = props;

  return (
    <GtaButton
      {...rest}
      href={href}
      onMouseEnter={(e) => {
        play("menuMove");
        onMouseEnter?.(e);
      }}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        play("buttonClick");
        const sectionId = sectionIdFromHref(
          typeof href === "string" ? href : undefined
        );
        if (sectionId) {
          e.preventDefault();
          navigateToSection(sectionId);
        }
        onClick?.(e);
      }}
    />
  );
}
