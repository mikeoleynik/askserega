# Contributing to Theory Dev

## Как добавить новый фреймворк

1. Создайте файл `content/frameworks/<your-framework>.mdx`
2. Используйте `content/frameworks/_template.mdx` как отправную точку
3. Заполните frontmatter (весь контент — здесь; тело файла оставьте пустым):

   - `title` — название фреймворка (обязательно)
   - `subtitle` — краткое описание в одну строку
   - `difficulty` — `low`, `medium` или `high`
   - `domain_layer` — одно из значений `src/lib/taxonomy.json`
     (`Purpose`, `Domain`, `Structural`, `Behavioral`, `Runtime`, `Operational`, `Evolution`)
   - `intent`, `prompt`, `theory_anchor` — контент карточки
   - `artifacts` — массив примеров артефактов
   - `algorithm`, `antipatterns` — массивы `{ title, description }`

4. Добавьте slug фреймворка в цепочку нужной боли в `content/symptoms.json`
5. Создайте Pull Request

## Порядок и связи фреймворков (Вариант A)

**Не прописывайте `problems` / `requires` / `leadsTo` в MDX** — они не используются.

| Что | Где | Зачем |
|-----|-----|-------|
| Порядок в пути боли | `symptoms[].frameworks[]` (`content/symptoms.json`) | «сначала X, потом Y» |
| Участие фреймворка в боли | выводится из `symptoms[].frameworks[]` | фильтрация, переключатель путей |
| Контент фреймворка | frontmatter MDX | карточка |

Членство в болях вычисляется автоматически через `getSymptomsForFramework(slug)`.
Подробная спека: `openspec/specs/framework-chains/spec.md`

### Пример: добавить C4 в новую боль

```json
// content/symptoms.json
{
  "id": "undrsys-003",
  "frameworks": ["zachman-framework", "c4-model", "runtime-flow-mapping", "dependency-mapping"]
}
```

Соседи C4 и членство вычисляются автоматически из позиции в `frameworks[]` каждой боли —
в MDX ничего дублировать не нужно.

## Локальный запуск

```bash
npm install
npm run dev
```

## Правила для контрибьюторов

- Все фреймворки хранятся в `content/frameworks/*.mdx` (только frontmatter)
- Frontmatter обязателен; `difficulty` и `domain_layer` — значения из `src/lib/taxonomy.json`
- Для новой боли — добавьте её в `content/symptoms.json`
- Slug из `symptoms[].frameworks[]` должен иметь соответствующий MDX-файл
- Черновики кладите в `content/drafts/` — они не входят в каталог и CI

## Проверка перед PR

```bash
npm run build
node scripts/validate-frontmatter.mjs
node scripts/check-symptoms-sync.mjs
```

CI проверяет:
- Валидность frontmatter (enum из `taxonomy.json`)
- Наличие `.mdx` для каждого slug в `symptoms[].frameworks[]`
