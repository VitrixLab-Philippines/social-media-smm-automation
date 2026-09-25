"use client";

import { useEffect } from "react";

/**
 * useScrollReveal — hook that manages IntersectionObserver-based entrance animations.
 *
 * Observes all [data-reveal] elements. Hero elements reveal immediately.
 * All others reveal at 12% threshold as they scroll into view.
 * Respects prefers-reduced-motion: instantly reveals all when reduced motion is set (R-19).
 */
export function useScrollReveal() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (reducedMotion) {
      els.forEach((el) => el.classList.add("revealed"));
      return;
    }

    // Hero content reveals immediately on load (not scroll-gated)
    const heroEls = document.querySelectorAll<HTMLElement>(
      ".hero-inner [data-reveal]"
    );
    heroEls.forEach((el) => {
      setTimeout(() => el.classList.add("revealed"), 80);
    });

    // All other elements use IntersectionObserver
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => {
      if (!el.closest(".hero-inner")) {
        io.observe(el);
      }
    });

    return () => io.disconnect();
  }, []);
}
