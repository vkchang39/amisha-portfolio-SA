"use client";

import type { ComponentProps } from "react";
import { GtaButton } from "@/components/ui/GtaButton";
import { useGameAudio } from "@/hooks/useGameAudio";

type GtaButtonProps = ComponentProps<typeof GtaButton>;

export function GtaButtonSound(props: GtaButtonProps) {
  const { play } = useGameAudio();
  const { onClick, onMouseEnter, ...rest } = props;

  return (
    <GtaButton
      {...rest}
      onMouseEnter={(e) => {
        onMouseEnter?.(e);
      }}
      onClick={(e) => {
        play("buttonClick");
        onClick?.(e);
      }}
    />
  );
}
