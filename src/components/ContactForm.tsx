"use client";

import { useState, type FormEvent } from "react";
import { useGameAudio } from "@/hooks/useGameAudio";
import { FORM_ACCESS_KEY, FORM_ENDPOINT } from "@/lib/siteConfig";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Static-site contact form. Posts JSON to a form relay (Web3Forms / Formspree)
 * configured via NEXT_PUBLIC_FORM_ENDPOINT. Rendered only when that is set.
 */
export function ContactForm({ fallbackEmail }: { fallbackEmail: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const { play } = useGameAudio();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot: bots fill every field; humans never see this one.
    if (fd.get("botcheck")) return;

    const payload: Record<string, string> = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
      subject: `Portfolio contact from ${String(fd.get("name") ?? "visitor")}`,
    };
    if (FORM_ACCESS_KEY) payload.access_key = FORM_ACCESS_KEY;

    setStatus("sending");
    setError(null);
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Relay responded ${res.status}`);
      setStatus("sent");
      play("missionPassed");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  if (status === "sent") {
    return (
      <div className="contact-form contact-form-sent" role="status" aria-live="polite">
        <p className="gta-title-light text-money text-2xl md:text-3xl">Mission Passed!</p>
        <p className="mt-2 text-sand/85 text-sm">
          Message received. Expect a reply within one business day.
        </p>
        <button
          type="button"
          className="pause-menu-settings-btn mt-4"
          onClick={() => setStatus("idle")}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate={false}>
      <p className="meta-label mb-3 tracking-[0.16em]">Dispatch a message</p>

      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="contact-form-honeypot"
        aria-hidden
      />

      <div className="contact-form-row">
        <label className="contact-form-field">
          <span>Name</span>
          <input name="name" type="text" required autoComplete="name" maxLength={120} />
        </label>
        <label className="contact-form-field">
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" maxLength={200} />
        </label>
      </div>
      <label className="contact-form-field">
        <span>Message</span>
        <textarea name="message" required rows={4} maxLength={4000} />
      </label>

      <div className="contact-form-actions">
        <button
          type="submit"
          className="contact-form-submit"
          disabled={status === "sending"}
          onClick={() => play("buttonClick")}
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <span className="meta-subtle text-xs">
          or email{" "}
          <a href={`mailto:${fallbackEmail}`} className="underline hover:text-money">
            {fallbackEmail}
          </a>
        </span>
      </div>

      {status === "error" && (
        <p className="contact-form-error" role="alert">
          Couldn&apos;t send ({error}). Use the email link above instead.
        </p>
      )}
    </form>
  );
}
