import { describe, it, expect } from "vitest"
import {
  symptoms,
  getChainNeighbors,
  getFrameworkStepInSymptom,
  getAllSymptomChainEdges,
  getSymptomsForFramework,
  resolveActiveSymptom,
} from "./symptoms"

/** CHN-007: смежные пары с противоположным направлением в разных болях */
function findConflictingAdjacentPairs(): Array<{
  forward: string
  backward: string
  forwardIn: string
  backwardIn: string
}> {
  const forward = new Map<string, string>()

  for (const symptom of symptoms) {
    for (let i = 0; i < symptom.frameworks.length - 1; i++) {
      const a = symptom.frameworks[i]
      const b = symptom.frameworks[i + 1]
      forward.set(`${a}->${b}`, symptom.id)
    }
  }

  const conflicts: Array<{
    forward: string
    backward: string
    forwardIn: string
    backwardIn: string
  }> = []

  for (const symptom of symptoms) {
    for (let i = 0; i < symptom.frameworks.length - 1; i++) {
      const a = symptom.frameworks[i]
      const b = symptom.frameworks[i + 1]
      const reverseKey = `${b}->${a}`
      const forwardIn = forward.get(`${a}->${b}`)
      const backwardIn = forward.get(reverseKey)
      if (forwardIn && backwardIn && forwardIn !== backwardIn) {
        conflicts.push({ forward: a, backward: b, forwardIn, backwardIn })
      }
    }
  }

  const seen = new Set<string>()
  return conflicts.filter((c) => {
    const key = [c.forward, c.backward].sort().join("|")
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

describe("symptoms chains — _private/docs/test-cases/chains/20260610-0914-chain-neighbors-steps.md", () => {
  // CHN-001 — первый шаг: нет previous
  describe("CHN-001: первый шаг цепочки", () => {
    it("undrsys-001 + system-context-mapping → нет requires, есть leadsTo", () => {
      const neighbors = getChainNeighbors("undrsys-001", "system-context-mapping")
      expect(neighbors.requires).toEqual([])
      expect(neighbors.leadsTo).toEqual(["c4-model"])
    })

    it("шаг 1 из 4", () => {
      expect(getFrameworkStepInSymptom("undrsys-001", "system-context-mapping")).toEqual({
        step: 1,
        total: 4,
      })
    })
  })

  // CHN-002 — последний шаг: нет next
  describe("CHN-002: последний шаг цепочки", () => {
    it("undrsys-001 + adr → requires dependency-mapping, нет leadsTo", () => {
      const neighbors = getChainNeighbors("undrsys-001", "adr")
      expect(neighbors.requires).toEqual(["dependency-mapping"])
      expect(neighbors.leadsTo).toEqual([])
    })

    it("шаг 4 из 4", () => {
      expect(getFrameworkStepInSymptom("undrsys-001", "adr")).toEqual({
        step: 4,
        total: 4,
      })
    })
  })

  // CHN-003 — один slug, разные соседи в разных болях
  describe("CHN-003: c4-model в разных болях", () => {
    const cases = [
      {
        symptom: "undrsys-001",
        requires: ["system-context-mapping"],
        leadsTo: ["dependency-mapping"],
        step: { step: 2, total: 4 },
      },
      {
        symptom: "undrsys-003",
        requires: ["zachman-framework"],
        leadsTo: ["uml-basics"],
        step: { step: 2, total: 5 },
      },
      {
        symptom: "bound-001",
        requires: ["dependency-mapping"],
        leadsTo: ["ddd-bounded-contexts"],
        step: { step: 2, total: 5 },
      },
    ] as const

    it.each(cases)(
      "$symptom: соседи и шаг для c4-model",
      ({ symptom, requires, leadsTo, step }) => {
        expect(getChainNeighbors(symptom, "c4-model")).toEqual({ requires, leadsTo })
        expect(getFrameworkStepInSymptom(symptom, "c4-model")).toEqual(step)
      },
    )
  })

  // CHN-004 — «Шаг N из M» единый источник
  describe("CHN-004: нумерация шагов", () => {
    it("undrsys-003: позиции в frameworks[] совпадают с getFrameworkStepInSymptom", () => {
      const symptom = symptoms.find((s) => s.id === "undrsys-003")!
      symptom.frameworks.forEach((slug, index) => {
        expect(getFrameworkStepInSymptom("undrsys-003", slug)).toEqual({
          step: index + 1,
          total: symptom.frameworks.length,
        })
      })
    })
  })

  // CHN-005 — невалидный ?symptom= → первая боль фреймворка
  describe("CHN-005: resolveActiveSymptom fallback", () => {
    const firstSymptomForC4 = getSymptomsForFramework("c4-model")[0]

    it("несуществующая боль → первая боль slug в JSON", () => {
      expect(resolveActiveSymptom("c4-model", "foo")).toEqual(firstSymptomForC4)
      expect(firstSymptomForC4.id).toBe("undrsys-001")
    })

    it("валидная боль, но slug не в её цепочке → та же первая боль", () => {
      expect(resolveActiveSymptom("c4-model", "complex-006")).toEqual(firstSymptomForC4)
    })

    it("fallback даёт шаг 2 из 4 и соседей undrsys-001", () => {
      expect(getFrameworkStepInSymptom(firstSymptomForC4.id, "c4-model")).toEqual({
        step: 2,
        total: 4,
      })
      expect(getChainNeighbors(firstSymptomForC4.id, "c4-model")).toEqual({
        requires: ["system-context-mapping"],
        leadsTo: ["dependency-mapping"],
      })
    })
  })

  // CHN-006 — дедуп рёбер theory-map
  describe("CHN-006: getAllSymptomChainEdges", () => {
    it("каждая пара source->target встречается ровно один раз", () => {
      const edges = getAllSymptomChainEdges()
      const keys = edges.map((e) => `${e.source}->${e.target}`)
      const unique = new Set(keys)
      expect(unique.size).toBe(keys.length)
    })
  })

  // CHN-007 — противоречивые направления (data integrity)
  // Открытый вопрос: ISSUES.md (CHN-007), openspec OQ-001
  describe("CHN-007: встречные смежные пары", () => {
    it("фиксирует известные встречные пары в symptoms.json (осознанный снимок)", () => {
      const conflicts = findConflictingAdjacentPairs()
      // Разные боли могут задавать противоположный порядок смежных фреймворков.
      // Снимок фиксирует текущее состояние данных для ревью контента.
      expect(conflicts.map((c) => `${c.forward}<->${c.backward}`).sort()).toMatchSnapshot()
    })
  })

  // CHN-008 — orphan без боли
  describe("CHN-008: фреймворк без боли", () => {
    it("resolveActiveSymptom возвращает undefined для slug без записей", () => {
      expect(getSymptomsForFramework("orphan-fixture-slug")).toEqual([])
      expect(resolveActiveSymptom("orphan-fixture-slug", null)).toBeUndefined()
      expect(resolveActiveSymptom("orphan-fixture-slug", "undrsys-001")).toBeUndefined()
    })

    it("getFrameworkStepInSymptom → null для slug вне цепочки", () => {
      expect(getFrameworkStepInSymptom("undrsys-001", "orphan-fixture-slug")).toBeNull()
    })
  })
})
