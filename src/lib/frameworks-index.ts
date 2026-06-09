import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { Difficulty, DomainLayer } from "./taxonomy"

export interface FrameworkLink {
  label: string
  url: string
}

export interface FrameworkArtifact {
  label?: string
  filename?: string
  example?: string
  format?: "markdown" | "code"
  open_url?: string
  open_label?: string
}

export interface FrameworkMeta {
  slug: string
  title: string
  subtitle: string
  summary?: string
  difficulty: Difficulty
  domain_layer: DomainLayer
  links: FrameworkLink[]
  intent?: string
  prompt?: string
  theory_anchor?: string
  artifact_desc?: string
  artifacts: FrameworkArtifact[]
}

function parseLinks(data: Record<string, unknown>): FrameworkLink[] {
  if (!Array.isArray(data.links)) return []

  return data.links
    .filter(
      (item): item is { label: string; url: string } =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as FrameworkLink).label === "string" &&
        typeof (item as FrameworkLink).url === "string"
    )
    .map((item) => ({ label: item.label, url: item.url }))
}

function parseArtifactItem(raw: unknown): FrameworkArtifact | null {
  if (typeof raw !== "object" || raw === null) return null

  const artifact = raw as Record<string, unknown>
  const example = typeof artifact.example === "string" ? artifact.example : undefined
  const label = typeof artifact.label === "string" ? artifact.label : undefined
  const filename = typeof artifact.filename === "string" ? artifact.filename : undefined
  const open_url = typeof artifact.open_url === "string" ? artifact.open_url : undefined
  const open_label = typeof artifact.open_label === "string" ? artifact.open_label : undefined
  const format =
    artifact.format === "markdown" || artifact.format === "code" ? artifact.format : undefined

  if (!example && !label && !filename && !open_url) return null

  return { label, filename, example, format, open_url, open_label }
}

function parseArtifacts(data: Record<string, unknown>): FrameworkArtifact[] {
  if (Array.isArray(data.artifacts)) {
    return data.artifacts
      .map(parseArtifactItem)
      .filter((item): item is FrameworkArtifact => item !== null)
  }

  const single = parseArtifactItem(data.artifact)
  return single ? [single] : []
}

const FRAMEWORKS_DIR = path.join(process.cwd(), "content", "frameworks")

export function getAllFrameworks(): FrameworkMeta[] {
  if (!fs.existsSync(FRAMEWORKS_DIR)) return []

  const files = fs.readdirSync(FRAMEWORKS_DIR).filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))

  return files.map((file) => {
    const slug = file.replace(/\.mdx$/, "")
    const raw = fs.readFileSync(path.join(FRAMEWORKS_DIR, file), "utf-8")
    const { data } = matter(raw)
    return {
      slug,
      title: data.title || slug,
      subtitle: data.subtitle || "",
      summary: data.summary,
      difficulty: data.difficulty || "medium",
      domain_layer: data.domain_layer || "",
      links: parseLinks(data),
      intent: data.intent,
      prompt: data.prompt,
      theory_anchor: data.theory_anchor,
      artifact_desc: data.artifact_desc,
      artifacts: parseArtifacts(data),
    }
  })
}

export function getFrameworkBySlug(slug: string): FrameworkMeta | null {
  const frameworks = getAllFrameworks()
  return frameworks.find((f) => f.slug === slug) || null
}

export function getFrameworkContent(slug: string): string | null {
  const filePath = path.join(FRAMEWORKS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  return fs.readFileSync(filePath, "utf-8")
}
