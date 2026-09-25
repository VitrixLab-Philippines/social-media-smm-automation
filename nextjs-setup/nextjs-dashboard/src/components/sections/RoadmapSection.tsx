import PhaseBadge from "@/components/ui/PhaseBadge";

/** RoadmapSection — section component (id: #roadmap).
 *  Four phases with status badges: completed, upcoming, future.
 *  Uses <ol> for semantic ordered list.
 */
const phases = [
  {
    label: "Meta / Instagram and Facebook Page",
    badge: { variant: "completed" as const, text: "Completed" },
    desc: "Publishing adapter, moderation, human approval gate and analytics feedback loop.",
    delay: undefined,
  },
  {
    label: "LinkedIn and X",
    badge: { variant: "upcoming" as const, text: "In progress" },
    desc: "Multi-platform text and post expansion. Single planner, per-network adapter.",
    delay: "1",
  },
  {
    label: "TikTok and YouTube",
    badge: { variant: "upcoming" as const, text: "Upcoming" },
    desc: "Video content and short/long-form publishing through the same adapter contract.",
    delay: "2",
  },
  {
    label: "Analytics-driven recommendation loop",
    badge: { variant: "future" as const, text: "Planned" },
    desc: "Performance scoring and topic prioritization feeding back into the planning stage.",
    delay: "3",
  },
] as const;

export default function RoadmapSection() {
  return (
    <section className="wrap section" id="roadmap">
      <div className="section-head" data-reveal>
        <span className="eyebrow">Build sequence</span>
        <h2>Start focused. Expand behind adapters.</h2>
      </div>

      <ol className="phase-list" aria-label="Roadmap phases">
        {phases.map((phase) => (
          <li
            key={phase.label}
            className="phase-item"
            data-reveal
            data-delay={phase.delay}
          >
            <div className="phase-label">
              {phase.label}
              <PhaseBadge variant={phase.badge.variant}>
                {phase.badge.text}
              </PhaseBadge>
            </div>
            <p className="phase-desc">{phase.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
