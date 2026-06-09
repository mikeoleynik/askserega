import data from "../../content/symptoms.json"

export interface SymptomCategory {
  id: string
  title: string
  color: string
}

export interface Symptom {
  id: string
  category: string
  title: string
  goal: string
  outcome: string
  frameworks: string[]
}

// Единственный источник данных о болях — content/symptoms.json.
// Здесь только типы и helper'ы; этот же JSON читают скрипты валидации.
export const symptomCategories: SymptomCategory[] = data.categories
export const symptoms: Symptom[] = data.symptoms

export function getCategoryColor(categoryId: string): string {
  return symptomCategories.find((c) => c.id === categoryId)?.color ?? "#64748b"
}

// Обратный индекс «фреймворк → боли» — единственный источник членства
// (поля problems[] в MDX нет, оно выводится отсюда).
let frameworkToSymptoms: Map<string, Symptom[]> | null = null

function getFrameworkSymptomIndex(): Map<string, Symptom[]> {
  if (frameworkToSymptoms) return frameworkToSymptoms

  const index = new Map<string, Symptom[]>()
  for (const symptom of symptoms) {
    for (const slug of symptom.frameworks) {
      const list = index.get(slug)
      if (list) list.push(symptom)
      else index.set(slug, [symptom])
    }
  }
  frameworkToSymptoms = index
  return index
}

export function getSymptomsForFramework(frameworkSlug: string): Symptom[] {
  return getFrameworkSymptomIndex().get(frameworkSlug) ?? []
}

export function resolveActiveSymptom(
  frameworkSlug: string,
  preferredSymptomId?: string | null
): Symptom | undefined {
  const frameworkSymptoms = getSymptomsForFramework(frameworkSlug)
  if (preferredSymptomId) {
    const preferred = frameworkSymptoms.find((s) => s.id === preferredSymptomId)
    if (preferred) return preferred
  }
  return frameworkSymptoms[0]
}

export function getFrameworkStepInSymptom(
  symptomId: string,
  frameworkSlug: string
): { step: number; total: number } | null {
  const symptom = symptoms.find((s) => s.id === symptomId)
  if (!symptom) return null

  const idx = symptom.frameworks.indexOf(frameworkSlug)
  if (idx === -1) return null

  return { step: idx + 1, total: symptom.frameworks.length }
}

export function getAllSymptomChainEdges(): Array<{ source: string; target: string }> {
  const seen = new Set<string>()
  const edges: Array<{ source: string; target: string }> = []

  for (const symptom of symptoms) {
    for (let i = 0; i < symptom.frameworks.length - 1; i++) {
      const source = symptom.frameworks[i]
      const target = symptom.frameworks[i + 1]
      const key = `${source}->${target}`
      if (!seen.has(key)) {
        seen.add(key)
        edges.push({ source, target })
      }
    }
  }

  return edges
}

export function getChainNeighbors(
  symptomId: string,
  frameworkSlug: string
): { requires: string[]; leadsTo: string[] } {
  const symptom = symptoms.find((s) => s.id === symptomId)
  if (!symptom) return { requires: [], leadsTo: [] }

  const idx = symptom.frameworks.indexOf(frameworkSlug)
  if (idx === -1) return { requires: [], leadsTo: [] }

  return {
    requires: idx > 0 ? [symptom.frameworks[idx - 1]] : [],
    leadsTo: idx < symptom.frameworks.length - 1 ? [symptom.frameworks[idx + 1]] : [],
  }
}

export function getSymptomsByCategory(categoryId: string): Symptom[] {
  return symptoms.filter((s) => s.category === categoryId)
}
