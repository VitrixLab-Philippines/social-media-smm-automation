type BadgeVariant = "completed" | "upcoming" | "future";

interface PhaseBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

/** PhaseBadge — UI primitive.
 *  Dot + label chip for roadmap phase status.
 *  Variants: completed (emerald), upcoming (blue), future (muted).
 *  Design: DESIGN.md — accent #f59e0b for amber status only (not used here per spec).
 */
export default function PhaseBadge({ variant, children }: PhaseBadgeProps) {
  return (
    <span className={`phase-badge ${variant}`}>{children}</span>
  );
}
