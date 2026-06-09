import FlexSearch from "flexsearch"
import type { FrameworkMeta } from "./frameworks-index"
import { getSymptomsForFramework } from "./symptoms"

// Членство в болях больше не хранится в MDX (problems[]) — оно выводится из symptoms.ts.
// Для поиска обогащаем документ текстом болей (symptomText), чтобы можно было искать
// по формулировке боли, а не по техническим id.
type IndexedFramework = FrameworkMeta & { symptomText: string }

let index: FlexSearch.Document<IndexedFramework, true> | null = null
let indexedSlugs = new Set<string>()

function symptomTextFor(slug: string): string {
  return getSymptomsForFramework(slug)
    .map((s) => `${s.title} ${s.goal}`)
    .join(" ")
}

export function getSearchIndex(): FlexSearch.Document<IndexedFramework, true> {
  if (index) return index

  index = new FlexSearch.Document<IndexedFramework, true>({
    document: {
      id: "slug",
      index: [
        { field: "title", tokenize: "forward" },
        { field: "subtitle", tokenize: "forward" },
        { field: "summary", tokenize: "forward" },
        { field: "symptomText", tokenize: "forward" },
      ],
      store: true,
    },
    tokenize: "forward",
    cache: true,
  })

  return index
}

export function buildSearchIndex(frameworks: FrameworkMeta[]) {
  const idx = getSearchIndex()
  for (const fw of frameworks) {
    if (indexedSlugs.has(fw.slug)) continue
    idx.add({ ...fw, symptomText: symptomTextFor(fw.slug) })
    indexedSlugs.add(fw.slug)
  }
}

function fallbackSearch(query: string, frameworks: FrameworkMeta[]): FrameworkMeta[] {
  const q = query.toLowerCase()
  return frameworks.filter(
    (fw) =>
      fw.title.toLowerCase().includes(q) ||
      fw.subtitle.toLowerCase().includes(q) ||
      (fw.summary?.toLowerCase().includes(q) ?? false) ||
      symptomTextFor(fw.slug).toLowerCase().includes(q),
  )
}

function extractSlug(item: unknown): string | null {
  if (typeof item === "string") return item
  if (item && typeof item === "object") {
    if ("id" in item && typeof (item as { id: unknown }).id === "string") {
      return (item as { id: string }).id
    }
    if ("doc" in item) {
      const doc = (item as { doc: { slug?: string } }).doc
      if (doc?.slug) return doc.slug
    }
  }
  return null
}

export async function searchFrameworks(
  query: string,
  frameworks: FrameworkMeta[],
): Promise<FrameworkMeta[]> {
  if (!query.trim()) return frameworks

  buildSearchIndex(frameworks)

  const idx = getSearchIndex()
  const results = await idx.searchAsync(query)
  const slugs = new Set<string>()

  for (const res of results) {
    if (!res.result) continue
    for (const item of res.result) {
      const slug = extractSlug(item)
      if (slug) slugs.add(slug)
    }
  }

  if (slugs.size === 0) {
    return fallbackSearch(query, frameworks)
  }

  return frameworks.filter((fw) => slugs.has(fw.slug))
}
