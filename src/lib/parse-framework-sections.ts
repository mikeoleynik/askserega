import matter from "gray-matter"

export interface AlgorithmStep {
  number: number
  title: string
  description: string
}

export interface AntiPattern {
  title: string
  description: string
}

export interface ParsedFrameworkSections {
  algorithm: AlgorithmStep[]
  antiPatterns: AntiPattern[]
}

function splitByH2(content: string): Record<string, string> {
  const sections: Record<string, string> = {}
  const parts = content.split(/^## /m).filter(Boolean)

  for (const part of parts) {
    const newline = part.indexOf("\n")
    if (newline === -1) continue
    const heading = part.slice(0, newline).trim()
    const body = part.slice(newline + 1).trim()
    sections[heading] = body
  }

  return sections
}

function parseAlgorithmSteps(text: string): AlgorithmStep[] {
  const steps: AlgorithmStep[] = []
  const lines = text.split("\n")

  for (const line of lines) {
    const boldMatch = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*:?\s*(.*)$/)
    if (boldMatch) {
      steps.push({
        number: parseInt(boldMatch[1], 10),
        title: boldMatch[2].trim(),
        description: boldMatch[3].trim(),
      })
      continue
    }

    const plainMatch = line.match(/^(\d+)\.\s+(.+)$/)
    if (plainMatch) {
      steps.push({
        number: parseInt(plainMatch[1], 10),
        title: plainMatch[2].trim(),
        description: "",
      })
    }
  }

  return steps
}

function parseAntiPatterns(text: string): AntiPattern[] {
  const patterns: AntiPattern[] = []

  for (const line of text.split("\n")) {
    const boldMatch = line.match(/^-\s+\*\*(.+?)\*\*:?\s*(.*)$/)
    if (boldMatch) {
      patterns.push({
        title: boldMatch[1].trim(),
        description: boldMatch[2].trim(),
      })
      continue
    }

    const plainMatch = line.match(/^-\s+(.+)$/)
    if (plainMatch) {
      patterns.push({
        title: plainMatch[1].trim(),
        description: "",
      })
    }
  }

  return patterns
}

export function parseFrameworkSections(raw: string): ParsedFrameworkSections {
  const { content } = matter(raw)
  const sections = splitByH2(content)

  const algorithmText =
    sections["The Algorithm"] ?? sections["Алгоритм"] ?? sections["Algorithm"] ?? ""
  const antiPatternsText =
    sections["Anti-patterns"] ?? sections["Антипаттерны"] ?? sections["Anti-patterns"] ?? ""

  return {
    algorithm: parseAlgorithmSteps(algorithmText),
    antiPatterns: parseAntiPatterns(antiPatternsText),
  }
}

export function getDifficultyLabel(difficulty: "low" | "medium" | "high"): string {
  switch (difficulty) {
    case "low":
      return "низкая"
    case "medium":
      return "средняя"
    case "high":
      return "высокая"
  }
}

export function getDifficultyShort(difficulty: "low" | "medium" | "high"): string {
  switch (difficulty) {
    case "low":
      return "Низк."
    case "medium":
      return "Сред."
    case "high":
      return "Выс."
  }
}

export function getEstimatedTime(difficulty: "low" | "medium" | "high"): string {
  switch (difficulty) {
    case "low":
      return "1–2 дня на внедрение"
    case "medium":
      return "3–5 дней на внедрение"
    case "high":
      return "1–2 недели на внедрение"
  }
}
