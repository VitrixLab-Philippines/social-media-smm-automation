"use client";

import { useEffect, useRef } from "react";

/** DashboardCard — dashboard component.
 *  The 3D hero visual — CSS perspective card that tilts ±6°/±10° on mousemove.
 *  Float animation + mouse tilt separated to avoid CSS/JS conflict.
 *  Guards: prefers-reduced-motion skips tilt; hover:hover only (no touch).
 *  Design: DESIGN.md hero visual spec.
 */
export default function DashboardCard() {
  const visualRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    const hoverPointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!hoverPointer) return;

    const visual = visualRef.current;
    const card = cardRef.current;
    if (!visual || !card) return;

    const onMove = (e: MouseEvent) => {
      const rect = visual.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = ((e.clientY - cy) / (rect.height / 2)) * -6;
      const ry = ((e.clientX - cx) / (rect.width / 2)) * 10;
      card.style.setProperty("--rx", (6 + rx).toFixed(2) + "deg");
      card.style.setProperty("--ry", (-14 + ry).toFixed(2) + "deg");
    };

    const onLeave = () => {
      card.style.setProperty("--rx", "6deg");
      card.style.setProperty("--ry", "-14deg");
    };

    visual.addEventListener("mousemove", onMove);
    visual.addEventListener("mouseleave", onLeave);
    return () => {
      visual.removeEventListener("mousemove", onMove);
      visual.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      className="hero-visual"
      ref={visualRef}
      aria-hidden="true"
      data-reveal
      data-delay="2"
    >
      <div className="dash-float-wrap">
        <div className="dashboard-card" ref={cardRef}>
          {/* Header */}
          <div className="dash-header">
            <div className="dash-header-brand">
              S M M <span className="ai">AI</span>
            </div>
            <div className="dash-status-pill">3 pending review</div>
          </div>

          {/* Content rows */}
          <div className="dash-items">
            {/* Approved item */}
            <div className="dash-item dash-item--approved">
              <div className="dash-item-icon">&#10003;</div>
              <div className="dash-item-body">
                <div className="dash-item-title">
                  Instagram &middot; Product launch post
                </div>
                <div className="dash-item-sub">
                  Approved by Sarah &middot; 2 min ago
                </div>
              </div>
              <div className="dash-item-right">
                <span className="dash-badge dash-badge--live">Live</span>
              </div>
            </div>

            {/* Pending item */}
            <div className="dash-item dash-item--pending">
              <div className="dash-item-icon">&#9711;</div>
              <div className="dash-item-body">
                <div className="dash-item-title">
                  LinkedIn &middot; Weekly brand update
                </div>
                <div className="dash-item-sub">Awaiting human approval</div>
              </div>
              <div className="dash-item-right">
                <button className="dash-approve-btn" tabIndex={-1}>
                  Approve
                </button>
                <button className="dash-reject-btn" tabIndex={-1}>
                  &#215;
                </button>
              </div>
            </div>

            {/* Draft item */}
            <div className="dash-item dash-item--draft">
              <div className="dash-item-icon">&#8727;</div>
              <div className="dash-item-body">
                <div className="dash-item-title">
                  X &middot; Campaign thread (5 posts)
                </div>
                <div className="dash-item-sub">
                  AI draft ready &middot; Moderation passed
                </div>
              </div>
              <div className="dash-item-right">
                <span className="dash-badge dash-badge--draft">Draft</span>
              </div>
            </div>
          </div>

          {/* Footer stats */}
          <div className="dash-footer">
            <div className="dash-stat">
              <strong>28</strong>
              posts this week
            </div>
            <div className="dash-stat">
              <strong>100%</strong>
              human-reviewed
            </div>
            <div className="dash-stat">
              <strong>0</strong>
              bypassed gate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
