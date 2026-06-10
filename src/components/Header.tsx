import Image from "next/image"
import Link from "next/link"
import GitHubLink from "@/components/GitHubLink"

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 bg-canvas/95 backdrop-blur-sm border-b border-surface-alt">
      <div className="max-w-[1200px] mx-auto px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 shrink-0"
              priority
            />
            <span className="mono text-sm font-medium text-blueprint tracking-tight">
              AskSerega
            </span>
          </Link>
          <span className="text-surface-alt text-lg leading-none select-none">|</span>
          <span className="text-sm text-muted hidden sm:block truncate">
            Фреймворки для проектирования систем
          </span>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <GitHubLink />
          <Link
            href="/frameworks"
            className="text-sm bg-text text-white px-4 py-1.5 rounded-full font-medium hover:bg-overlay transition-colors"
          >
            Начать
          </Link>
        </div>
      </div>
    </nav>
  )
}
