import { describe, it, expect } from "vitest"
import { getAllFrameworks } from "./frameworks-index"
import { symptoms } from "./symptoms"
import {
  filterFrameworks,
  formatFrameworkCount,
  resolveActiveSymptom,
  buildCatalogUrl,
} from "./catalog-filter"

const allFrameworks = getAllFrameworks()

function filterWithSymptom(
  symptomId: string | null,
  extra: Partial<Parameters<typeof filterFrameworks>[1]> = {},
) {
  const activeSymptom = resolveActiveSymptom(symptomId, symptoms)
  return filterFrameworks(
    allFrameworks,
    {
      difficulty: null,
      domain_layer: null,
      symptom: symptomId,
      sort: "title",
      ...extra,
    },
    activeSymptom,
  )
}

describe("catalog-filter — doc/test-cases/catalog/20260610-0914-filters-search-empty.md", () => {
  // CAT-001 — Комбинация difficulty + domain + symptom (AND)
  describe("CAT-001: фильтры AND", () => {
    it("возвращает пересечение symptom + difficulty + domain_layer", () => {
      const result = filterWithSymptom("bound-006", {
        difficulty: "high",
        domain_layer: "Evolution",
      })

      const bound006 = symptoms.find((s) => s.id === "bound-006")!
      const expected = bound006.frameworks
        .map((slug) => allFrameworks.find((fw) => fw.slug === slug)!)
        .filter((fw) => fw.difficulty === "high" && fw.domain_layer === "Evolution")

      expect(result.map((fw) => fw.slug)).toEqual(expected.map((fw) => fw.slug))
      expect(result.length).toBeGreaterThan(0)
      result.forEach((fw) => {
        expect(fw.difficulty).toBe("high")
        expect(fw.domain_layer).toBe("Evolution")
        expect(bound006.frameworks).toContain(fw.slug)
      })
    })
  })

  // CAT-002 — Symptom-фильтр задаёт порядок (не алфавит)
  describe("CAT-002: порядок цепочки боли", () => {
    it("сохраняет порядок frameworks[] для undrsys-002", () => {
      const expectedOrder = [
        "event-storming",
        "ubiquitous-language",
        "bounded-context-mapping",
        "system-theory-anchor",
        "reference-architecture",
      ]

      const result = filterWithSymptom("undrsys-002")
      expect(result.map((fw) => fw.slug)).toEqual(expectedOrder)
    })
  })

  // CAT-003 — Сортировка по сложности без активной боли
  describe("CAT-003: сортировка по сложности", () => {
    it("упорядочивает low → medium → high без symptom", () => {
      const result = filterFrameworks(
        allFrameworks,
        { difficulty: null, domain_layer: null, symptom: null, sort: "difficulty" },
        null,
      )

      const diffOrder = { low: 0, medium: 1, high: 2 }
      for (let i = 1; i < result.length; i++) {
        expect(diffOrder[result[i].difficulty]).toBeGreaterThanOrEqual(
          diffOrder[result[i - 1].difficulty],
        )
      }
    })
  })

  // CAT-004 — Пустой результат комбинации фильтров
  describe("CAT-004: пустое пересечение фильтров", () => {
    it("возвращает пустой список при несовместимой комбинации", () => {
      const result = filterWithSymptom("bound-006", {
        difficulty: "low",
        domain_layer: "Evolution",
      })
      expect(result).toHaveLength(0)
    })
  })

  // CAT-006 — Невалидный ?symptom=
  describe("CAT-006: невалидный symptom", () => {
    it("не применяет symptom-фильтр при неизвестном id", () => {
      const activeSymptom = resolveActiveSymptom("does-not-exist", symptoms)
      expect(activeSymptom).toBeNull()

      const result = filterFrameworks(
        allFrameworks,
        {
          difficulty: null,
          domain_layer: null,
          symptom: "does-not-exist",
          sort: "title",
        },
        activeSymptom,
      )

      expect(result).toHaveLength(allFrameworks.length)
    })
  })

  // CAT-007 — Счётчик и склонение
  describe("CAT-007: склонение фреймворк/фреймворка/фреймворков", () => {
    const cases: [number, string][] = [
      [1, "фреймворк"],
      [2, "фреймворка"],
      [3, "фреймворка"],
      [4, "фреймворка"],
      [5, "фреймворков"],
      [11, "фреймворков"],
      [22, "фреймворков"],
      [23, "фреймворков"],
      [34, "фреймворков"],
    ]

    it.each(cases)("N=%i → «%s»", (n, expected) => {
      expect(formatFrameworkCount(n)).toBe(expected)
    })
  })

  // CAT-005 (часть) — URL персистит только ?symptom=
  describe("CAT-005: URL-state", () => {
    it("buildCatalogUrl сохраняет только symptom", () => {
      expect(buildCatalogUrl(null)).toBe("/frameworks")
      expect(buildCatalogUrl("know-002")).toBe("/frameworks?symptom=know-002")
    })
  })
})
