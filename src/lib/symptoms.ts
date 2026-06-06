export interface SymptomCategory {
  id: string
  title: string
  color: string
}

export interface Symptom {
  id: string
  category: string
  title: string
  goal: string
  outcome: string
  frameworks: string[]
}

export const symptomCategories: SymptomCategory[] = [
  { id: "undrsys", title: "Понимание системы", color: "#ffb162" },
  { id: "bound", title: "Границы и зависимости", color: "#a35139" },
  { id: "know", title: "Знания и их передача", color: "#1f5d5e" },
  { id: "complex", title: "Сложность и изменения", color: "#0378ad" },
]

export function getCategoryColor(categoryId: string): string {
  return symptomCategories.find((c) => c.id === categoryId)?.color ?? "#64748b"
}

export function resolveActiveSymptom(
  frameworkSlug: string,
  preferredSymptomId?: string | null,
  frameworkProblems?: string[]
): Symptom | undefined {
  if (preferredSymptomId) {
    const preferred = symptoms.find((s) => s.id === preferredSymptomId)
    if (preferred?.frameworks.includes(frameworkSlug)) return preferred
  }
  if (frameworkProblems?.length) {
    for (const problemId of frameworkProblems) {
      const match = symptoms.find((s) => s.id === problemId)
      if (match?.frameworks.includes(frameworkSlug)) return match
    }
  }
  return symptoms.find((s) => s.frameworks.includes(frameworkSlug))
}

export function getFrameworkStepInSymptom(
  symptomId: string,
  frameworkSlug: string
): { step: number; total: number } | null {
  const symptom = symptoms.find((s) => s.id === symptomId)
  if (!symptom) return null

  const idx = symptom.frameworks.indexOf(frameworkSlug)
  if (idx === -1) return null

  return { step: idx + 1, total: symptom.frameworks.length }
}

export function getAllSymptomChainEdges(): Array<{ source: string; target: string }> {
  const seen = new Set<string>()
  const edges: Array<{ source: string; target: string }> = []

  for (const symptom of symptoms) {
    for (let i = 0; i < symptom.frameworks.length - 1; i++) {
      const source = symptom.frameworks[i]
      const target = symptom.frameworks[i + 1]
      const key = `${source}->${target}`
      if (!seen.has(key)) {
        seen.add(key)
        edges.push({ source, target })
      }
    }
  }

  return edges
}

export function getChainNeighbors(
  symptomId: string,
  frameworkSlug: string
): { requires: string[]; leadsTo: string[] } {
  const symptom = symptoms.find((s) => s.id === symptomId)
  if (!symptom) return { requires: [], leadsTo: [] }

  const idx = symptom.frameworks.indexOf(frameworkSlug)
  if (idx === -1) return { requires: [], leadsTo: [] }

  return {
    requires: idx > 0 ? [symptom.frameworks[idx - 1]] : [],
    leadsTo: idx < symptom.frameworks.length - 1 ? [symptom.frameworks[idx + 1]] : [],
  }
}

export function getSymptomsByCategory(categoryId: string): Symptom[] {
  return symptoms.filter((s) => s.category === categoryId)
}

export const symptoms: Symptom[] = [
  // Понимание системы
  {
    id: "undrsys-001",
    category: "undrsys",
    title: "Не понимаем, что делает этот сервис",
    goal: "Понять ответственность сервиса, его границы и место в системе",
    outcome:
      "разработчик понимает — зачем существует сервис; где его границы; от чего он зависит; какие решения его сформировали",
    frameworks: ["system-context-mapping", "c4-model", "dependency-mapping", "adr"],
  },
  {
    id: "undrsys-002",
    category: "undrsys",
    title: "Каждый разработчик объясняет систему по-разному",
    goal: "Сформировать общее инженерное понимание системы",
    outcome:
      "команда начинает одинаково — описывать систему; понимать процессы; использовать термины; видеть границы ответственности",
    frameworks: ["event-storming", "ubiquitous-language", "bounded-context-mapping", "reference-architecture"],
  },
  {
    id: "undrsys-003",
    category: "undrsys",
    title: "Слишком сложно понять, как всё работает",
    goal: "Построить целостную карту системы",
    outcome:
      "появляется целостная инженерная карта системы — структура; потоки; зависимости; уровни абстракции",
    frameworks: ["zachman-framework", "c4-model", "runtime-flow-mapping", "dependency-mapping"],
  },
  {
    id: "undrsys-004",
    category: "undrsys",
    title: "Непонятно, как течёт информация",
    goal: "Понять lifecycle данных и событий",
    outcome:
      "разработчик понимает — как движутся данные; где меняется состояние; какие сервисы участвуют; где возникают side effects",
    frameworks: ["event-storming", "runtime-flow-mapping", "sequence-diagrams", "data-flow-mapping"],
  },
  {
    id: "undrsys-005",
    category: "undrsys",
    title: "Непонятно, где начинается и заканчивается ответственность сервиса",
    goal: "Определить границы системы и ответственности",
    outcome:
      "становится понятно — за что отвечает сервис; где проходят boundaries; что относится к domain logic; что является external concern",
    frameworks: ["ddd-bounded-contexts", "context-mapping", "hexagonal-architecture", "responsibility-mapping"],
  },
  {
    id: "undrsys-006",
    category: "undrsys",
    title: "Чтобы понять систему — нужно звать «того самого человека»",
    goal: "Сделать инженерное знание воспроизводимым",
    outcome:
      "понимание системы перестаёт жить только в головах отдельных людей",
    frameworks: ["adr", "reference-architecture", "system-context-mapping", "theory-graph"],
  },
  // Границы и зависимости
  {
    id: "bound-001",
    category: "bound",
    title: "Всё связано со всем",
    goal: "Уменьшить связность системы и понять реальные зависимости",
    outcome:
      "становится понятно — какие зависимости действительно нужны; где находятся точки высокой связности; какие части системы можно изолировать; где проходят естественные границы",
    frameworks: [
      "dependency-mapping",
      "c4-model",
      "ddd-bounded-contexts",
      "stable-dependencies-principle",
      "context-mapping",
    ],
  },
  {
    id: "bound-002",
    category: "bound",
    title: "Не знаем, где разделять систему",
    goal: "Найти естественные границы системы и ответственности",
    outcome:
      "появляется понимание — где проходят semantic boundaries; какие части системы должны жить отдельно; какие команды и домены связаны между собой; где находятся точки разделения системы",
    frameworks: [
      "ddd-bounded-contexts",
      "event-storming",
      "context-mapping",
      "reference-architecture",
      "conway-mapping",
    ],
  },
  {
    id: "bound-003",
    category: "bound",
    title: "Хотим выделить сервис из монолита",
    goal: "Безопасно выделить сервис и минимизировать coupling",
    outcome:
      "становится понятно — какой сервис можно выделить первым; какие зависимости мешают выделению; как проходит поток данных; как уменьшить риски миграции",
    frameworks: [
      "dependency-mapping",
      "runtime-flow-mapping",
      "ddd-bounded-contexts",
      "strangler-fig-pattern",
      "hexagonal-architecture",
    ],
  },
  {
    id: "bound-004",
    category: "bound",
    title: "Непонятно, что должно быть отдельным сервисом",
    goal: "Определить правильные границы сервисов",
    outcome:
      "появляется понимание — что является отдельным domain responsibility; где boundaries слишком широкие или слишком узкие; какие части системы имеют независимый lifecycle; какие сервисы должны быть самостоятельными",
    frameworks: [
      "ddd-bounded-contexts",
      "event-storming",
      "context-mapping",
      "system-quality-attributes",
      "team-topologies",
      "reference-architecture",
    ],
  },
  {
    id: "bound-005",
    category: "bound",
    title: "Сервисы слишком сильно зависят друг от друга",
    goal: "Снизить coupling между сервисами",
    outcome:
      "становится понятно — какие зависимости создают хрупкость; какие интеграции можно ослабить; где нарушены boundaries; как уменьшить связанность системы",
    frameworks: [
      "dependency-mapping",
      "hexagonal-architecture",
      "stable-dependencies-principle",
      "context-mapping",
      "ubiquitous-language",
      "anti-corruption-layer",
      "event-driven-architecture",
    ],
  },
  {
    id: "bound-006",
    category: "bound",
    title: "Архитектура перестала масштабироваться",
    goal: "Понять architectural bottlenecks и подготовить систему к развитию",
    outcome:
      "становится понятно — что ограничивает развитие системы; какие части архитектуры стали bottleneck; где система не соответствует структуре команды; как система должна эволюционировать дальше",
    frameworks: [
      "system-quality-attributes",
      "reference-architecture",
      "zachman-framework",
      "conway-mapping",
      "wardley-mapping",
      "evolutionary-architecture",
    ],
  },
  // Знания и их передача
  {
    id: "know-001",
    category: "know",
    title: "Новый разработчик долго погружается в проект",
    goal: "Сделать устройство системы понятным для нового разработчика",
    outcome:
      "новый разработчик начинает быстрее понимать — как устроена система; какие сервисы существуют; как течёт информация; где находятся ключевые части системы",
    frameworks: [
      "system-context-mapping",
      "c4-model",
      "reference-architecture",
      "runtime-flow-mapping",
      "theory-graph",
    ],
  },
  {
    id: "know-002",
    category: "know",
    title: "Никто не помнит, почему приняли это решение",
    goal: "Сохранить причины и контекст архитектурных решений",
    outcome:
      "становится понятно — почему принимались решения; какие ограничения влияли на архитектуру; какие trade-offs были выбраны; какие assumptions лежат в основе системы",
    frameworks: [
      "system-quality-attributes",
      "adr",
      "reference-architecture",
      "architecture-decision-mapping",
      "rfc-process",
      "theory-graph",
    ],
  },
  {
    id: "know-003",
    category: "know",
    title: "Знания живут в головах людей",
    goal: "Материализовать инженерное понимание системы",
    outcome:
      "инженерное знание становится — воспроизводимым; связанным между собой; доступным для команды; независимым от отдельных людей",
    frameworks: [
      "theory-graph",
      "adr",
      "reference-architecture",
      "system-context-mapping",
      "ubiquitous-language",
    ],
  },
  {
    id: "know-004",
    category: "know",
    title: "Ушёл разработчик — потеряли контекст",
    goal: "Сохранить контекст системы независимо от конкретных людей",
    outcome:
      "команда продолжает понимать — как устроена система; почему она устроена именно так; какие зависимости критичны; где находятся ключевые architectural decisions",
    frameworks: [
      "adr",
      "c4-model",
      "theory-graph",
      "runtime-flow-mapping",
      "dependency-mapping",
    ],
  },
  {
    id: "know-005",
    category: "know",
    title: "Архитектурные решения невозможно восстановить",
    goal: "Сделать архитектурную эволюцию системы прозрачной",
    outcome:
      "появляется возможность — восстановить ход архитектурных решений; понять evolution системы; увидеть причины изменений; объяснить текущее состояние архитектуры",
    frameworks: [
      "adr",
      "reference-architecture",
      "evolutionary-architecture",
      "architecture-decision-mapping",
      "zachman-framework",
    ],
  },
  {
    id: "know-006",
    category: "know",
    title: "Документация не объясняет «почему»",
    goal: "Документировать не только структуру системы, но и причины решений",
    outcome:
      "документация начинает объяснять — почему система устроена именно так; какие ограничения существуют; какие компромиссы были приняты; какие architectural principles использует команда",
    frameworks: [
      "adr",
      "rfc-process",
      "reference-architecture",
      "theory-graph",
      "context-mapping",
    ],
  },
  // Сложность и изменения
  {
    id: "complex-001",
    category: "complex",
    title: "Боимся менять код — непонятно что сломается",
    goal: "Сделать последствия изменений предсказуемыми",
    outcome:
      "становится понятно — какие части системы затронет изменение; какие зависимости являются критичными; где находятся risky flows; какие контракты нельзя нарушать",
    frameworks: [
      "dependency-mapping",
      "runtime-flow-mapping",
      "c4-model",
      "contract-testing",
      "adr",
    ],
  },
  {
    id: "complex-002",
    category: "complex",
    title: "Любое изменение тянет за собой ещё десять",
    goal: "Найти и уменьшить скрытую связанность системы",
    outcome:
      "появляется понимание — где находится excessive coupling; какие модули слишком зависят друг от друга; какие boundaries нарушены; как локализовать изменения",
    frameworks: [
      "dependency-mapping",
      "stable-dependencies-principle",
      "ddd-bounded-contexts",
      "hexagonal-architecture",
      "context-mapping",
    ],
  },
  {
    id: "complex-003",
    category: "complex",
    title: "Каждое изменение ломает что-то неожиданное",
    goal: "Выявить скрытые зависимости и side effects",
    outcome:
      "становится понятно — где возникают side effects; как изменения распространяются по системе; какие runtime flows наиболее хрупкие; где нарушена изоляция компонентов",
    frameworks: [
      "runtime-flow-mapping",
      "event-storming",
      "dependency-mapping",
      "sequence-diagrams",
      "event-driven-architecture",
    ],
  },
  {
    id: "complex-004",
    category: "complex",
    title: "Система слишком связана",
    goal: "Уменьшить coupling и усилить границы системы",
    outcome:
      "появляется понимание — какие зависимости создают хрупкость; где отсутствуют boundaries; какие части системы можно изолировать; как уменьшить связанность между компонентами",
    frameworks: [
      "ddd-bounded-contexts",
      "dependency-mapping",
      "hexagonal-architecture",
      "stable-dependencies-principle",
      "context-mapping",
      "ubiquitous-language",
      "anti-corruption-layer",
    ],
  },
  {
    id: "complex-005",
    category: "complex",
    title: "Код стал слишком сложным для изменений",
    goal: "Упростить структуру системы и локализовать сложность",
    outcome:
      "становится понятно — где сосредоточена сложность; какие модули перегружены ответственностью; как упростить структуру системы; как сделать изменения более локальными",
    frameworks: [
      "modular-monolith",
      "hexagonal-architecture",
      "c4-model",
      "refactoring-patterns",
      "ddd-bounded-contexts",
    ],
  },
  {
    id: "complex-006",
    category: "complex",
    title: "Legacy страшно трогать",
    goal: "Безопасно исследовать и постепенно изменять legacy-систему",
    outcome:
      "появляется возможность — безопасно исследовать legacy; понять критические зависимости; постепенно изменять систему; уменьшать риски при рефакторинге",
    frameworks: [
      "dependency-mapping",
      "runtime-flow-mapping",
      "strangler-fig-pattern",
      "characterization-testing",
      "event-storming",
    ],
  },
]
