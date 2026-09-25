import ArchCard from "@/components/ui/ArchCard";

/** WorkflowSection — section component (id: #workflow).
 *  Three storytelling pairs: AI planning, human approval gate, publish & measure.
 *  Design: DESIGN.md — alternating story-pair layout (RHYTHM 2).
 *  Platform chips in pair 3 reuse arch-grid + card + border-glow (R-13).
 */
export default function WorkflowSection() {
  return (
    <section
      className="story-section"
      id="workflow"
      aria-label="How SMMAI works"
    >
      <div className="wrap">
        {/* Section header */}
        <div className="section-head" data-reveal>
          <span className="eyebrow">Your workflow</span>
          <h2>From idea to publish in three moves</h2>
          <p>
            Research, generate, approve. Each stage has a clear owner and a
            clean boundary. Nothing slips through without a human saying yes.
          </p>
        </div>

        {/* Pair 1: AI Planning */}
        <div className="story-pair" data-reveal>
          <div className="story-text">
            <div className="story-num">01 &mdash; Plan &amp; Generate</div>
            <h3>AI does the research and drafts the content</h3>
            <p>
              Campaigns, trends, audience signals and briefs feed the planner.
              Topics, formats, angles, hooks, captions and hashtags are
              generated automatically. Your team starts at 80% done.
            </p>
          </div>
          <div className="story-visual" aria-hidden="true">
            <div className="sv-ideas">
              <div className="sv-idea-card">
                <div className="sv-idea-dot">AI</div>
                <div className="sv-idea-body">
                  <div className="sv-idea-title">
                    Instagram Reel concept &middot; Brand awareness
                  </div>
                  <div className="sv-idea-meta">Generated &middot; Hook + 3 angles</div>
                </div>
              </div>
              <div className="sv-idea-card">
                <div className="sv-idea-dot">AI</div>
                <div className="sv-idea-body">
                  <div className="sv-idea-title">
                    LinkedIn article &middot; Thought leadership
                  </div>
                  <div className="sv-idea-meta">Generated &middot; Draft ready for review</div>
                </div>
              </div>
              <div className="sv-idea-card">
                <div className="sv-idea-dot">AI</div>
                <div className="sv-idea-body">
                  <div className="sv-idea-title">
                    X thread &middot; Product launch (6 posts)
                  </div>
                  <div className="sv-idea-meta">Generated &middot; Hashtags + CTA included</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pair 2: Human approval gate — visual left, text right */}
        <div className="story-pair story-pair--flip" data-reveal>
          <div className="story-visual" aria-hidden="true">
            <div className="sv-gate">
              <div className="sv-gate-ring">
                <span className="sv-gate-check">&#10003;</span>
              </div>
              <div className="sv-gate-label">Human approval gate</div>
            </div>
          </div>
          <div className="story-text">
            <div className="story-num">02 &mdash; Review &amp; Approve</div>
            <h3>A human approves before anything goes live</h3>
            <p>
              Policy checks run first. Then an explicit human approval signal is
              required. Nothing bypasses this gate &mdash; not a scheduled post,
              not a retry, not an edge case. The gate is the product.
            </p>
          </div>
        </div>

        {/* Pair 3: Multi-platform publish — text left, platform grid right */}
        <div className="story-pair" data-reveal>
          <div className="story-text">
            <div className="story-num">03 &mdash; Publish &amp; Measure</div>
            <h3>Publish everywhere, feed performance back in</h3>
            <p>
              Meta first &mdash; with adapters for LinkedIn, X, TikTok and
              YouTube behind a clean contract. Performance metrics normalize and
              flow back into topic scoring, so every post teaches the next one.
            </p>
          </div>
          {/* Platform chips — reuse arch-grid + card + border-glow */}
          <div className="story-visual" aria-hidden="true">
            <div
              className="sv-platforms arch-grid"
              style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: ".625rem" }}
            >
              {[
                { name: "Meta",      status: "live" },
                { name: "Instagram", status: "live" },
                { name: "LinkedIn",  status: "wip"  },
                { name: "X",         status: "wip"  },
                { name: "TikTok",    status: ""     },
                { name: "YouTube",   status: ""     },
              ].map((p) => (
                <ArchCard
                  key={p.name}
                  className={`sv-platform ${p.status}`}
                  style={{ padding: ".625rem .875rem", gridColumn: "auto" }}
                >
                  <div className="sv-platform-dot" />
                  <span>{p.name}</span>
                </ArchCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
