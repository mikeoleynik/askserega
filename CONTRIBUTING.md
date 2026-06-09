# Contributing to Theory Dev

## Как добавить новый фреймворк

1. Создайте файл `content/frameworks/<your-framework>.mdx`
2. Используйте `content/frameworks/_template.mdx` как отправную точку
3. Заполните frontmatter:

   - `title` — название фреймворка (обязательно)
   - `subtitle` — краткое описание в одну строку
   - `difficulty` — `low`, `medium` или `high`
   - `domain_layer` — `Purpose`, `Domain`, `Structural`, `Runtime`, `Operational`, `Evolution`
   - `problems` — массив ID болей, в которых участвует фреймворк (без порядка)
   - `intent`, `prompt`, `theory_anchor`, `artifact_desc` — контент карточки

4. Добавьте slug фреймворка в цепочку нужной боли в `src/lib/symptoms.ts`
5. Напишите контент в MDX (Algorithm, Anti-patterns)
6. Создайте Pull Request

## Порядок и связи фреймворков (Вариант A)

**Не прописывайте `requires` / `leadsTo` в MDX** — они не используются.

| Что | Где | Зачем |
|-----|-----|-------|
| Порядок в пути боли | `symptoms[].frameworks[]` | «сначала X, потом Y» |
| Участие фреймворка в боли | MDX `problems[]` | фильтрация, переключатель путей |
| Контент фреймворка | MDX body + intent/prompt/… | карточка |

Подробная спека: `openspec/specs/framework-chains/spec.md`

### Пример: добавить C4 в новую боль

```typescript
// src/lib/symptoms.ts
{
  id: "undrsys-003",
  frameworks: ["zachman-framework", "c4-model", "runtime-flow-mapping", "dependency-mapping"],
}
```

```yaml
# content/frameworks/c4-model.mdx
problems:
  - undrsys-001
  - undrsys-003
```

Соседи C4 вычисляются автоматически из позиции в `frameworks[]` каждой боли.

## Локальный запуск

```bash
npm install
npm run dev
```

## Правила для контрибьюторов

- Все фреймворки хранятся в `content/frameworks/*.mdx`
- Frontmatter обязателен для всех файлов
- `difficulty` может быть только `low`, `medium` или `high`
- Для новой боли — добавьте её в `src/lib/symptoms.ts`
- Slug из `symptoms[].frameworks[]` должен иметь соответствующий MDX-файл
- Каждый `problems[]` в MDX должен содержать slug в `symptoms[].frameworks` этой боли

## Проверка перед PR

```bash
npm run build
node scripts/validate-frontmatter.mjs
node scripts/check-symptoms-sync.mjs
```

CI проверяет:
- Валидность frontmatter
- Двустороннюю согласованность `symptoms.ts` ↔ MDX `problems[]`
- Наличие `.mdx` для каждого slug в `symptoms[].frameworks[]`

Файлы `content/frameworks/*.md` — черновики, не входят в каталог и CI.
