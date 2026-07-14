---
component: NavTile
title: "NavTile"
version: "v1.0"
updated: "14.07.2026"
page: pages/molecules/NavTile.html
css: styles/nav-tile.css
deps: [illustration, link, colors, radius, shadow, typography]
---

# NavTile — навигационная плитка

Плитка главной страницы платформы: слева название раздела и описание, справа иллюстрация 96×96 (вертикальный центр). Клик — переход на страницу раздела. Не дашборд: данных и графиков не показывает.

## Варианты
- **Базовая** — вся плитка одна ссылка: `<a class="ntile" href="…">`.
- **Со ссылками** (`.ntile--links`) — контейнер `<div>` (не ссылка: `<a>` в `<a>` недопустимо); на раздел ведёт название `.ntile__title-link`, ниже до 4 ссылок подразделов `.link--accent .link--s`, прижаты к низу (`margin-top:auto`). Hover-состояний у контейнера нет.

## Размер и сетка
Один размер. Ширина — 3 колонки из 12 (`.ntile-grid`, gap 24px, до 4 в ряд на полной ширине). Адаптив — `@container` от реальной ширины сетки (не окна): span 4/6/12 при ширине сетки ≤1100 / ≤700 / ≤450px. Мин. высота 140px, паддинг 24px (справа + место под иллюстрацию: pad + 96 + 16), радиус `--radius-card` (16px), высоты ряда выравниваются grid stretch.

## Состояния (базовая)
- Default: фон `--bg-tile`, рамка 1px `--border-light`
- Hover (`.is-hover`): рамка `--border-primary` + `--elevation-2`
- Focus (`.is-focus`): outline 2px `--primary`, offset 2px
- Disabled (`.is-disabled` / `aria-disabled="true"`): текст `--text-inactive`, иллюстрация grayscale + opacity .4, pointer-events none, без href

## Контент
Название — существительное 1–3 слова (H5 Strong); описание 1–2 строки Body S `--text-secondary`; ссылок ≤4 (обрезать на данных); иллюстрация из библиотеки Illustrations, `aria-hidden="true"`.

## DOM
```
<!-- базовая -->
<a class="ntile" href="/deals">
  <span class="illu ntile__illu" data-illu="deals" aria-hidden="true"></span>
  <h3 class="ntile__title">Сделки</h3>
  <p class="ntile__desc">Кредитные линии, договоры и график платежей</p>
</a>

<!-- со ссылками -->
<div class="ntile ntile--links">
  <span class="illu ntile__illu" data-illu="reports" aria-hidden="true"></span>
  <a class="ntile__title-link" href="/reports"><h3 class="ntile__title">Отчётность</h3></a>
  <p class="ntile__desc">Формы, выгрузки и регламентные отчёты</p>
  <nav class="ntile__links" aria-label="Подразделы">
    <a class="link link--accent link--s" href="/reports/reg">Регламентные</a>
    <a class="link link--accent link--s" href="/reports/export">Выгрузки</a>
  </nav>
</div>

<!-- сетка главной -->
<div class="ntile-grid"> …плитки… </div>
```

## Классы
| Класс | Назначение |
|---|---|
| .ntile | Корень (a — базовая, div — со ссылками) |
| .ntile--links | Вариант со ссылками |
| .ntile__illu | Слот иллюстрации 96×96, absolute справа, центр по вертикали (вместе с .illu) |
| .ntile__title / .ntile__desc | Название H5 Strong / описание Body S |
| .ntile__title-link | Ссылка-обёртка названия (только --links) |
| .ntile__links | Колонка ссылок, gap 10px, прижата к низу |
| .is-hover / .is-pressed / .is-focus / .is-disabled | Форс-состояния для документации; disabled — и для продакшена |
