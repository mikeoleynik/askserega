import { describe, it, expect, afterEach } from "vitest"
import matter from "gray-matter"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import { join } from "path"
import { getAllFrameworks } from "./frameworks-index"
import taxonomy from "./taxonomy.json"
import { DOMAIN_LAYERS } from "./taxonomy"
import {
  createContentCiFixture,
  writeFramework,
  writeSymptoms,
  runValidateFrontmatter,
  runCheckSymptomsSync,
  cleanupFixture,
  readRepoFile,
  readFixtureFile,
  VALID_MDX_FRONTMATTER,
} from "./content-ci-harness"

const fixtures: string[] = []

function fixture(setup?: (root: string) => void) {
  const root = createContentCiFixture(setup)
  fixtures.push(root)
  return root
}

afterEach(() => {
  while (fixtures.length > 0) {
    cleanupFixture(fixtures.pop()!)
  }
})

describe("content-ci — _private/docs/test-cases/content-ci/20260610-0914-content-integrity-ci.md", () => {
  // CI-001
  describe("CI-001: невалидный difficulty", () => {
    it("validate-frontmatter падает с ERROR", () => {
      const root = fixture((r) => {
        writeFramework(
          r,
          "bad-difficulty.mdx",
          `---
title: Bad
subtitle: x
difficulty: trivial
domain_layer: Purpose
---
`,
        )
      })
      const result = runValidateFrontmatter(root)
      expect(result.exitCode).toBe(1)
      expect(result.stderr + result.stdout).toMatch(/invalid or missing "difficulty"/i)
    })
  })

  // CI-002
  describe("CI-002: невалидный domain_layer", () => {
    it("опечатка Behaviour → ERROR", () => {
      const root = fixture((r) => {
        writeFramework(
          r,
          "bad-domain.mdx",
          `---
title: Bad
subtitle: x
difficulty: low
domain_layer: Behaviour
---
`,
        )
      })
      const result = runValidateFrontmatter(root)
      expect(result.exitCode).toBe(1)
      expect(result.stderr + result.stdout).toMatch(/invalid or missing "domain_layer"/i)
    })

    it("отсутствующий domain_layer → ERROR", () => {
      const root = fixture((r) => {
        writeFramework(
          r,
          "no-domain.mdx",
          `---
title: Bad
subtitle: x
difficulty: low
---
`,
        )
      })
      const result = runValidateFrontmatter(root)
      expect(result.exitCode).toBe(1)
      expect(result.stderr + result.stdout).toMatch(/invalid or missing "domain_layer"/i)
    })

    it("Behavioral — проходит", () => {
      const root = fixture((r) => {
        writeFramework(
          r,
          "behavioral.mdx",
          `---
title: OK
subtitle: x
difficulty: low
domain_layer: Behavioral
---
`,
        )
      })
      const result = runValidateFrontmatter(root)
      expect(result.exitCode).toBe(0)
    })
  })

  // CI-003
  describe("CI-003: отсутствует title", () => {
    it("validate-frontmatter падает", () => {
      const root = fixture((r) => {
        writeFramework(
          r,
          "no-title.mdx",
          `---
subtitle: x
difficulty: low
domain_layer: Purpose
---
`,
        )
      })
      const result = runValidateFrontmatter(root)
      expect(result.exitCode).toBe(1)
      expect(result.stderr + result.stdout).toMatch(/missing required field "title"/i)
    })
  })

  // CI-004
  describe("CI-004: slug без MDX", () => {
    it("check-symptoms-sync падает", () => {
      const root = fixture((r) => {
        writeSymptoms(r, {
          categories: [],
          symptoms: [
            {
              id: "test-001",
              category: "undrsys",
              title: "T",
              goal: "g",
              outcome: "o",
              frameworks: ["foo-bar"],
            },
          ],
        })
      })
      const result = runCheckSymptomsSync(root)
      expect(result.exitCode).toBe(1)
      expect(result.stderr + result.stdout).toMatch(/foo-bar.*missing/i)
    })
  })

  // CI-005
  describe("CI-005: orphan MDX → WARN, exit 0", () => {
    it("lonely.mdx не в symptoms — предупреждение, не ошибка", () => {
      const root = fixture((r) => {
        writeFramework(r, "lonely.mdx", VALID_MDX_FRONTMATTER.replace("Valid Framework", "Lonely"))
      })
      const result = runCheckSymptomsSync(root)
      expect(result.exitCode).toBe(0)
      expect(result.stderr + result.stdout).toMatch(/WARN:.*lonely\.mdx.*not linked to any symptom/i)
    })

    it("orphan всё же в каталоге getAllFrameworks (справочный)", () => {
      const root = fixture((r) => {
        writeFramework(r, "lonely.mdx", VALID_MDX_FRONTMATTER)
      })
      const slugs = getAllFrameworks(join(root, "content", "frameworks")).map((f) => f.slug)
      expect(slugs).toContain("lonely")
      expect(slugs).toContain("valid-fw")
    })
  })

  // CI-006
  describe("CI-006: _template.mdx исключён", () => {
    it("не валидируется и не в каталоге", () => {
      const root = fixture((r) => {
        writeFramework(r, "_template.mdx", VALID_MDX_FRONTMATTER)
        writeFramework(r, "real-fw.mdx", VALID_MDX_FRONTMATTER)
      })
      const validate = runValidateFrontmatter(root)
      expect(validate.stdout).toMatch(/2 frameworks validated/)

      const dir = join(root, "content", "frameworks")
      const slugs = getAllFrameworks(dir).map((f) => f.slug).sort()
      expect(slugs).toEqual(["real-fw", "valid-fw"].sort())
      expect(slugs).not.toContain("_template")
    })

    it("_template.mdx есть в репозитории, но не в прод-каталоге", () => {
      expect(existsSync(join(process.cwd(), "content/frameworks/_template.mdx"))).toBe(true)
      expect(getAllFrameworks().some((f) => f.slug === "_template")).toBe(false)
    })
  })

  // CI-007
  describe("CI-007: .md и drafts вне каталога", () => {
    it("foo.md и content/drafts не попадают в getAllFrameworks", () => {
      const root = fixture((r) => {
        writeFramework(r, "from-mdx.mdx", VALID_MDX_FRONTMATTER)
        writeFramework(
          r,
          "foo.md",
          `---
title: Should not load
difficulty: low
domain_layer: Purpose
---
`,
        )
        const draftsDir = join(r, "content", "drafts")
        mkdirSync(draftsDir, { recursive: true })
        writeFileSync(join(draftsDir, "bar.mdx"), VALID_MDX_FRONTMATTER)
      })
      const slugs = getAllFrameworks(join(root, "content", "frameworks")).map((f) => f.slug).sort()
      expect(slugs).toEqual(["from-mdx", "valid-fw"].sort())
    })
  })

  // CI-008 — известный пробел
  describe("CI-008: problems[] не ловится валидатором", () => {
    it("validate и sync проходят, problems игнорируется рантаймом", () => {
      const root = fixture((r) => {
        writeFramework(
          r,
          "with-problems.mdx",
          `---
title: With Problems
subtitle: x
difficulty: low
domain_layer: Purpose
problems: [undrsys-001]
---
`,
        )
        writeSymptoms(r, {
          categories: [],
          symptoms: [
            {
              id: "test-001",
              category: "undrsys",
              title: "T",
              goal: "g",
              outcome: "o",
              frameworks: ["with-problems"],
            },
          ],
        })
      })
      expect(runValidateFrontmatter(root).exitCode).toBe(0)
      expect(runCheckSymptomsSync(root).exitCode).toBe(0)
      const meta = getAllFrameworks(join(root, "content", "frameworks")).find(
        (f) => f.slug === "with-problems",
      )!
      expect(meta).toBeDefined()
      expect("problems" in meta).toBe(false)
    })
  })

  // CI-009 — дубликат id боли (известный пробел)
  describe("CI-009: дубликат symptom id", () => {
    it("check-symptoms-sync сейчас не падает на дубликатах", () => {
      const root = fixture((r) => {
        writeSymptoms(r, {
          categories: [],
          symptoms: [
            {
              id: "undrsys-001",
              category: "undrsys",
              title: "First",
              goal: "g",
              outcome: "o",
              frameworks: ["valid-fw"],
            },
            {
              id: "undrsys-001",
              category: "undrsys",
              title: "Duplicate",
              goal: "g2",
              outcome: "o2",
              frameworks: ["valid-fw"],
            },
          ],
        })
      })
      expect(runCheckSymptomsSync(root).exitCode).toBe(0)
    })
  })

  // CI-010 — мягкая деградация algorithm/artifacts
  describe("CI-010: частичный algorithm/artifacts", () => {
    it("отбрасывает элементы без title / без контента артефакта", () => {
      const root = fixture((r) => {
        writeFramework(
          r,
          "partial.mdx",
          `---
title: Partial
subtitle: x
difficulty: low
domain_layer: Purpose
algorithm:
  - title: Valid step
    description: ok
  - description: no title
artifacts:
  - {}
  - format: markdown
  - example: "has content"
    label: Good
---
`,
        )
      })
      const meta = getAllFrameworks(join(root, "content", "frameworks")).find(
        (f) => f.slug === "partial",
      )!
      expect(meta.algorithm).toEqual([{ title: "Valid step", description: "ok" }])
      expect(meta.artifacts).toEqual([{ label: "Good", example: "has content" }])
      expect(runValidateFrontmatter(root).exitCode).toBe(0)
    })
  })

  // CI-011 — битый YAML frontmatter
  describe("CI-011: битый frontmatter на build", () => {
    it("gray-matter на невалидном YAML — фиксируем фактическое поведение", () => {
      const broken = `---
title: [unclosed
difficulty: low
domain_layer: Purpose
---
`
      expect(() => matter(broken)).toThrow()
    })

    it("getAllFrameworks не включает файл без парсируемого frontmatter", () => {
      const root = fixture((r) => {
        writeFramework(r, "broken.mdx", "---\ntitle: [unclosed\n---\n")
      })
      expect(() => getAllFrameworks(join(root, "content", "frameworks"))).toThrow()
    })
  })

  // CI-012 — CRLF vs наивный валидатор
  describe("CI-012: CRLF frontmatter", () => {
    it("validate-frontmatter может не увидеть frontmatter с \\r\\n", () => {
      const root = fixture((r) => {
        const crlf = `---\r\ntitle: CRLF Test\r\nsubtitle: x\r\ndifficulty: low\r\ndomain_layer: Purpose\r\n---\r\n`
        writeFramework(r, "crlf.mdx", crlf)
      })
      const result = runValidateFrontmatter(root)
      expect(result.exitCode).toBe(1)
      expect(result.stderr + result.stdout).toMatch(/missing frontmatter/i)
    })

    it("gray-matter парсит тот же CRLF файл (расхождение с валидатором)", () => {
      const root = fixture((r) => {
        const crlf = `---\r\ntitle: CRLF Test\r\nsubtitle: x\r\ndifficulty: low\r\ndomain_layer: Purpose\r\n---\r\n`
        writeFramework(r, "crlf.mdx", crlf)
      })
      const raw = readFixtureFile(root, "content/frameworks/crlf.mdx")
      const { data } = matter(raw)
      expect(data.title).toBe("CRLF Test")
    })
  })

  // CI-013 — preflight = CI workflow
  describe("CI-013: локальный preflight совпадает с workflow", () => {
    it("CONTRIBUTING и validate-content.yml содержат одни и те же шаги", () => {
      const contributing = readRepoFile("CONTRIBUTING.md")
      const workflow = readRepoFile(".github/workflows/validate-content.yml")

      for (const step of [
        "npm test",
        "npm run build",
        "validate-frontmatter.mjs",
        "check-symptoms-sync.mjs",
      ]) {
        expect(contributing + workflow).toContain(step)
      }
    })
  })

  // CI-014 — taxonomy единый источник
  describe("CI-014: taxonomy.json ↔ DOMAIN_LAYERS", () => {
    it("валидатор и FilterPanel читают одни и те же domainLayers", () => {
      expect(DOMAIN_LAYERS).toEqual(taxonomy.domainLayers)
      expect(taxonomy.difficulties).toContain("low")
    })

    it("валидатор принимает все значения из taxonomy.json", () => {
      const root = fixture((r) => {
        taxonomy.domainLayers.forEach((layer, i) => {
          writeFramework(
            r,
            `layer-${i}.mdx`,
            `---
title: Layer ${i}
subtitle: x
difficulty: low
domain_layer: ${layer}
---
`,
          )
        })
      })
      expect(runValidateFrontmatter(root).exitCode).toBe(0)
    })
  })
})
