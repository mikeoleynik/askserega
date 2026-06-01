export default function Footer() {
  return (
    <footer className="border-t border-surface-alt">
      <div className="max-w-[1200px] mx-auto px-8 py-6 flex items-center justify-between">
        <span className="mono text-[11px] text-subtle">
          AskSerega — Питер Науэр и{" "}
          <a
            href="https://mikeoleynik.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text transition-colors underline underline-offset-2"
          >
            Михаил Олейник
          </a>
          , 1985 - 2026
        </span>
        <span className="mono text-[11px] text-subtle">v0.1.0-alpha</span>
      </div>
    </footer>
  )
}
