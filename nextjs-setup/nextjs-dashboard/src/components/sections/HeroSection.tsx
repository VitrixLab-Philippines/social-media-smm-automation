import DashboardCard from "@/components/dashboard/DashboardCard";
import Link from "next/link";

/** HeroSection — section component.
 *  Split layout: text left / 3D dashboard card right.
 *  Hero ambient glow behind headline (R-13: one element, hero only).
 *  Design: DESIGN.md hero spec.
 */
export default function HeroSection() {
  return (
    <section className="hero-section" aria-label="SMMAI hero">
      <div className="hero-inner">
        <div className="hero-content" data-reveal>
          <span className="eyebrow">
            Social media AI, built for control
          </span>
          <h1>
            Scale content.
            <br />
            <strong className="headline-accent">Keep the human gate.</strong>
          </h1>
          <p className="lead">
            SMMAI plans your content calendar, generates{" "}
            <span>brand-safe drafts</span>, routes every post through human
            approval, and publishes across Meta, LinkedIn, X and beyond.{" "}
            <strong>AI does the work. You make the call.</strong>
          </p>
          <div className="hero-actions">
            <Link className="btn primary" href="#workflow">
              See how it works
            </Link>
            <Link className="btn secondary" href="#roadmap">
              View Roadmap
            </Link>
          </div>
        </div>

        {/* 3D Dashboard card — decorative, aria-hidden set inside component */}
        <DashboardCard />
      </div>
    </section>
  );
}
