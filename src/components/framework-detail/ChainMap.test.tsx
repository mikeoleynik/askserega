import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import ChainMap from "./ChainMap"
import { getAllFrameworks } from "@/lib/frameworks-index"
import { getChainNeighbors, getFrameworkStepInSymptom, symptoms } from "@/lib/symptoms"

const frameworks = getAllFrameworks()
const bySlug = (slug: string) => frameworks.find((f) => f.slug === slug)!

function renderChainMap(symptomId: string, currentSlug: string) {
  const current = bySlug(currentSlug)
  const { requires, leadsTo } = getChainNeighbors(symptomId, currentSlug)
  const stepInfo = getFrameworkStepInSymptom(symptomId, currentSlug)
  const symptomTitle = symptoms.find((s) => s.id === symptomId)?.title

  return render(
    <ChainMap
      current={current}
      requires={requires.map(bySlug)}
      leadsTo={leadsTo.map(bySlug)}
      hrefFor={(slug) => `/frameworks/${slug}?symptom=${symptomId}`}
      stepInfo={stepInfo}
      symptomTitle={symptomTitle}
    />,
  )
}

function hasLinkTo(slug: string) {
  return screen
    .getAllByRole("link")
    .some((link) => link.getAttribute("href")?.includes(`/frameworks/${slug}`))
}

describe("ChainMap — _private/docs/test-cases/chains/20260610-0914-chain-neighbors-steps.md", () => {
  afterEach(() => cleanup())
  // CHN-001
  describe("CHN-001: первый шаг", () => {
    it("без «Сначала примените», есть «Вы здесь» и «Что дальше»", () => {
      renderChainMap("undrsys-001", "system-context-mapping")

      expect(screen.queryByText("Сначала примените")).not.toBeInTheDocument()
      expect(screen.getByText("Вы здесь")).toBeInTheDocument()
      expect(screen.getByText("Что дальше в теории")).toBeInTheDocument()
      expect(screen.getByText(/Шаг 1 из 4/)).toBeInTheDocument()
      expect(hasLinkTo("c4-model")).toBe(true)
    })
  })

  // CHN-002
  describe("CHN-002: последний шаг", () => {
    it("есть «Сначала примените», нет «Что дальше»", () => {
      renderChainMap("undrsys-001", "adr")

      expect(screen.getByText("Сначала примените")).toBeInTheDocument()
      expect(screen.getByText("Вы здесь")).toBeInTheDocument()
      expect(screen.queryByText("Что дальше в теории")).not.toBeInTheDocument()
      expect(screen.getByText(/Шаг 4 из 4/)).toBeInTheDocument()
    })
  })

  // CHN-003 — UI для разных болей
  describe("CHN-003: c4-model в разных болях", () => {
    it("undrsys-001: соседи system-context-mapping и dependency-mapping", () => {
      renderChainMap("undrsys-001", "c4-model")
      expect(hasLinkTo("system-context-mapping")).toBe(true)
      expect(hasLinkTo("dependency-mapping")).toBe(true)
    })

    it("undrsys-003: соседи zachman-framework и uml-basics", () => {
      renderChainMap("undrsys-003", "c4-model")
      expect(hasLinkTo("zachman-framework")).toBe(true)
      expect(hasLinkTo("uml-basics")).toBe(true)
    })

    it("bound-001: соседи dependency-mapping и ddd-bounded-contexts", () => {
      renderChainMap("bound-001", "c4-model")
      expect(hasLinkTo("dependency-mapping")).toBe(true)
      expect(hasLinkTo("ddd-bounded-contexts")).toBe(true)
    })
  })
})
