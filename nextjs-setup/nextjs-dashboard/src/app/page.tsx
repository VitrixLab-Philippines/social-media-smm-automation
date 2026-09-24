"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import HeroSection from "@/components/sections/HeroSection";
import WorkflowSection from "@/components/sections/WorkflowSection";
import HighlightsStrip from "@/components/sections/HighlightsStrip";
import ArchitectureSection from "@/components/sections/ArchitectureSection";
import SecuritySection from "@/components/sections/SecuritySection";
import RoadmapSection from "@/components/sections/RoadmapSection";
import CtaBand from "@/components/sections/CtaBand";

/**
 * Home — SMMAI landing page.
 *
 * Page structure (DESIGN.md RHYTHM 2 — sections vary in layout):
 *   SiteNav (fixed)
 *   ├── HeroSection         — split layout: text + 3D card
 *   ├── WorkflowSection     — 3 storytelling pairs (#workflow)
 *   ├── HighlightsStrip     — 4 key metrics band
 *   ├── ArchitectureSection — 6-layer grid (#architecture)
 *   ├── SecuritySection     — 4 security cards (#security)
 *   ├── RoadmapSection      — phase list (#roadmap)
 *   └── CtaBand             — closing CTA
 *   SiteFooter
 *
 * This component is a page-level orchestrator only — no layout logic lives here.
 */
export default function Home() {
  // Wire up scroll reveal entrance animations across all [data-reveal] elements
  useScrollReveal();

  return (
    <>
      {/* Skip link — R-32: keyboard accessibility */}
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <SiteNav />

      <main id="main-content">
        <HeroSection />
        <WorkflowSection />
        <HighlightsStrip />
        <ArchitectureSection />
        <SecuritySection />
        <RoadmapSection />
        <CtaBand />
      </main>

      <SiteFooter />
    </>
  );
}
