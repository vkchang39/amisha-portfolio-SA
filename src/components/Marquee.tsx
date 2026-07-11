const PHRASES = [
  "Grove Street — Home",
  "Mission Passed + Respect",
  "15+ Projects Delivered",
  "Agile · Scrum · Waterfall",
  "No Cheat Codes Used",
  "Sprint Planning OG",
  "On Time. On Budget.",
];

export function Marquee() {
  const row = PHRASES.map((phrase, i) => (
    <span key={i} className="mx-8 inline-flex items-center gap-8">
      <span>{phrase}</span>
      <span className="text-money" aria-hidden>
        ★
      </span>
    </span>
  ));

  return (
    <div className="relative overflow-hidden border-y border-sand/15 bg-night-2 py-3">
      <div className="marquee-track flex w-max whitespace-nowrap font-[family-name:var(--font-oswald)] text-sm uppercase tracking-[0.3em] text-sand/60">
        <div className="flex shrink-0">{row}</div>
        <div className="flex shrink-0" aria-hidden>
          {row}
        </div>
      </div>
    </div>
  );
}
