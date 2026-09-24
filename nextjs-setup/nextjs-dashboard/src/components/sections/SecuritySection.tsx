import ArchCard from "@/components/ui/ArchCard";
import PhaseBadge from "@/components/ui/PhaseBadge";

/** SecuritySection — section component (id: #security).
 *  Four security guarantee cards: dry-run, secrets, moderation, approval.
 *  Uses ArchCard for border-glow (arch-grid class applied to grid wrapper).
 */
const securityCards = [
  {
    title: "Dry-run first",
    desc: (
      <>
        Development and scheduled QA use <strong>DRY_RUN=true</strong>. The
        Meta adapter does not send live requests in dry-run mode.
      </>
    ),
    label: "Dry-run first",
    delay: undefined as 0 | 1 | 2 | 3 | undefined,
  },
  {
    title: "Secrets stay out of source",
    desc: (
      <>
        OAuth tokens, API keys and refresh tokens belong in environment
        variables and GitHub Secrets, not config files or commits.
      </>
    ),
    label: "Secrets stay out of source",
    delay: 1 as const,
  },
  {
    title: "Moderation before publish",
    desc: (
      <>
        A failed policy check blocks publication. Empty content and missing
        required disclosures are rejected.
      </>
    ),
    label: "Moderation before publish",
    delay: 2 as const,
  },
  {
    title: "Explicit approval",
    desc: (
      <>
        The publishing service requires a human approval signal{" "}
        <PhaseBadge variant="completed">before a live publish can proceed</PhaseBadge>.
      </>
    ),
    label: "Explicit approval",
    delay: 3 as const,
  },
] as const;

export default function SecuritySection() {
  return (
    <section className="wrap section" id="security">
      <div className="section-head" data-reveal>
        <span className="eyebrow">Safety by default</span>
        <h2>Automation with control built in</h2>
        <p>
          Live publishing is deliberately constrained until platform permissions
          and API behavior are validated.
        </p>
      </div>

      <div className="security-grid arch-grid">
        {securityCards.map((card) => (
          <ArchCard
            key={card.title}
            ariaLabel={card.label}
            revealDelay={card.delay}
            style={{ gridColumn: "auto" }}
          >
            <div className="title">{card.title}</div>
            <p className="desc">{card.desc}</p>
          </ArchCard>
        ))}
      </div>
    </section>
  );
}
