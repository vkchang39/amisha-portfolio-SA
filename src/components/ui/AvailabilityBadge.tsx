import type { Availability } from "@/lib/resume";

/** Hiring-status line: the first thing a recruiter looks for. Reads like an SA "safehouse" tag. */
export function AvailabilityBadge({
  availability,
  compact = false,
}: {
  availability: Availability;
  compact?: boolean;
}) {
  return (
    <div className={`availability-badge ${compact ? "availability-badge-compact" : ""}`}>
      <span className="availability-dot" aria-hidden />
      <span className="availability-status">{availability.status}</span>
      {!compact && (
        <>
          <span className="availability-sep" aria-hidden>·</span>
          <span>{availability.roles}</span>
        </>
      )}
      <span className="availability-sep" aria-hidden>·</span>
      <span>{availability.location}</span>
      <span className="availability-sep" aria-hidden>·</span>
      <span>{availability.notice}</span>
    </div>
  );
}
