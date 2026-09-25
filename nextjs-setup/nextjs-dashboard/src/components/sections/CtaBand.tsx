/** CtaBand — section component.
 *  Full-bleed closing CTA — single action, no distractions.
 *  Subtle bottom-center glow bookends the hero glow (R-13: 2nd of 2 allowed glows).
 */
export default function CtaBand() {
  return (
    <section className="cta-band" aria-label="Get started with SMMAI">
      <div className="wrap cta-band-inner" data-reveal>
        <h2>Ready to automate your social media?</h2>
        <p>Human approval stays in control. Always.</p>
        <a
          className="btn primary"
          href="https://github.com/vitrixLab/social-media-smm-automation"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore the repository
        </a>
      </div>
    </section>
  );
}
