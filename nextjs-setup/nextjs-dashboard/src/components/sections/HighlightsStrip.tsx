import React from "react";

/** HighlightsStrip — section component.
 *  Four key metrics across a full-bleed surface band.
 *  Design: DESIGN.md highlights-strip pattern.
 *  Numbers are the signal; labels clarify. No decorative use (R-09).
 */
const highlights = [
  { num: "100%", label: "Human-reviewed\nbefore publish" },
  { num: "6",    label: "Platforms\nsupported" },
  { num: "0",    label: "Posts live\nwithout approval" },
  { num: "DRY",  label: "Safe mode always\navailable" },
] as const;

export default function HighlightsStrip() {
  return (
    <section
      className="highlights-strip"
      aria-label="Key figures"
      data-reveal
    >
      <div className="wrap highlights-inner">
        {highlights.map((h, i) => (
          <React.Fragment key={h.num}>
            <div className="highlight">
              <div className="highlight-num">{h.num}</div>
              <div className="highlight-label">
                {h.label.split("\n").map((line, li) => (
                  <span key={li}>
                    {line}
                    {li === 0 && <br />}
                  </span>
                ))}
              </div>
            </div>
            {i < highlights.length - 1 && (
              <div className="highlight-divider" aria-hidden="true" />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
