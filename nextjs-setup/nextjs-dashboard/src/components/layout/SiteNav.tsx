"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/** Site-wide navigation bar — fixed top, glassmorphic blur, theme toggle.
 *  Design: DESIGN.md — 64px height, emerald brand, Plus Jakarta Sans wordmark.
 *  Accessibility: skip link, keyboard nav, focus-visible outlines (R-32).
 */
export default function SiteNav() {
  const [isLight, setIsLight] = useState(false);

  // Restore saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("smma-theme");
    if (saved === "light") {
      document.documentElement.classList.add("light");
      requestAnimationFrame(() => setIsLight(true));
    }
  }, []);

  function toggleTheme() {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("smma-theme", next ? "light" : "dark");
  }

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <div className="wrap nav-inner">
        <Link className="logo" href="/" aria-label="SMMAI home">
          S M M <span className="ai">AI</span>
        </Link>

        <div className="nav-links">
          <Link className="link active" href="/#workflow">
            How it works
          </Link>
          <Link className="link" href="/#architecture">
            Architecture
          </Link>
          <Link className="link" href="/#security">
            Security
          </Link>
          <Link className="link" href="/#roadmap">
            Roadmap
          </Link>
          <Link className="link" href="/login">
            Login
          </Link>
        </div>

        <button
          className="theme-toggle"
          aria-label="Toggle light/dark theme"
          title="Toggle theme"
          onClick={toggleTheme}
        >
          <span aria-hidden="true">{isLight ? "☀" : "☾"}</span>
        </button>
      </div>
    </nav>
  );
}
