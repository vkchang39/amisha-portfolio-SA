"use client";

import { useQuery } from "@tanstack/react-query";
import { resume, type Resume } from "@/lib/resume";

async function fetchResume(): Promise<Resume> {
  const res = await fetch("/api/resume");
  if (!res.ok) throw new Error("Failed to load resume data");
  return res.json();
}

export function useResume() {
  return useQuery({
    queryKey: ["resume"],
    queryFn: fetchResume,
    // Local data doubles as instant placeholder, so the UI never blocks.
    placeholderData: resume,
    staleTime: Infinity,
  });
}
