"use client"

import { useState } from "react"
import { symptomCategories, symptoms } from "@/lib/symptoms"
import SymptomCard from "./SymptomCard"

export default function HomeSymptomsSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = activeCategory
    ? symptoms.filter((s) => s.category === activeCategory)
    : symptoms

  return (
    <section className="max-w-[1200px] mx-auto px-8 pt-10 pb-12">
      <div className="mono text-[10px] text-subtle uppercase tracking-[0.12em] flex items-center gap-2 mb-5">
        <span className="text-blueprint/60">▸</span> Начните с вашей проблемы
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <CategoryChip
          label="Все"
          active={activeCategory === null}
          onClick={() => setActiveCategory(null)}
        />
        {symptomCategories.map((category) => (
          <CategoryChip
            key={category.id}
            label={category.title}
            color={category.color}
            active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((symptom) => (
          <SymptomCard key={symptom.id} symptom={symptom} />
        ))}
      </div>
    </section>
  )
}

function CategoryChip({
  label,
  color,
  active,
  onClick,
}: {
  label: string
  color?: string
  active: boolean
  onClick: () => void
}) {
  const isColored = Boolean(color)

  return (
    <button
      type="button"
      onClick={onClick}
      className={`mono text-[11px] px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? isColored
            ? "font-medium"
            : "bg-text text-white border-text font-medium"
          : "bg-surface text-muted border-surface-alt hover:border-[#d1d5db] hover:text-text"
      }`}
      style={
        active && isColored
          ? { color, borderColor: color, backgroundColor: `${color}14` }
          : undefined
      }
    >
      {label}
    </button>
  )
}
