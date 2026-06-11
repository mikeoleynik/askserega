import type { FrameworkMeta } from "./frameworks-index"
import type { Symptom } from "./symptoms"

export interface CatalogFilterInput {
  difficulty: string | null
  domain_layer: string | null
  symptom: string | null
  sort: "title" | "difficulty"
}

export function resolveActiveSymptom(
  symptomId: string | null,
  allSymptoms: Symptom[],
): Symptom | null {
  if (!symptomId) return null
  return allSymptoms.find((s) => s.id === symptomId) ?? null
}

export function filterFrameworks(
  frameworks: FrameworkMeta[],
  filter: CatalogFilterInput,
  activeSymptom: Symptom | null,
): FrameworkMeta[] {
  let result = [...frameworks]

  if (filter.difficulty) {
    result = result.filter((fw) => fw.difficulty === filter.difficulty)
  }

  if (filter.domain_layer) {
    result = result.filter((fw) => fw.domain_layer === filter.domain_layer)
  }

  if (filter.symptom && activeSymptom) {
    result = result.filter((fw) => activeSymptom.frameworks.includes(fw.slug))
    const orderMap = new Map(activeSymptom.frameworks.map((s, i) => [s, i]))
    result.sort((a, b) => (orderMap.get(a.slug) ?? 999) - (orderMap.get(b.slug) ?? 999))
  } else if (filter.sort === "difficulty") {
    const diffOrder = { low: 0, medium: 1, high: 2 }
    result.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty])
  } else {
    result.sort((a, b) => a.title.localeCompare(b.title))
  }

  return result
}

/** Склонение счётчика «N фреймворк/фреймворка/фреймворков». */
export function formatFrameworkCount(count: number): string {
  if (count === 1) return "фреймворк"
  if (count >= 2 && count <= 4) return "фреймворка"
  return "фреймворков"
}

/** URL каталога персистит только ?symptom=. */
export function buildCatalogUrl(symptomId: string | null): string {
  if (!symptomId) return "/frameworks"
  return `/frameworks?symptom=${symptomId}`
}
