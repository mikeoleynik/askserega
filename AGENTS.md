# AGENTS.md

Dev Theory Builder — каталог инженерных фреймворков для построения «теории проекта».

## Структура

```
content/frameworks/*.mdx   — контент фреймворков во frontmatter (intent, algorithm, …); тело пустое
content/symptoms.json      — боли: categories + symptoms (goal, outcome, frameworks[])
content/drafts/*.md        — черновики; НЕ в каталоге, НЕ в CI
src/lib/symptoms.ts        — типы + helper'ы над content/symptoms.json
src/lib/taxonomy.json      — единый enum domain_layer / difficulty (UI + типы + CI)
openspec/                  — спеки и design decisions
```

## Ключевое правило: связи фреймворков (Вариант A)

- **Единственный источник связей «фреймворк ↔ боль»** — `symptoms[].frameworks[]` (`content/symptoms.json`, helper'ы в `src/lib/symptoms.ts`). Это задаёт и порядок в цепочке, и членство.
- **MDX** — только контент; **без** `problems[]`, `requires`, `leadsTo`. Членство выводится из `symptoms.ts` через `getSymptomsForFramework(slug)`.
- **Соседи prev/next** — `getChainNeighbors(symptomId, slug)`; на UI сохранять `?symptom=`
- **Таксономия** (`domain_layer`, `difficulty`) — только в `src/lib/taxonomy.json`; не дублировать в компонентах/скриптах.

Полная спека: [framework-chains/spec.md](openspec/specs/framework-chains/spec.md)
