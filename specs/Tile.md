---
component: Tile
title: "Tile"
version: "v1.1"
updated: "13.07.2026"
page: pages/organisms/Tile.html
css: styles/tile.css
deps: [icon-button, button, link, chip, badge, alert, divider]
status: curated
---

> Спека для быстрого контекста. Источник истины — styles/tile.css и страница компонента. При изменении обновляй эту спеку и блок в specs/_cheatsheet.md.

## Назначение
Tile — основная плашка рабочей области страницы: группирует связанные поля и действия по объекту (сделка, продукт, инструмент, контрагент). Состоит из TileHeader (размер M) и контентной области; наполнение контента индивидуально под задачу и тип тайла. Родственники: TileHeadless (без хэдера) и Card (для модалок).

## Ключевые правила (из разделов страницы)
- **Использование** — плашка рабочей области. Общие правила построения; под каждую конкретную плашку заводится локальный компонент. Контент любой. Не использовать в модалках (там Card) и для отдельного объекта в списке (там Entity).
- **Анатомия** — TileHeader (Title + опц. Addition, Subtitle, Chiplist, Actions) + опц. полноширинный Alert + контентная область. Хэдер над контентом вплотную, без отступа.
- **Варианты** — обычный Tile; AccordionTile (полный/частичный коллапс); TileHeadless (без хэдера, отступы 24/24/32/24); Alert-слот.
- **Размеры** — ширина 3–12 колонок сетки контейнера; высота в строке фиксированная по плашке с макс. контентом (с учётом алертов), может меняться при смене состояния/наполнения.
- **Контент** — текст, дивайдеры, ReadOnly-инпуты, кнопки, ссылки, вложенные плашки-аккордеоны. Отступы 10/20/24/20; строки 16/24; колонки 16.
- **Поведение** — сворачивание аккордеона (шеврон, поворот 180°); выравнивание высоты в строке; усечение Title + Tooltip.
- **Состояния** — Tile собственных состояний НЕ имеет. Интерактивны только вложенные IconButton (хэдер), Button/Link (контент, алерт). AccordionTile collapsed/expanded — конфигурация, не состояние.
- **Доступность** — Title = семантический heading; иконка-предупреждение декоративна (aria-hidden); IconButton — aria-label; шеврон — aria-expanded + aria-controls; Alert — role по тону; reduced-motion отключает анимацию.
- **Типографика** — Title Tile: `--type-h5-strong`; Title Card: `--type-h6-strong`; Subtitle и метка поля: `--type-body-xs`; значение поля: `--type-body-m-strong`.
- **Цвета** — фон `--bg-tile`, бордер `--border-light`; текст `--text-primary`/`--text-secondary`/`--text-inactive`; Addition-иконка `--warning`, иконка сабтайтла `--success`, ссылка `--link`; Alert-слот `--warning-bg`/`--info-bg`.

## Для разработчиков (выжимка)

### Точные размеры (redline)
Рендерятся на странице через getComputedStyle. Радиус 8 (`--radius-m`), бордер 1px `--border-light`, паддинг хэдера 20 сверху / 20 по бокам, зазор Title↔Subtitle 8, паддинг контента 10/20/24/20 (headless 24/24/32/24), зазор строк 16 (или 24), колонок 16.

### Разметка · HTML (эталонная реализация ДС)

```
<section class="tile">
  <header class="tile__header">
    <div class="tile__header-main">
      <div class="tile__title-row"><h3 class="tile__title">Заголовок</h3><!-- Addition --></div>
      <p class="tile__subtitle"><span class="tile__subtitle-icon">…</span>Нерезидент</p>
      <div class="tile__chiplist">…Chip readonly S…</div>
    </div>
    <div class="tile__actions"><button class="ibtn ibtn--neutral ibtn--s" aria-label="…">…</button></div>
  </header>
  <div class="tile__alert"><div class="alert alert--warning alert--s" role="status">…</div></div>
  <div class="tile__body">…контент индивидуальный…</div>
</section>
<!-- headless: .tile.tile--headless > .tile__body (без хэдера) -->
<!-- accordion: .tile.tile--accordion; toggle .tile__toggle (aria-expanded) над .tile__collapsible; свёрнуто — .tile--collapsed -->
```

### Поведение · псевдокод (framework-agnostic)
```
onToggle():                       # AccordionTile
  collapsed = !collapsed
  tile.classList.toggle('tile--collapsed', collapsed)
  toggle.setAttribute('aria-expanded', String(!collapsed))
# Полный коллапс: весь контент в .tile__collapsible.
# Частичный: постоянная сводка вне .tile__collapsible.
# Высота строки: align по макс. тайлу; пересчёт при смене наполнения.
```

### Справочник классов и атрибутов

| Класс/атрибут | Назначение |
|---|---|
| `.tile` | корень: flex-колонка, фон `--bg-tile`, бордер 1px, радиус 8 |
| `.tile--headless` | без хэдера; отступы контента 24/24/32/24 |
| `.tile--accordion` | сворачиваемый тайл |
| `.tile--collapsed` | свёрнуто: `.tile__collapsible` скрыт (display:none) |
| `.tile__header` | TileHeader M: header-main + actions, padding 20 20 0 |
| `.tile__header-main` | колонка title-row · subtitle · chiplist, gap 8 |
| `.tile__title-row` | строка Title + Addition |
| `.tile__title` | заголовок, H5 Strong, усекается |
| `.tile__title-add` | Addition: link/icon/chip/badge; `--icon` = warning |
| `.tile__subtitle` | подзаголовок, Body XS, опц. `.tile__subtitle-icon` (success) |
| `.tile__chiplist` | ряд чипов-маркеров |
| `.tile__actions` | трейлинг: IconButton ×1–3 или Button |
| `.tile__toggle` / `.tile__chevron` | кнопка-шеврон аккордеона (aria-expanded) / поворот 180° |
| `.tile__alert` | полноширинный Alert-слот (углы прямые) |
| `.tile__body` | контентная область, padding 10/20/24/20 |
| `.tile__collapsible` | сворачиваемая часть контента |
| `.tile__grid` / `.tile__rows` | сетки контента: строки 16/24, колонки 16 |
