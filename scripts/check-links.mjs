import { readFileSync, readdirSync, existsSync } from "fs"
import { join } from "path"

const FRAMEWORKS_DIR = join(process.cwd(), "content", "frameworks")

function validate() {
  if (!existsSync(FRAMEWORKS_DIR)) {
    console.log("No frameworks directory found, skipping link check.")
    return
  }

  const files = readdirSync(FRAMEWORKS_DIR).filter(
    (f) => f.endsWith(".mdx") && !f.startsWith("_"),
  )

  const slugMap = new Map(files.map((f) => [f.replace(/\.mdx$/, ""), f]))
  let errors = 0

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "")
    const content = readFileSync(join(FRAMEWORKS_DIR, file), "utf-8")
    const fm = extractFrontmatter(content)

    if (!fm) continue

    // Check requires links
    const requires = extractArray(fm, "requires")
    for (const req of requires) {
      if (!slugMap.has(req)) {
        console.error(`ERROR: ${file} — requires "${req}" doesn't exist`)
        errors++
      }
    }

    // Check leadsTo links
    const leadsTo = extractArray(fm, "leadsTo")
    for (const lead of leadsTo) {
      if (!slugMap.has(lead)) {
        console.error(`ERROR: ${file} — leadsTo "${lead}" doesn't exist`)
        errors++
      }
    }

    // Check bidirectional consistency
    for (const req of requires) {
      const reqContent = readFileSync(join(FRAMEWORKS_DIR, slugMap.get(req)), "utf-8")
      const reqFm = extractFrontmatter(reqContent)
      if (reqFm) {
        const reqLeadsTo = extractArray(reqFm, "leadsTo")
        if (!reqLeadsTo.includes(slug)) {
          console.warn(`WARN: ${slug} requires ${req}, but ${req} doesn't list ${slug} in leadsTo`)
        }
      }
    }
  }

  if (errors > 0) {
    console.error(`\n${errors} link error(s) found.`)
    process.exit(1)
  }

  console.log("✓ All links are consistent.")
}

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  return match ? match[1] : null
}

function extractArray(fm, key) {
  const re = new RegExp(`${key}:\\s*\\[([^\\]]*)\\]`)
  const match = fm.match(re)
  if (!match) return []
  return match[1]
    .split(",")
    .map((s) => s.trim().replace(/['"]/g, ""))
    .filter(Boolean)
}

validate()
