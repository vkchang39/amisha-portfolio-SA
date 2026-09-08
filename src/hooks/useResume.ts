"use client";

import { useQuery } from "@tanstack/react-query";
import { resume, type Resume } from "@/lib/resume";

async function loadResume(): Promise<Resume> {
  // Static export / GitHub Pages has no API routes — use bundled resume data.
  return resume;
}

export function useResume() {
  return useQuery({
    queryKey: ["resume"],
    queryFn: loadResume,
    // Local data doubles as instant placeholder, so the UI never blocks.
    placeholderData: resume,
    staleTime: Infinity,
  });
}
