import GitHubLink from "@/components/GitHubLink"
import { SITE_VERSION_LABEL } from "@/lib/version"

export default function Footer() {
  return (
    <footer className="border-t border-surface-alt">
      <div className="max-w-[1200px] mx-auto px-8 py-6 flex items-center justify-between">
        <span className="mono text-[11px] text-subtle">
          AskSerega — Питер Науэр, 1985
        </span>
        <div className="flex items-center gap-2.5">
          <GitHubLink size="sm" />
          <span className="mono text-[11px] text-subtle">{SITE_VERSION_LABEL}</span>
        </div>
      </div>
    </footer>
  )
}
