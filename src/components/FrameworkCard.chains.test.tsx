import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import FrameworkCard from "./FrameworkCard"
import { getAllFrameworks } from "@/lib/frameworks-index"
import { getFrameworkStepInSymptom, resolveActiveSymptom, symptoms } from "@/lib/symptoms"
import type { FrameworkMeta } from "@/lib/frameworks-index"

const frameworks = getAllFrameworks()

const ORPHAN_FIXTURE: FrameworkMeta = {
  slug: "orphan-fixture",
  title: "Orphan Fixture",
  subtitle: "No symptoms",
  difficulty: "low",
  domain_layer: "Purpose",
  links: [],
  artifacts: [],
  algorithm: [],
  antipatterns: [],
}

describe("FrameworkCard chains — _private/docs/test-cases/chains/20260610-0914-chain-neighbors-steps.md", () => {
  afterEach(() => cleanup())
  // CHN-004 — футер каталога совпадает с detail
  describe("CHN-004: «Шаг N из M» на карточке", () => {
    it("undrsys-003: футеры совпадают с getFrameworkStepInSymptom", () => {
      const symptom = "undrsys-003"
      const chain = symptoms.find((s) => s.id === symptom)!.frameworks.map(
        (slug) => frameworks.find((f) => f.slug === slug)!,
      )

      for (const fw of chain) {
        const step = getFrameworkStepInSymptom(symptom, fw.slug)!
        const { unmount } = render(<FrameworkCard framework={fw} symptomId={symptom} />)
        expect(screen.getByText(`Шаг ${step.step} из ${step.total}`)).toBeInTheDocument()
        unmount()
      }
    })
  })

  // CHN-005 — detail fallback отражается в шаге при валидном symptomId в каталоге
  describe("CHN-005: каталог с невалидным symptom", () => {
    it("карточка без шага, если slug не в указанной боли", () => {
      const c4 = frameworks.find((f) => f.slug === "c4-model")!
      render(<FrameworkCard framework={c4} symptomId="complex-006" />)
      expect(screen.queryByText(/Шаг \d+ из \d+/)).not.toBeInTheDocument()
      expect(screen.getByText(/\d+ бол/)).toBeInTheDocument()
    })
  })

  // CHN-008 — справочный фреймворк
  describe("CHN-008: orphan футер", () => {
    it("показывает «Справочный» без symptomId", () => {
      render(<FrameworkCard framework={ORPHAN_FIXTURE} />)
      expect(screen.getByText("Справочный")).toBeInTheDocument()
    })

    it("resolveActiveSymptom undefined для orphan", () => {
      expect(resolveActiveSymptom(ORPHAN_FIXTURE.slug, null)).toBeUndefined()
    })
  })
})
