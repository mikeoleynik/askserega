import FlexSearch from "flexsearch"
import type { FrameworkMeta } from "./frameworks-index"

let index: FlexSearch.Document<FrameworkMeta, true> | null = null
let indexedSlugs = new Set<string>()

export function getSearchIndex(): FlexSearch.Document<FrameworkMeta, true> {
  if (index) return index

  index = new FlexSearch.Document<FrameworkMeta, true>({
    document: {
      id: "slug",
      index: [
        { field: "title", tokenize: "forward" },
        { field: "subtitle", tokenize: "forward" },
        { field: "summary", tokenize: "forward" },
        { field: "problems", tokenize: "forward" },
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
    idx.add(fw)
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
      fw.problems.some((p) => p.toLowerCase().includes(q)),
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
