import Link from "next/link"
import { getCategoryColor, type Symptom } from "@/lib/symptoms"

interface SymptomCardProps {
  symptom: Symptom
}

export default function SymptomCard({ symptom }: SymptomCardProps) {
  const accent = getCategoryColor(symptom.category)

  return (
    <Link
      href={`/frameworks?symptom=${symptom.id}`}
      className="pain-btn text-left p-4 pl-[15px] bg-surface rounded-[8px] border-y border-r border-surface-alt border-l-[3px] hover:border-y-[#d1d5db] hover:border-r-[#d1d5db] transition-all"
      style={{ borderLeftColor: accent }}
    >
      <div
        className="pain-code mono text-[10px] uppercase tracking-wider mb-2 font-medium"
        style={{ color: accent }}
      >
        {symptom.id.toUpperCase()}
      </div>
      <div className="text-[13px] font-medium text-text mb-1.5 leading-snug">
        {symptom.title}
      </div>
      <div className="pain-hint mono text-[10px] text-subtle">→ {symptom.goal}</div>
    </Link>
  )
}
