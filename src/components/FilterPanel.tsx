"use client"

import { Tag } from "./ui/tag"
import { symptomCategories, getSymptomsByCategory } from "@/lib/symptoms"

export interface FilterState {
  difficulty: string | null
  domain_layer: string | null
  symptom: string | null
  search: string
  sort: "title" | "difficulty"
}

interface FilterPanelProps {
  state: FilterState
  onStateChange: (state: FilterState) => void
}

const domainLayers = [
  { value: "Purpose", label: "Purpose" },
  { value: "Domain", label: "Domain" },
  { value: "Structural", label: "Structural" },
  { value: "Runtime", label: "Runtime" },
  { value: "Operational", label: "Operational" },
  { value: "Evolution", label: "Evolution" },
]

export default function FilterPanel({ state, onStateChange }: FilterPanelProps) {
  const setDifficulty = (d: string | null) => onStateChange({ ...state, difficulty: d })
  const setDomain = (d: string | null) => onStateChange({ ...state, domain_layer: d })
  const setSymptom = (s: string | null) => onStateChange({ ...state, symptom: s })
  const setSort = (s: "title" | "difficulty") => onStateChange({ ...state, sort: s })

  return (
    <aside className="w-48 shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-7">
        {/* Difficulty filter */}
        <div>
          <p className="mono text-[10px] text-subtle uppercase tracking-[0.12em] mb-2.5">
            Сложность
          </p>
          <div className="space-y-0.5">
            <button
              className={`sidebar-btn w-full text-left text-[13px] text-muted hover:text-text px-2 py-1 rounded-md hover:bg-surface-alt transition-colors ${
                !state.difficulty ? "active" : ""
              }`}
              onClick={() => setDifficulty(null)}
            >
              Все уровни
            </button>
            {["low", "medium", "high"].map((d) => (
              <button
                key={d}
                className={`sidebar-btn w-full text-left text-[13px] text-muted hover:text-text px-2 py-1 rounded-md hover:bg-surface-alt transition-colors ${
                  state.difficulty === d ? "active" : ""
                }`}
                onClick={() => setDifficulty(d)}
              >
                {d === "low" ? "Низкая" : d === "medium" ? "Средняя" : "Высокая"}
              </button>
            ))}
          </div>
        </div>

        {/* Domain layer filter */}
        <div>
          <p className="mono text-[10px] text-subtle uppercase tracking-[0.12em] mb-2.5">
            Домен
          </p>
          <div className="space-y-0.5">
            <button
              className={`sidebar-btn w-full text-left text-[13px] text-muted hover:text-text px-2 py-1 rounded-md hover:bg-surface-alt transition-colors ${
                !state.domain_layer ? "active" : ""
              }`}
              onClick={() => setDomain(null)}
            >
              Все домены
            </button>
            {domainLayers.map((d) => (
              <button
                key={d.value}
                className={`sidebar-btn w-full text-left text-[13px] text-muted hover:text-text px-2 py-1 rounded-md hover:bg-surface-alt transition-colors ${
                  state.domain_layer === d.value ? "active" : ""
                }`}
                onClick={() => setDomain(d.value)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Symptom filter */}
        <div>
          <p className="mono text-[10px] text-subtle uppercase tracking-[0.12em] mb-2.5">
            Проблемы
          </p>
          <div className="space-y-1">
            <button
              className={`sidebar-btn w-full text-left text-[13px] text-muted hover:text-text px-2 py-1 rounded-md hover:bg-surface-alt transition-colors ${
                !state.symptom ? "active" : ""
              }`}
              onClick={() => setSymptom(null)}
            >
              Все
            </button>
            {symptomCategories.map((category) => {
              const categorySymptoms = getSymptomsByCategory(category.id)
              if (categorySymptoms.length === 0) return null

              return (
                <div key={category.id} className="mt-3 first:mt-0">
                  <p className="mono text-[9px] text-subtle/80 uppercase tracking-wider mb-1 px-2">
                    {category.title}
                  </p>
                  {categorySymptoms.map((s) => (
                    <button
                      key={s.id}
                      className={`sidebar-btn w-full text-left text-[13px] text-muted hover:text-text px-2 py-1 rounded-md hover:bg-surface-alt transition-colors ${
                        state.symptom === s.id ? "active" : ""
                      }`}
                      onClick={() => setSymptom(s.id)}
                    >
                      {s.title.length > 30 ? s.title.slice(0, 30) + "..." : s.title}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {/* Sort */}
        <div>
          <p className="mono text-[10px] text-subtle uppercase tracking-[0.12em] mb-2.5">
            Сортировка
          </p>
          <div className="space-y-0.5">
            <button
              className={`sidebar-btn w-full text-left text-[13px] text-muted hover:text-text px-2 py-1 rounded-md hover:bg-surface-alt transition-colors ${
                state.sort === "title" ? "active" : ""
              }`}
              onClick={() => setSort("title")}
            >
              По названию
            </button>
            <button
              className={`sidebar-btn w-full text-left text-[13px] text-muted hover:text-text px-2 py-1 rounded-md hover:bg-surface-alt transition-colors ${
                state.sort === "difficulty" ? "active" : ""
              }`}
              onClick={() => setSort("difficulty")}
            >
              По сложности
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
