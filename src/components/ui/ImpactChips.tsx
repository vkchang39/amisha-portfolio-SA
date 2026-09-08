import type { ImpactMetric } from "@/lib/resume";

/** Row of quantified-outcome chips (value + label), styled like SA stat readouts. */
export function ImpactChips({
  items,
  accent = "money",
}: {
  items?: ImpactMetric[];
  accent?: "money" | "sunset";
}) {
  if (!items || items.length === 0) return null;

  return (
    <ul className={`impact-chips impact-chips-${accent}`} aria-label="Key results">
      {items.map((item) => (
        <li key={`${item.value}-${item.label}`} className="impact-chip">
          <span className="impact-chip-value">{item.value}</span>
          <span className="impact-chip-label">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
