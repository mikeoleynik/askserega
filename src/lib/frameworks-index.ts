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

export interface AlgorithmStep {
  title: string
  description: string
}

export interface AntiPattern {
  title: string
  description: string
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
  algorithm: AlgorithmStep[]
  antipatterns: AntiPattern[]
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
  if (!Array.isArray(data.artifacts)) return []

  return data.artifacts
    .map(parseArtifactItem)
    .filter((item): item is FrameworkArtifact => item !== null)
}

function parseTitledList(raw: unknown): { title: string; description: string }[] {
  if (!Array.isArray(raw)) return []

  return raw
    .map((item) => {
      if (typeof item !== "object" || item === null) return null
      const obj = item as Record<string, unknown>
      const title = typeof obj.title === "string" ? obj.title : undefined
      if (!title) return null
      const description = typeof obj.description === "string" ? obj.description : ""
      return { title, description }
    })
    .filter((item): item is { title: string; description: string } => item !== null)
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
      algorithm: parseTitledList(data.algorithm),
      antipatterns: parseTitledList(data.antipatterns),
    }
  })
}

export function getFrameworkBySlug(slug: string): FrameworkMeta | null {
  const frameworks = getAllFrameworks()
  return frameworks.find((f) => f.slug === slug) || null
}
