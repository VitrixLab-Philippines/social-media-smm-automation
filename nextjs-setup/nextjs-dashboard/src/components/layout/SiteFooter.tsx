/** SiteFooter — layout component.
 *  Simple one-line footer: wordmark + tagline + brand statement.
 *  Design tokens from DESIGN.md.
 */
export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <strong className="logo" style={{ fontSize: "var(--text-xs)" }}>
          S M M <span className="ai">AI</span>
        </strong>
        <span className="footer-sep" aria-hidden="true">&middot;</span>
        <span>AI-powered social media automation</span>
        <span className="footer-sep" aria-hidden="true">&middot;</span>
        <span className="footer-accent">Human approval remains in control.</span>
      </div>
    </footer>
  );
}
