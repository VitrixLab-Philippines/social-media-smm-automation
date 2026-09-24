import ArchCard from "@/components/ui/ArchCard";

/** ArchitectureSection — section component (id: #architecture).
 *  Six-layer architecture grid: each card explains one pipeline stage.
 *  Border glow on all cards via ArchCard (R-13: arch section only).
 *  First card spans full width (feature card).
 *  Design: DESIGN.md arch-grid pattern.
 */
const layers = [
  {
    eyebrow: "01 · Foundation",
    title: "AI provider",
    desc: "One interface for generated content, with a local stub for dev and tests. Swap the model, keep the pipeline.",
    cta: "Hands drafts to Moderation →",
    label: "Layer 01 — AI provider",
    delay: undefined as 0 | 1 | 2 | 3 | undefined,
  },
  {
    eyebrow: "02 · Guardrail",
    title: "Moderation",
    desc: "Brand rules, prohibited topics and required disclosures validated on every draft. Nothing publishes just because a model wrote it.",
    cta: "Escalates clean drafts →",
    label: "Layer 02 — Moderation",
    delay: 1 as const,
  },
  {
    eyebrow: "03 · Gate",
    title: "Human approval",
    desc: "The line AI does not cross. Drafts pause until a human explicitly approves. No approval, no publish.",
    cta: "Releases approved posts →",
    label: "Layer 03 — Human approval",
    delay: 2 as const,
  },
  {
    eyebrow: "04 · Translation",
    title: "Platform adapters",
    desc: "One approved post, many networks. Meta first, with a contract LinkedIn, X, TikTok and YouTube will follow.",
    cta: "Queues native payloads →",
    label: "Layer 04 — Platform adapters",
    delay: 1 as const,
  },
  {
    eyebrow: "05 · Timing",
    title: "Scheduling",
    desc: "GitHub Actions today, durable job runner when volume demands it. One question — when.",
    cta: "Feeds performance signals →",
    label: "Layer 05 — Scheduling",
    delay: 2 as const,
  },
  {
    eyebrow: "06 · Loop",
    title: "Analytics feedback",
    desc: "Metrics flow back into planning. Tomorrow's drafts are informed by today's results. Not a line — a loop.",
    cta: "↺ Returns insight to AI provider",
    label: "Layer 06 — Analytics feedback",
    delay: 3 as const,
  },
] as const;

export default function ArchitectureSection() {
  return (
    <section className="wrap section" id="architecture">
      <div className="section-head" data-reveal>
        <span className="eyebrow">Platform architecture</span>
        <h2>Automation without a monolith</h2>
        <p>
          Six layers, one story. Each does one job, hands off to the next, and
          never reaches across boundaries.
        </p>
      </div>

      <div className="arch-grid">
        {layers.map((layer) => (
          <ArchCard
            key={layer.title}
            ariaLabel={layer.label}
            revealDelay={layer.delay}
          >
            <div className="card-body">
              <span className="eyebrow">{layer.eyebrow}</span>
              <h3 className="title">{layer.title}</h3>
              <p className="desc">{layer.desc}</p>
              <span className="cta">{layer.cta}</span>
            </div>
          </ArchCard>
        ))}
      </div>
    </section>
  );
}
