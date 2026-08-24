---
component: Table
title: "Table"
version: "1.004"
updated: "21.08.2026"
page: pages/organisms/Table.html
runtime: scripts/ds-table.js
css: styles/table.css
deps: [table-cell, pagination, table-filter, button, button-group, icon-button, chip, checkbox, illustration, modal, context-menu]
status: curated
---

> Спека для быстрого контекста. Источник истины — CSS-файл и страница компонента. При изменении компонента обновляй эту спеку и блок в specs/_cheatsheet.md.

## Назначение
Контейнер-организм таблицы/реестра: Toolbar (заголовок + счётчик + фильтр/действия) + прокручиваемое тело с липкой шапкой + Footer (Pagination). Table не рисует содержимое строк — колонки и ячейки собираются из TableCell; постраничная навигация и панель массовых действий — из Pagination (`.pgn-bulk`, уже существует в `pagination.css`, ранее не документирована ни на одной странице).

## Инварианты
- Table добавляет только обёртку/Toolbar/липкую шапку/тени скролла/Loading-Empty — строки и ячейки строит TableCell, панель массовых действий и пагинация — Pagination.
- Состояния Disabled у таблицы нет — строку/ячейку недоступной не делают, только тонируют/скрывают отдельные действия.
- Тень липкой шапки появляется только когда тело реально проскроллено (`--scrolled`), не постоянно.
- Loading блокирует только тулбар-действия и инструменты шапки (resize/tools), не всю таблицу — строки показывают skeleton через TableCell.

## Диагностика
- «Тень под шапкой видна без скролла» → нужен класс `.dtable--scrolled`, навешиваемый по факту scrollTop>0
- «Таблица выглядит disabled целиком» → у Table такого состояния нет, приглушать нужно точечно (тулбар/инструменты)

## Ключевые правила (из разделов страницы)
- **Использование** — любой список записей, которому нужен скролл, липкая шапка, счётчик, фильтр или массовые действия. Короткий фиксированный список без прокрутки — Entity/ReadOnlyField, без веса Table. Table — сама себе контейнер (фон/рамка/радиус); внутри Tile — вариант `--headless`, чтобы не дублировать рамку.
- **Анатомия** — Toolbar (опц.) → тело (шапка sticky + строки TableCell) → Footer (опц., Pagination).
- **Варианты** — Toolbar включаемый; липкая шапка не отключаема (пока есть вертикальный скролл тела); массовые действия — часть Footer, требуют его включения; горизонтальный скролл + закрепление колонок — свойство TableCell, Table добавляет только тени по краям. Настройка колонок — кнопка-шестерёнка открывает Modal `--w4` со списком (видимость/порядок drag/закрепление); сохранённые фильтры — кнопка «Фильтр» становится Split Button с меню пресетов (см. TableFilter).
- **Размеры** — не применимо: своей шкалы нет, высота строки и паддинги ячеек — TableCell, высота ряда — Pagination. Table фиксирует только паддинги Toolbar (16/20px) и Footer (0/20px по бокам).
- **Размеры · Радиус скругления** — Радиус только у внешней обёртки. обёртка — 12px (--radius-xl) · строка и ячейка — 0.
- **Контент** — заголовок короткий + счётчик без подписи рядом; пустое состояние — иллюстрация `empty-folder` + заголовок 3–5 слов + одно пояснительное предложение + опц. действие, текст различается для «нет данных» и «ничего не найдено»; загрузка — скелетон-строки с тем же числом колонок, что у реальных данных.
- **Поведение · колонка действий** — если у таблицы есть выделенная колонка «Действие», её кнопки (IconButton neutral S) видны всегда, не по hover строки (в отличие от `.tc__hidden` у TableCell — там действия надстройка над контентом, здесь единственное содержимое ячейки). Если есть массовое удаление в `.pgn-bulk`, то же действие обязательно продублировано на уровне отдельной строки в колонке действий.
- **Поведение** — липкая шапка (`.th{position:sticky;top:0}`, тень-разделитель при `scrollTop>0`); тени горизонтального скролла по `scrollLeft`/`scrollWidth`; переход в режим массового действия по счётчику выбранных строк (`.pgn-bulk` показывается/скрывается, `.pgn-row` не пропадает); Loading/Empty подменяют только тело, Toolbar/Footer остаются; на узких экранах вторичные действия тулбара — в MenuButton.
- **Состояния** — Default / Loading / Empty. Disabled у контейнера нет (как у TableCell).
- **Доступность** — landmark не свой; заголовок — обычный уровень заголовка по контексту страницы, не `h1`; счётчик выбранных строк — `aria-live="polite"`; загрузка — `aria-busy="true"` на контейнере; иллюстрация пустого состояния — `aria-hidden="true"`.
- **Типографика** — заголовок тулбара `--type-h5-strong` (как Tile); счётчик/вспомогательный текст `--type-body-s`; заголовок пустого состояния `--type-body-m-strong`.
- **Цвета** — фон/рамка/радиус контейнера `--bg-tile`/`--border-light`/`--radius-xl`; тень липкой шапки `--border-primary`; тени скролла — `color-mix` от `--text-primary` (не литерал); строки/шапка — токены TableCell; ряд массового действия — токены Pagination.

## Для разработчиков (выжимка)

### Точные размеры (redline)
Измерено через getComputedStyle с реального экземпляра на странице: радиус контейнера `--radius-xl` (12px), паддинг тулбара 16px/20px, z-index липкой шапки 3, ширина тени края 24px.

### Разметка · HTML (эталонная реализация ДС)

```html
<div class="dtable">
  <div class="dtable__toolbar">
    <div class="dtable__toolbar-left"><h3 class="dtable__title">Заявки</h3><span class="dtable__count">128</span></div>
    <div class="dtable__toolbar-right">
      <div class="tfilter"><button class="btn btn--outline btn--s tfilter__open"><i data-icon="filter"></i><span class="btn__label">Фильтр</span></button></div>
      <button class="btn btn--accent btn--s"><i data-icon="add"></i><span class="btn__label">Добавить</span></button>
    </div>
  </div>
  <div class="dtable__body">
    <div class="tbl"><!-- .tbl__row/.th/.tc — см. TableCell --></div>
    <div class="dtable__edge dtable__edge--l" aria-hidden="true"></div>
    <div class="dtable__edge dtable__edge--r" aria-hidden="true"></div>
  </div>
  <div class="dtable__footer">
    <div class="pgn-row pgn-row--bulk"><div class="pgn-bulk">
      <span class="pgn-bulk__count" aria-live="polite">Выбрано: <b>6</b> из 128</span>
      <span class="pgn-bulk__actions"><button class="btn btn--outline btn--s">Экспорт</button><button class="btn btn--outline btn--error btn--s">Удалить</button></span>
    </div></div>
    <div class="pgn-row"><!-- см. Pagination --></div>
  </div>
</div>
<!-- Empty: .dtable__body содержит только .dtable__empty (иллюстрация + текст + действие) -->
<!-- Loading: .dtable__body содержит .tbl с N строками .tc--skeleton (плейсхолдер .sk-line--caption) -->
```

### Поведение · псевдокод (framework-agnostic)
- **Липкая шапка**: тело `overflow:auto`; шапка `position:sticky;top:0`, фон непрозрачный. `scrollTop>0` → тень-разделитель под шапкой (box-shadow, не border).
- **Тени скролла**: `scrollLeft>0` → тень слева; `scrollWidth-scrollLeft-clientWidth>0` → тень справа; пересчёт на `scroll` и `resize`/`ResizeObserver`.
- **Массовые действия**: считать выбранные строки; 0→N показывает `.pgn-bulk` над `.pgn-row` (не заменяя её); N→0 скрывает.
- **Loading/Empty**: подменяют только тело; Toolbar/Footer остаются доступны.

### Справочник классов и атрибутов

| Класс/атрибут | Назначение |
|---|---|
| `.dtable` | корень: фон/рамка/радиус контейнера |
| `.dtable__toolbar` / `-left` / `-right` | заголовок+счётчик слева, фильтр+действия справа |
| `.dtable__title` / `__count` | заголовок реестра / число записей |
| `.dtable__body` | скролл-контейнер тела (вертикаль+горизонталь) |
| `.dtable__edge--l` / `--r` | тени горизонтального скролла по краям |
| `.dtable--scrolled` | модификатор контейнера: тело реально проскроллено вниз |
| `.dtable--edge-l` / `--edge-r` | модификатор контейнера: есть скрытый контент слева/справа |
| `.dtable__footer` | обёртка Pagination-футера |
| `.dtable__empty` / `-title` / `-text` | пустое состояние тела |
| `aria-busy="true"` | состояние загрузки на `.dtable` |
| `.tbl` / `.tbl__row` / `.th` / `.tc` | строки и ячейки — см. TableCell |
| `.pgn-row` / `.pgn-bulk` | обычный ряд пагинации / ряд массового действия — см. Pagination |
