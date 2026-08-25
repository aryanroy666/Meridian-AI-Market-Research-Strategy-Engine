const CONFIG = {
  pending: { label: "Pending", dot: "bg-ink-muted" },
  planning: { label: "Planning", dot: "bg-gold" },
  researching: { label: "Researching", dot: "bg-gold" },
  validating: { label: "Validating", dot: "bg-gold" },
  aggregating: { label: "Aggregating", dot: "bg-gold" },
  reporting: { label: "Reporting", dot: "bg-gold" },
  review: { label: "In review", dot: "bg-gold" },
  completed: { label: "Completed", dot: "bg-good" },
  failed: { label: "Failed", dot: "bg-bad" },
};


import { useTheme } from "../context/ThemeContext";

const ACTIVE = new Set([
  "pending",
  "planning",
  "researching",
  "validating",
  "aggregating",
  "reporting",
  "review",
]);

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] || { label: status, dot: "bg-ink-muted" };
  const pulsing = ACTIVE.has(status);

  const { theme, toggleTheme } = useTheme();

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-line ${theme == "dark" ? "bg-[#626161]" : "bg-surface"} px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-soft`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} ${pulsing ? "animate-pulse-soft" : ""}`} />
      {cfg.label}
    </span>
  );
}
