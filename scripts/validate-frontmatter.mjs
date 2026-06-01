import { readFileSync, readdirSync, existsSync } from "fs"
import { join } from "path"

const FRAMEWORKS_DIR = join(process.cwd(), "content", "frameworks")
const VALID_DIFFICULTIES = ["low", "medium", "high"]
const VALID_DOMAIN_LAYERS = ["Purpose", "Domain", "Structural", "Runtime", "Operational", "Evolution"]

function validate() {
  if (!existsSync(FRAMEWORKS_DIR)) {
    console.log("No frameworks directory found, skipping validation.")
    return
  }

  const files = readdirSync(FRAMEWORKS_DIR).filter(
    (f) => f.endsWith(".mdx") && !f.startsWith("_"),
  )

  let errors = 0

  for (const file of files) {
    const content = readFileSync(join(FRAMEWORKS_DIR, file), "utf-8")
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)

    if (!frontmatterMatch) {
      console.error(`ERROR: ${file} — missing frontmatter`)
      errors++
      continue
    }

    const fm = parseFrontmatter(frontmatterMatch[1])

    if (!fm.title) {
      console.error(`ERROR: ${file} — missing required field "title"`)
      errors++
    }

    if (!fm.difficulty || !VALID_DIFFICULTIES.includes(fm.difficulty)) {
      console.error(`ERROR: ${file} — invalid or missing "difficulty". Must be one of: ${VALID_DIFFICULTIES.join(", ")}`)
      errors++
    }

    if (!fm.domain_layer || !VALID_DOMAIN_LAYERS.includes(fm.domain_layer)) {
      console.error(`ERROR: ${file} — invalid or missing "domain_layer"`)
      errors++
    }
  }

  if (errors > 0) {
    console.error(`\n${errors} validation error(s) found.`)
    process.exit(1)
  }

  console.log(`✓ All ${files.length} frameworks validated successfully.`)
}

function parseFrontmatter(raw) {
  const result = {}
  for (const line of raw.split("\n")) {
    const match = line.match(/^(\w+):\s*(.+)/)
    if (match) {
      result[match[1]] = match[2].trim()
    }
  }
  return result
}

validate()
