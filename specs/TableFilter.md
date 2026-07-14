---
component: TableFilter
title: "TableFilter"
version: "v1.2"
updated: "14.07.2026"
page: pages/organisms/TableFilter.html
page_js: scripts/table-filter.page.js
css: styles/table-filter.css
deps: [button, icon-button, chip, badge, modal, tab, input, checkbox, label-helper]
status: curated
---

> Спека для быстрого контекста. Источник истины — CSS-файл и страница компонента. При изменении компонента обновляй эту спеку и блок в specs/_cheatsheet.md.

## Назначение
TableFilter — панель фильтра над таблицей. Кнопка «Фильтр» открывает модалку с параметрами фильтрации; применённые параметры возвращаются в бар отдельными чипами (снять по одному крестиком или сбросить все). При переполнении ряда лишние чипы сворачиваются в счётчик «+N», бар разворачивается в несколько рядов по шеврону-аккордеону. Собирается из готовых компонентов ДС; собственный CSS — только раскладка бара.

## Ключевые правила (из разделов страницы)
- **Использование** — Фильтрация таблицы сразу по нескольким параметрам, когда условие нужно показывать и снимать по частям и сохранять наборами. Не для фильтра по одному полю (инлайн-поиск / Select в шапке колонки) и не для переключения вьюх (Tab / SegmentControl).
- **Анатомия** — Слева кластер-триггер: кнопка «Фильтр» (Button Outline XS с ведущей воронкой), а при активном фильтре — рядом отдельная кнопка сброса (Button Outline XS icon-only, иконка `filter-reset`). Справа чиплист применённых параметров (Chip Edit S), при переполнении — хвост: счётчик «+N» + шеврон-аккордеон (IconButton Neutral S).
- **Варианты · Кнопка фильтра** — Фильтр не применён → одиночная кнопка. Применён ≥1 параметр → рядом появляется вторая, самостоятельная кнопка сброса (Button Outline XS icon-only) — кнопки не сращены, у каждой полное скругление.
- **Варианты · Состояние бара** — Три состояния исходного компонента: Filtered=No (только кнопка), Filtered=Yes · 1 ряд (свёрнут, лишнее в «+N»), Filtered=Yes · N рядов (развёрнут).
- **Размеры** — Наследуются от вложенных компонентов: Button XS, IconButton S, Chip S, Badge XS — все высотой 24px. Высота бара = высоте ряда чипов. Зазор между чипами и между последним чипом и хвостом («+N» + шеврон) — 4px; триггер отделён от чиплиста дополнительным отступом (итого 8px).
- **Контент** — Чип = «Категория: значения через запятую» («Дески: RE, TMT, CND»); категория = метка поля в модалке. Один параметр — один чип. Переполнение чипа — многоточие по max-width 320px (Chip) + тултип. «+N» — целое число скрытых чипов без пробелов; только в свёрнутом состоянии при переполнении. Кнопка «Фильтр» — существительное без счётчика.
- **Поведение** — Клик по «Фильтр» открывает модалку (вертикальные табы-разделы + поля, подвал «Сохранить фильтр» / «Очистить» + «Применить»). По умолчанию бар свёрнут в один ряд: скрипт измеряет, сколько чипов помещается, прячет лишние, выносит «+N» и шеврон вниз; клик по шеврону разворачивает (перенос на N рядов, шеврон вверх). Крестик чипа снимает один параметр; сброс снимает все и возвращает одиночную кнопку. Пресеты (до 5) — отдельный таб модалки: применить / заменить (вложенный confirm при занятом имени) / удалить (вложенный confirm); пустой список — плейсхолдер.
- **Состояния** — Наследуются от Button/IconButton/Chip. Отдельно у бара: заблокированность (`.tfilter--disabled`, pointer-events:none + opacity).
- **Доступность** — Бар `role="group"` + `aria-label="Фильтр таблицы"`. Кнопка «Фильтр» — `aria-haspopup="dialog"` + `aria-expanded`. Шеврон — `aria-expanded` + `aria-controls` на чиплист. Чип фокусируем; крестик — «Убрать {категория}», Backspace/Delete снимает. «+N» дублируется текстом «ещё N параметров».
- **Типографика** — Собственной нет: подпись кнопки — токены Button (XS); текст чипа — SB Sans Text Body S (Chip S), letter-spacing 0; «+N» — Body S, tabular-nums, Text_Inactive.
- **Цвета** — Только семантические токены. Собственное — тонирование ведущей воронки кнопки в `--primary`; остальное из Button, IconButton, Chip. Чип-параметр — рампа StSystem (фон `--st-system-light`, обводка `--st-system-midlight`).

## Для разработчиков (выжимка)

### Точные размеры (redline)
Таблица рендерится на странице через getComputedStyle на живом баре. Значения — токены в `styles/table-filter.css`, `styles/chip.css`, `styles/button.css`: зазор бара, высота кнопки/чипа, паддинг/радиус/max-width чипа, типографика чипа и «+N».

### Разметка · HTML (эталонная реализация ДС)

```
<!-- фильтр не применён -->
<div class="tfilter" role="group" aria-label="Фильтр таблицы">
  <div class="tfilter__trigger" role="group" aria-label="Фильтр таблицы">
    <button class="btn btn--outline btn--xs" aria-haspopup="dialog" aria-expanded="false"><i data-icon="filter"></i><span class="btn__label">Фильтр</span></button>
  </div>
</div>

<!-- применён (две отдельные кнопки + чиплист + хвост), свёрнут -->
<div class="tfilter tfilter--collapsed" role="group" aria-label="Фильтр таблицы" data-expanded="false">
  <div class="tfilter__trigger" role="group" aria-label="Фильтр таблицы">
    <button class="btn btn--outline btn--xs tfilter__open" aria-haspopup="dialog" aria-expanded="false"><i data-icon="filter"></i><span class="btn__label">Фильтр</span></button>
    <button class="btn btn--outline btn--xs btn--icon-only tfilter__reset" aria-label="Сбросить фильтры"><i data-icon="filter-reset"></i></button>
  </div>
  <div class="tfilter__chips" role="group" aria-label="Применённые параметры">
    <span class="chip chip--edit chip--s" tabindex="0"><span class="chip__label">ТБ: ЦА, МБ, СРБ, СЗБ</span><span class="chip__remove" role="button" aria-label="Убрать ТБ">…✕…</span></span>
    …
  </div>
  <div class="tfilter__tail">
    <span class="badge badge--xs badge--neutral badge--text tfilter__more" aria-label="ещё 3 параметров">+3</span>
    <button class="ibtn ibtn--neutral ibtn--s tfilter__toggle" aria-label="Развернуть фильтр" aria-expanded="false"><span class="tfilter__chev"><i data-icon="chevron-down"></i></span></button>
  </div>
</div>
```

### Поведение · псевдокод (framework-agnostic)

```
// 1. Триггер: 0 параметров → одиночная кнопка; ≥1 → сплит-кнопка [Фильтр | сброс].

// 2. Применение (Применить в модалке): params=[{key,label,values[]}] →
//    чип «label: values.join(', ')» на каждый param; записать в состояние таблицы,
//    перезапросить данные, закрыть модалку.

// 3. Переполнение (свёрнуто — один ряд): доступную ширину считать от всего бара
//    (bar.clientWidth − ширина триггера − gap), а не от chipsEl (он схлопывается,
//    когда чипы скрыты); ширины чипов мерить, пока все видимы. Сколько влезает с
//    запасом под хвост (~78px) — показать, остальные скрыть, вынести «+N» + шеврон вниз.
//    Переизмерять в ResizeObserver контейнера.

// 4. Аккордеон: клик по шеврону → toggle data-expanded; collapsed = .tfilter--collapsed
//    (nowrap, overflow hidden), шеврон chevron-down; expanded = перенос, chevron-up.

// 5. Снятие: крестик чипа ИЛИ Backspace/Delete → убрать param, фокус на соседний,
//    пересчитать overflow; список пуст → вернуть одиночную кнопку.

// 6. Сброс всех: очистить params, свернуть, вернуть одиночную кнопку.

// 7. Пресеты (до 5): save(name) — занято → nested confirm «Заменить»; иначе push.
//    apply → см. п.2; remove → nested confirm «Удалить». Пусто → плейсхолдер.
```

### Справочник классов и атрибутов

| Класс/атрибут | Назначение |
|---|---|
| `.tfilter` | Корень-бар: flex, wrap, gap 4px (+ margin-right 4px на триггере); `role="group"` |
| `.tfilter--collapsed` | Свёрнутое состояние — чиплист в один ряд (nowrap, overflow hidden) |
| `.tfilter--disabled` | Бар недоступен целиком (pointer-events:none + opacity) |
| `data-expanded` | Флаг развёрнутости бара (true/false) |
| `.tfilter__trigger` | Кластер кнопки «Фильтр»; при активном фильтре внутри — вторая, самостоятельная кнопка сброса (не сращены) |
| `.tfilter__open` | Кнопка вызова модалки (`aria-haspopup="dialog"`, `aria-expanded`) |
| `.tfilter__reset` | Сброс всех параметров — icon-only, иконка `filter-reset` |
| `.tfilter__chips` | Чиплист применённых параметров (Chip Edit S) |
| `.tfilter__tail` | Хвост: Badge «+N» + IconButton-шеврон |
| `.tfilter__more` | Badge · Text · XS «+N» скрытых чипов (tabular-nums, Text_Inactive) |
| `.tfilter__toggle` / `.tfilter__chev` | Шеврон-аккордеон (`aria-expanded`, `aria-controls`) |
