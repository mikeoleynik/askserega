import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, within, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import FrameworksClient from "./FrameworksClient"
import { getAllFrameworks } from "@/lib/frameworks-index"
import { symptoms } from "@/lib/symptoms"
import { DOMAIN_LAYERS } from "@/lib/taxonomy"

const frameworks = getAllFrameworks()
const replaceMock = vi.fn()

let searchParams = new URLSearchParams()

vi.mock("next/navigation", () => ({
  useSearchParams: () => searchParams,
  useRouter: () => ({ replace: replaceMock }),
}))

vi.mock("@/components/Header", () => ({ default: () => <div data-testid="header" /> }))
vi.mock("@/components/Footer", () => ({ default: () => <div data-testid="footer" /> }))

function renderCatalog() {
  return render(<FrameworksClient frameworks={frameworks} />)
}

function getGridCards() {
  const grid = document.getElementById("cards-grid")
  expect(grid).toBeTruthy()
  return grid!.querySelectorAll(":scope > a")
}

function getAside() {
  return document.querySelector("aside")!
}

describe("catalog UI — doc/test-cases/catalog/20260610-0914-filters-search-empty.md", () => {
  beforeEach(() => {
    replaceMock.mockClear()
    searchParams = new URLSearchParams()
  })

  afterEach(() => {
    cleanup()
  })

  // CAT-010 — SSR: initial HTML содержит полный список
  describe("CAT-010: полный каталог до гидрации", () => {
    it("рендерит все 34 фреймворка без активных фильтров", () => {
      expect(frameworks).toHaveLength(34)
      renderCatalog()

      expect(getGridCards()).toHaveLength(34)
    })
  })

  // CAT-002 — порядок цепочки в UI
  describe("CAT-002: порядок цепочки в каталоге", () => {
    it("сохраняет порядок undrsys-002 на карточках", () => {
      searchParams = new URLSearchParams("symptom=undrsys-002")
      renderCatalog()

      const expectedOrder = symptoms.find((s) => s.id === "undrsys-002")!.frameworks
      const cards = [...getGridCards()].map((a) => a.querySelector("h3")!)
      expect(cards.map((el) => el.textContent)).toEqual(
        expectedOrder.map((slug) => frameworks.find((fw) => fw.slug === slug)!.title),
      )
    })
  })

  // CAT-004 — Пустое состояние + сброс
  describe("CAT-004: пустое состояние", () => {
    it("показывает сообщение и кнопку сброса при 0 результатах", async () => {
      const user = userEvent.setup()
      searchParams = new URLSearchParams("symptom=bound-006")
      renderCatalog()

      const aside = getAside()
      await user.click(within(aside).getByRole("button", { name: "Низкая" }))
      await user.click(within(aside).getByRole("button", { name: "Evolution" }))

      expect(screen.getByText("// нет фреймворков по текущему фильтру")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Сбросить фильтры" })).toBeInTheDocument()
    })

    it("сброс очищает URL от ?symptom=", async () => {
      const user = userEvent.setup()
      searchParams = new URLSearchParams("symptom=bound-006")
      renderCatalog()

      const aside = getAside()
      await user.click(within(aside).getByRole("button", { name: "Низкая" }))
      await user.click(within(aside).getByRole("button", { name: "Evolution" }))
      await user.click(screen.getByRole("button", { name: "Сбросить фильтры" }))

      expect(replaceMock).toHaveBeenCalledWith("/frameworks", { scroll: false })
    })
  })

  // CAT-005 — URL персистит только ?symptom=
  describe("CAT-005: refresh теряет client-state фильтров", () => {
    it("после remount остаётся только symptom из URL", async () => {
      searchParams = new URLSearchParams("symptom=know-002")
      const user = userEvent.setup()
      const { unmount } = renderCatalog()

      const aside = getAside()
      await user.click(within(aside).getByRole("button", { name: "Низкая" }))
      await user.click(within(aside).getByRole("button", { name: "Evolution" }))
      expect(within(aside).getByRole("button", { name: "Низкая" }).className).toContain("active")
      expect(within(aside).getByRole("button", { name: "Evolution" }).className).toContain("active")

      unmount()
      searchParams = new URLSearchParams("symptom=know-002")
      renderCatalog()

      const asideAfter = getAside()
      expect(within(asideAfter).getByRole("button", { name: "Все уровни" }).className).toContain("active")
      expect(within(asideAfter).getByRole("button", { name: "Все домены" }).className).toContain("active")
      const know002 = symptoms.find((s) => s.id === "know-002")!
      expect(getGridCards()).toHaveLength(know002.frameworks.length)
    })

    it("updateFilter пишет в URL только symptom", async () => {
      const user = userEvent.setup()
      searchParams = new URLSearchParams("symptom=undrsys-002")
      renderCatalog()

      await user.click(within(getAside()).getByRole("button", { name: "Высокая" }))

      expect(replaceMock).toHaveBeenCalledWith("/frameworks?symptom=undrsys-002", { scroll: false })
    })
  })

  // CAT-006 — Невалидный ?symptom=
  describe("CAT-006: невалидный symptom в URL", () => {
    it("показывает полный каталог без goal/outcome блоков", () => {
      searchParams = new URLSearchParams("symptom=does-not-exist")
      renderCatalog()

      expect(getGridCards()).toHaveLength(34)
      expect(screen.queryByText("Результат")).not.toBeInTheDocument()
    })
  })

  // CAT-001 — AND в UI
  describe("CAT-001: комбинация фильтров в UI", () => {
    it("счётчик согласован с карточками при AND-фильтре", async () => {
      const user = userEvent.setup()
      searchParams = new URLSearchParams("symptom=bound-006")
      renderCatalog()

      const aside = getAside()
      await user.click(within(aside).getByRole("button", { name: "Высокая" }))
      await user.click(within(aside).getByRole("button", { name: "Evolution" }))

      const cards = getGridCards()
      const counter = screen.getByText(/\d+ фреймворк/)
      expect(counter.textContent).toMatch(new RegExp(`^${cards.length} `))
      expect(cards.length).toBeGreaterThan(0)
    })
  })

  // CAT-007 — склонение в UI
  describe("CAT-007: счётчик в UI", () => {
    it("показывает «34 фреймворков» для полного каталога", () => {
      renderCatalog()
      expect(screen.getByText("34 фреймворков")).toBeInTheDocument()
    })
  })

  // CAT-008 — domain_layer убран с карточки, фильтр работает
  describe("CAT-008: фильтр Домен без тега на карточке", () => {
    it("содержит все 7 доменов из taxonomy", () => {
      renderCatalog()
      const aside = getAside()
      for (const layer of DOMAIN_LAYERS) {
        expect(within(aside).getByRole("button", { name: layer })).toBeInTheDocument()
      }
    })

    it("фильтрует Behavioral без отображения domain_layer на карточке", async () => {
      const user = userEvent.setup()
      renderCatalog()

      await user.click(within(getAside()).getByRole("button", { name: "Behavioral" }))

      const behavioral = frameworks.filter((fw) => fw.domain_layer === "Behavioral")
      const cards = getGridCards()
      expect(cards).toHaveLength(behavioral.length)

      const card = cards[0] as HTMLElement
      for (const layer of DOMAIN_LAYERS) {
        expect(within(card).queryByText(layer)).not.toBeInTheDocument()
      }
    })
  })

  // CAT-009 — Ссылка на theory-map
  describe("CAT-009: ссылка на карту теории", () => {
    it("показывает вторичную ссылку на /theory-map", () => {
      renderCatalog()
      const link = screen.getByRole("link", { name: /Карта связей всех фреймворков/ })
      expect(link).toHaveAttribute("href", "/theory-map")
    })
  })

  // CAT-003 — сортировка по сложности в UI
  describe("CAT-003: сортировка по сложности", () => {
    it("упорядочивает карточки low → high", async () => {
      const user = userEvent.setup()
      renderCatalog()

      await user.click(within(getAside()).getByRole("button", { name: "По сложности" }))

      const diffOrder = { low: 0, medium: 1, high: 2 }
      const difficulties = [...getGridCards()].map((card) => {
        const slug = card.getAttribute("href")!.split("/").pop()!
        return frameworks.find((fw) => fw.slug === slug)!.difficulty
      })

      for (let i = 1; i < difficulties.length; i++) {
        expect(diffOrder[difficulties[i]]).toBeGreaterThanOrEqual(diffOrder[difficulties[i - 1]])
      }
    })
  })
})
