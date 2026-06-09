import taxonomy from "./taxonomy.json"

// Единый источник правды о таксономии каталога.
// Значения берутся из ./taxonomy.json — тот же файл читают скрипты валидации,
// поэтому enum'ы не расходятся между UI, типами и CI.
// Литеральные union'ы ниже должны соответствовать taxonomy.json.

export type DomainLayer =
  | "Purpose"
  | "Domain"
  | "Structural"
  | "Behavioral"
  | "Runtime"
  | "Operational"
  | "Evolution"

export type Difficulty = "low" | "medium" | "high"

export const DOMAIN_LAYERS = taxonomy.domainLayers as DomainLayer[]
export const DIFFICULTIES = taxonomy.difficulties as Difficulty[]

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  low: "низкая",
  medium: "средняя",
  high: "высокая",
}

const DIFFICULTY_SHORT: Record<Difficulty, string> = {
  low: "Низк.",
  medium: "Сред.",
  high: "Выс.",
}

const DIFFICULTY_ESTIMATE: Record<Difficulty, string> = {
  low: "1–2 дня на внедрение",
  medium: "3–5 дней на внедрение",
  high: "1–2 недели на внедрение",
}

export function getDifficultyLabel(difficulty: Difficulty): string {
  return DIFFICULTY_LABEL[difficulty]
}

export function getDifficultyShort(difficulty: Difficulty): string {
  return DIFFICULTY_SHORT[difficulty]
}

export function getEstimatedTime(difficulty: Difficulty): string {
  return DIFFICULTY_ESTIMATE[difficulty]
}
