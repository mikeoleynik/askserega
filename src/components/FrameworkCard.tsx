import Link from "next/link"
import { Badge } from "./ui/badge"
import type { FrameworkMeta } from "@/lib/frameworks-index"
import { getFrameworkStepInSymptom, getSymptomsForFramework } from "@/lib/symptoms"
import { getDifficultyShort } from "@/lib/taxonomy"

interface FrameworkCardProps {
  framework: FrameworkMeta
  symptomId?: string | null
}

export default function FrameworkCard({ framework, symptomId }: FrameworkCardProps) {
  const href = symptomId
    ? `/frameworks/${framework.slug}?symptom=${symptomId}`
    : `/frameworks/${framework.slug}`

  const step = symptomId ? getFrameworkStepInSymptom(symptomId, framework.slug) : null

  const symptomCount = getSymptomsForFramework(framework.slug).length
  const footerLabel = step
    ? `Шаг ${step.step} из ${step.total}`
    : symptomCount > 0
      ? `${symptomCount} ${symptomCount === 1 ? "боль" : "боли"}`
      : "Справочный"

  return (
    <Link href={href} className="block">
      <div className="framework-card-inner bg-surface rounded-[8px] p-5 h-full flex flex-col cursor-pointer">
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="min-w-0">
            <h3 className="text-[14px] font-semibold text-text tracking-[-0.15px] leading-snug">
              {framework.title}
            </h3>
            <p className="mono text-[10px] text-subtle uppercase tracking-wider mt-0.5">
              {framework.subtitle}
            </p>
          </div>
          <Badge variant={framework.difficulty}>
            {getDifficultyShort(framework.difficulty)}
          </Badge>
        </div>

        <p className="text-[13px] text-muted leading-relaxed flex-1 mb-4">
          {framework.intent || framework.subtitle}
        </p>

        <div className="flex items-center gap-1.5 pt-2.5 border-t border-surface-alt">
          <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] shrink-0" />
          <span className="mono text-[10px] text-subtle truncate">{footerLabel}</span>
        </div>
      </div>
    </Link>
  )
}
