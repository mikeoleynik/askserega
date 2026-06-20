# Открытые вопросы (help wanted)

Задачи, где нужно **продуктовое или контентное решение** — не баги в коде, а вопросы к дизайну данных и UX.
Подключайтесь через Issue или PR; перед правкой `content/symptoms.json` согласуйте подход.

---

## CHN-007 — Встречные смежные пары в цепочках болей

**Статус:** открыт · **Метки:** `help wanted`, `content`, `discussion`
**Тест:** `src/lib/symptoms.test.ts` (CHN-007), снимок: `src/lib/__snapshots__/symptoms.test.ts.snap`

### Суть

В `content/symptoms.json` разные боли задают **противоположный порядок** для одной и той же пары соседних фреймворков.

Пример:

| Боль | Фрагмент цепочки |
|------|------------------|
| `undrsys-001` | `c4-model` → `dependency-mapping` |
| `bound-001` | `dependency-mapping` → `c4-model` |

В каталоге и на detail это корректно: контекст задаёт `?symptom=`.
На **theory-map** (`getAllSymptomChainEdges`) оба направления могут попасть в граф как разные рёбра.

### Зафиксированные пары (на 2026-06-11)

1. `c4-model` ↔ `dependency-mapping`
2. `context-mapping` ↔ `hexagonal-architecture`
3. `ddd-bounded-contexts` ↔ `stable-dependencies-principle`
4. `event-storming` ↔ `runtime-flow-mapping`
5. `runtime-flow-mapping` ↔ `dependency-mapping`
6. `runtime-flow-mapping` ↔ `theory-graph`
7. `uml-basics` ↔ `runtime-flow-mapping`

### Варианты решения

1. **Оставить как есть** — разный порядок в разных болях осознан; обновить спеку и закрыть вопрос.
2. **Править контент** — выровнять порядок в `symptoms.json` там, где противоречие не задумано; обновить snapshot теста.
3. **Править theory-map** — не рисовать встречные рёбра или помечать их как «зависит от боли».

### Критерии готовности (PR)

- [ ] Решение описано в `openspec/specs/framework-chains/spec.md`
- [ ] При изменении данных — обновлён `src/lib/__snapshots__/symptoms.test.ts.snap` (`npm test`)
- [ ] При изменении UI theory-map — тесты/ручная проверка графа

---

## CHN-008 — Справочный фреймворк без боли (orphan)

**Статус:** открыт · **Метки:** `help wanted`, `documentation`
**Тест:** `src/lib/symptoms.test.ts`, `src/components/FrameworkCard.chains.test.tsx` (фикстура `orphan-fixture`)

### Суть

Ветка UI для фреймворка **без** записи в `symptoms[].frameworks[]` (футер «Справочный», скрытие блока «Боль» и ChainMap) покрыта только фикстурой в тестах. В реальных данных все 34 фреймворка привязаны к болям.

### Что нужно

- Решить, допускаются ли «справочные» карточки в каталоге.
- Если да — описать в спеке и, опционально, добавить пример в контент или оставить только контракт в тестах.

---

## Как предложить решение

1. Откройте Issue с ссылкой на id (например `CHN-007`) или сразу PR.
2. В PR укажите выбранный вариант и обновите спеку + тесты.
3. Для правок цепочек — прогоните `npm test`, `node scripts/check-symptoms-sync.mjs`.
