import { readFileSync, readdirSync, existsSync } from "fs"
import { join } from "path"

// Источник правды о связях «фреймворк ↔ боль» — только src/lib/symptoms.ts.
// MDX больше не содержит problems[] (выводится из symptoms.ts), поэтому проверка односторонняя:
//   1. каждый slug в symptoms[].frameworks[] имеет content/frameworks/<slug>.mdx
//   2. предупреждение, если MDX не привязан ни к одной боли (справочный фреймворк)

const FRAMEWORKS_DIR = join(process.cwd(), "content", "frameworks")
const SYMPTOMS_FILE = join(process.cwd(), "src/lib/symptoms.ts")

function parseSymptomsFromTs(source) {
  const symptoms = []
  const blocks = [
    ...source.matchAll(
      /{\s*\n\s*id:\s*"([^"]+)"[\s\S]*?frameworks:\s*(\[[\s\S]*?\])\s*,?\s*\n\s*}/g,
    ),
  ]

  for (const match of blocks) {
    const id = match[1]
    const frameworks = [...match[2].matchAll(/"([^"]+)"/g)].map((m) => m[1])
    symptoms.push({ id, frameworks })
  }

  return symptoms
}

function getMdxSlugs() {
  if (!existsSync(FRAMEWORKS_DIR)) return new Set()

  return new Set(
    readdirSync(FRAMEWORKS_DIR)
      .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
      .map((f) => f.replace(/\.mdx$/, "")),
  )
}

function validate() {
  if (!existsSync(SYMPTOMS_FILE)) {
    console.error("ERROR: src/lib/symptoms.ts not found")
    process.exit(1)
  }

  const symptoms = parseSymptomsFromTs(readFileSync(SYMPTOMS_FILE, "utf-8"))
  const mdxSlugs = getMdxSlugs()
  const referenced = new Set()
  let errors = 0

  for (const symptom of symptoms) {
    for (const slug of symptom.frameworks) {
      referenced.add(slug)
      if (!mdxSlugs.has(slug)) {
        console.error(
          `ERROR: symptoms.ts — symptom "${symptom.id}" references "${slug}" but content/frameworks/${slug}.mdx is missing`,
        )
        errors++
      }
    }
  }

  for (const slug of mdxSlugs) {
    if (!referenced.has(slug)) {
      console.warn(`WARN: ${slug}.mdx — not linked to any symptom (reference-only framework)`)
    }
  }

  if (errors > 0) {
    console.error(`\n${errors} symptom sync error(s) found.`)
    process.exit(1)
  }

  console.log(
    `✓ Symptoms sync OK (${symptoms.length} symptoms, ${mdxSlugs.size} MDX frameworks).`,
  )
}

validate()
