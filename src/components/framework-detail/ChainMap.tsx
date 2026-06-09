import Link from "next/link"
import type { FrameworkMeta } from "@/lib/frameworks-index"
import { getDifficultyShort } from "@/lib/taxonomy"

interface ChainMapProps {
  current: FrameworkMeta
  requires: FrameworkMeta[]
  leadsTo: FrameworkMeta[]
  hrefFor: (slug: string) => string
  stepInfo?: { step: number; total: number } | null
  symptomTitle?: string
}

function difficultyBadgeClass(difficulty: FrameworkMeta["difficulty"]): string {
  switch (difficulty) {
    case "low":
      return "bg-[#f0fdf4] text-[#16a34a]"
    case "medium":
      return "bg-[#fffbeb] text-[#b45309]"
    case "high":
      return "bg-[#fef2f2] text-[#dc2626]"
  }
}

function ChainArrow() {
  return (
    <div
      className="shrink-0 flex items-center justify-center text-subtle/40 py-1 sm:py-0 sm:px-1"
      aria-hidden
    >
      <svg
        className="w-5 h-5 hidden sm:block"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
      <svg
        className="w-5 h-5 sm:hidden"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M12 5v14m0 0l-4-4m4 4l4-4"
        />
      </svg>
    </div>
  )
}

function ChainNeighborCard({
  roleLabel,
  fw,
  href,
}: {
  roleLabel: string
  fw: FrameworkMeta
  href: string
}) {
  return (
    <Link
      href={href}
      className="mini-card flex-1 min-w-0 sm:min-w-[200px] bg-surface-alt rounded-[8px] p-4 block border border-transparent hover:border-[#d1d5db] transition-colors"
    >
      <p className="mono text-[10px] text-subtle uppercase tracking-wider mb-3">{roleLabel}</p>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-[13px] font-semibold text-text leading-snug">{fw.title}</h4>
        <span
          className={`mono text-[10px] px-1.5 py-0.5 rounded-sm shrink-0 ${difficultyBadgeClass(fw.difficulty)}`}
        >
          {getDifficultyShort(fw.difficulty)}
        </span>
      </div>
      {fw.subtitle && (
        <p className="text-[12px] text-muted leading-relaxed">{fw.subtitle}</p>
      )}
      {fw.domain_layer && (
        <div className="mono text-[10px] text-subtle mt-3">{fw.domain_layer}</div>
      )}
    </Link>
  )
}

function ChainCurrentCard({ fw }: { fw: FrameworkMeta }) {
  return (
    <div className="flex-1 min-w-0 sm:min-w-[200px] rounded-[8px] p-4 bg-text text-white">
      <p className="mono text-[10px] text-white/60 uppercase tracking-wider mb-3">Вы здесь</p>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-[13px] font-semibold leading-snug">{fw.title}</h4>
        <span className="mono text-[10px] px-1.5 py-0.5 rounded-sm shrink-0 bg-white/15 text-white/90">
          {getDifficultyShort(fw.difficulty)}
        </span>
      </div>
      {(fw.subtitle || fw.summary) && (
        <p className="text-[12px] text-white/75 leading-relaxed">{fw.subtitle || fw.summary}</p>
      )}
      {fw.domain_layer && (
        <div className="mono text-[10px] text-white/50 mt-3">{fw.domain_layer}</div>
      )}
    </div>
  )
}

export default function ChainMap({
  current,
  requires,
  leadsTo,
  hrefFor,
  stepInfo,
  symptomTitle,
}: ChainMapProps) {
  const previous = requires[0]
  const next = leadsTo[0]

  return (
    <div className="bg-surface rounded-[8px] border border-surface-alt p-5">
      {stepInfo && symptomTitle && (
        <p className="text-[12px] text-muted mb-4 leading-relaxed">
          Шаг {stepInfo.step} из {stepInfo.total} в пути «{symptomTitle}»
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-stretch">
        {previous && (
          <>
            <ChainNeighborCard
              roleLabel="Сначала примените"
              fw={previous}
              href={hrefFor(previous.slug)}
            />
            <ChainArrow />
          </>
        )}

        <ChainCurrentCard fw={current} />

        {next && (
          <>
            <ChainArrow />
            <ChainNeighborCard
              roleLabel="Что дальше в теории"
              fw={next}
              href={hrefFor(next.slug)}
            />
          </>
        )}
      </div>
    </div>
  )
}
