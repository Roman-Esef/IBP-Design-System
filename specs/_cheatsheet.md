---
purpose: Чит-шит по всем компонентам для сборки экранов. Читай ЭТОТ файл вместо набора спек; спеку specs/<Имя>.md — только для компонента со сложным поведением.
---

# IBP DS — чит-шит компонентов

Подключение на экране: один `<link rel="stylesheet" href="ds.css">` (всё включено). Иконки: `<i data-icon="имя"></i>` + `icons-data.js` + `ds-icons.js` в конце body (имена — specs/Icons.md). Токены: цвета — specs/Colors.md, типографика — specs/Typography.md, радиусы — specs/Radius.md, тени — specs/Elevation.md. Начинай экран с копии `_template/Screen.html`.

## Avatar
css: `styles/avatar.css` · deps: [badge]

Аватар — компактное визуальное представление пользователя или сущности.

```html
<span class="av av--circular av--l">
  <span class="av__text">ИБ</span>
</span>
<span class="av-stack" aria-label="Мария А., в сети">
  <span class="av av--circular av--xl" aria-hidden="true">…</span>
  <span class="badge badge--dot badge--success badge--bordered" aria-hidden="true"></span>
</span>
<span class="av-group av-group--m" role="group" aria-label="Участники: ИБ, ВБ, МА, КГ и ещё 3">
  <span class="av av--circular av--m" aria-hidden="true">…</span>
  <span class="av-group__more" aria-hidden="true">+3</span>
</span>
<button type="button" class="av av--circular av--l av--button" aria-label="Открыть профиль Игоря Белова">…</button>
```

## Badge
css: `styles/badge.css`

Бейдж — небольшой дочерний элемент, который накладывается на родительский компонент или ставится рядом с ним.

```html
<span class="badge-anchor" aria-label="Уведомления, 7">
  <span class="navcell"><svg aria-hidden="true">…</svg></span>
  <span class="badge badge--xs badge--accent badge--bordered" aria-hidden="true">7</span>
</span>
<span class="badge-anchor" aria-label="Иван Белов, онлайн">
  <span class="avatar">ИБ</span>
  <span class="badge badge--dot badge--success badge--bordered" aria-hidden="true"></span>
</span>
<span class="badge badge--m badge--neutral badge--text">+99</span>
```

## Breadcrumbs
css: `styles/breadcrumbs.css` · deps: [link, context-menu, tooltip]

Хлебные крошки — трейл ссылок в шапке страницы, показывающий путь до текущего раздела.

```html
<nav class="crumbs" aria-label="Хлебные крошки">
  <li class="crumbs__item"><a class="link link--muted" href="/">Главная</a></li>
  <li class="crumbs__item"><a class="link link--muted" href="/deals">Сделки</a></li>
  <li class="crumbs__item crumbs__item--current">
    <span class="crumbs__current" aria-current="page">Договор №4521</span>
  </li>
</nav>
<nav class="crumbs" aria-label="Хлебные крошки">
  <li class="crumbs__item"><a class="link link--muted" href="/">Главная</a></li>
  <li class="crumbs__item">
    <button class="crumbs__more" aria-haspopup="true" aria-expanded="false">…</button>
  </li>
  <li class="crumbs__item crumbs__item--current">
    <span class="crumbs__current" aria-current="page" title="Полное название страницы">Полное название страницы</span>
  </li>
</nav>
```

## ButtonGroup
css: `styles/button-group.css` · deps: [button]

Объединяет связанные кнопки в единый визуальный блок с общим фоном или обводкой.

```html
<div class="btn-group btn-group--accent" role="group" aria-label="Режим отображения">
  <button class="btn btn--accent btn--m">Список</button>
  <button class="btn btn--accent btn--m">Плитка</button>
</div>
<div class="btn-group btn-group--accent btn-group--split" role="group">
  <button class="btn btn--accent btn--m">Сохранить</button>
  <button class="btn btn--accent btn--m btn--icon-only" aria-haspopup="menu" aria-expanded="false">…</button>
  <div class="dropdown__menu" role="menu" hidden>…</div>
</div>
<div class="btn-group btn-group--outline btn-group--toggle" role="group" aria-label="Форматирование">
  <button class="btn btn--outline btn--m" aria-pressed="true">…</button>
  <button class="btn btn--outline btn--m" aria-pressed="false">…</button>
</div>
<div class="btn-group btn-group--outline btn-group--vertical btn-group--disabled" role="group" aria-disabled="true">…</div>
```

## Buttons
css: `styles/button.css`

Кнопка инициирует действие.

```html
<button type="button" class="btn btn--accent btn--m">
  <svg aria-hidden="true">…</svg>                <!-- иконка слева, 20/18/16 px -->
  <span class="btn__label">Применить</span>
</button>
<button type="button" class="btn btn--outline btn--m" aria-haspopup="menu" aria-expanded="false">
  <span class="btn__label">Действия</span>
  <svg class="btn__chevron" aria-hidden="true">…</svg>
</button>
<button type="button" class="btn btn--outline btn--s btn--icon-only" aria-label="Скачать">
  <svg aria-hidden="true">…</svg>
</button>
<button type="button" class="btn btn--accent btn--m btn--loading" disabled aria-busy="true">
  <span class="btn__spinner"></span>
  <span class="btn__label">Применить</span>
</button>
<!-- Danger — модификатор поверх любого типа, для диалогов подтверждения удаления -->
<button type="button" class="btn btn--accent btn--m btn--danger"><span class="btn__label">Удалить</span></button>
```

## Checkbox
css: `styles/checkbox.css` · deps: [label-helper]

Чекбокс используется, когда доступен список опций и пользователю нужно выбрать одну или несколько из них.

```html
<label class="cb cb--selected">
  <input type="checkbox" class="cb__input" checked>
  <span class="cb__box"><span class="cb__mark"><svg aria-hidden="true">…</svg></span></span>
  <span class="cb__content">
    <span class="cb__label">Получать уведомления</span>
    <span class="ds-helper ds-helper--left">Не чаще раза в день</span>
  </span>
</label>
<label class="cb cb--indeterminate">…</label>
<label class="cb cb--unselected cb--error">
  <input type="checkbox" class="cb__input" required aria-invalid="true">
  <span class="cb__box"><span class="cb__mark"></span></span>
  <span class="cb__content"><span class="cb__label">Я принимаю условия<span class="cb__req">*</span></span></span>
</label>
<div class="cb-group" role="group" aria-labelledby="grp-t">
  <p class="cb-group__title" id="grp-t">Выберите каналы</p>
<!-- … полная анатомия: specs/Checkbox.md -->
```

## Chip
css: `styles/chip.css` · deps: [label-helper]

Чип — компактный интерактивный элемент для фильтрации и группировки данных.

```html
<span class="chip chip--edit chip--m chip--rounded" tabindex="0">
  <span class="chip__marker"><svg aria-hidden="true">…</svg></span>
  <span class="chip__label">Активна</span>
  <span class="chip__remove" role="button" aria-label="Удалить Активна"><svg aria-hidden="true">…</svg></span>
</span>
<span class="chip chip--readonly chip--m"><span class="chip__label">Договор</span></span>
<div class="chiplist" role="group" aria-label="Фильтры">…</div>
```

## ContextMenu
css: `styles/context-menu.css` · deps: [button]

Контекстное меню — всплывающий список действий над объектом.

```html
<button type="button" class="kebab" aria-label="Действия"
        aria-haspopup="menu" aria-expanded="true">⋮</button>
<div class="menu menu--floating" role="menu">
  <div class="menu__label">Действия</div>
  <button type="button" class="menu__item" role="menuitem">
    <span class="menu__item-icon"><svg…></svg></span>
    <span class="menu__item-label">Изменить</span>
    <span class="menu__item-hint">⌘C</span>
  </button>
  <button class="menu__item" role="menuitemradio" aria-checked="true">…</button>
  <hr class="menu__divider">
  <button class="menu__item menu__item--danger" role="menuitem">Удалить</button>
  <button class="menu__item" role="menuitem" aria-disabled="true">Архив</button>
</div>
```

## Divider
css: `styles/divider.css` · deps: [button]

Разделительная черта — тонкая линия, которая визуально отделяет одни части интерфейса от других.

```html
<hr class="dvd dvd--h">
<hr class="dvd dvd--h dvd--inset">   <!-- Inset -->
<hr class="dvd dvd--h dvd--middle">  <!-- Middle -->
<hr class="dvd dvd--h dvd--section"> <!-- блок-секция 8px -->
<div class="dvd dvd--v" role="separator" aria-orientation="vertical"></div>
<div class="dvd-text dvd-text--center" role="separator">
  <span class="dvd-text__label">или</span>
</div>
<hr class="dvd dvd--h" aria-hidden="true">
```

## IconButton
css: `styles/icon-button.css` · deps: [badge]

Безрамочная кнопка с одной иконкой и круглым стейт-слоем (риплом).

```html
<button type="button" class="ibtn ibtn--neutral ibtn--m" aria-label="Редактировать">
  <svg aria-hidden="true">…</svg>          <!-- 24/20/16 px по размеру кнопки -->
</button>
<button type="button" class="ibtn ibtn--primary ibtn--l ibtn--selected" aria-pressed="true" aria-label="В избранном">
  <svg aria-hidden="true">…</svg>
</button>
<button type="button" class="ibtn ibtn--neutral ibtn--m ibtn--loading" aria-busy="true" aria-label="Ещё">
  <span class="ibtn__spinner"></span>
</button>
<button type="button" class="ibtn ibtn--neutral ibtn--l" aria-label="Сделки">
  <svg aria-hidden="true">…</svg>
  <span class="ibtn__badge"><span class="badge badge--xs badge--accent">3</span></span>
</button>
```

## InputAutocomplete
css: `—`

Поле ввода с автодополнением: подсказывает варианты из списка по мере набора.

## LabelHelper
css: `styles/label-helper.css` · deps: [checkbox, radio, switch]

Общие вспомогательные текстовые слоты, вынесенные из нескольких родительских компонентов в отдельную группу.

```html
<label class="ds-label ds-label--left" for="field-inn">
  <span class="ds-label__text">ИНН контрагента</span>
</label>
<input id="field-inn" aria-describedby="field-inn-helper" aria-invalid="true" />
<span id="field-inn-helper" class="ds-helper ds-helper--left ds-helper--error ds-helper--with-icon" role="alert">
  <span class="ds-helper__icon" aria-hidden="true"><svg>…</svg></span>
  <span class="ds-helper__text">Нужно 10 или 12 цифр</span>
</span>
```

## Link
css: `styles/link.css` · deps: [breadcrumbs]

Текстовая ссылка для навигации внутри лайаута и модальных окон, а также в Хлебных крошках.

```html
<a class="link link--accent link--m" href="/deals/4521">Открыть договор</a>
… подробнее в <a class="link link--accent link--inline" href="/help">справке</a> …
<a class="link link--accent link--m link--with-icon" href="/report.pdf">
  <span class="link__icon"><svg aria-hidden="true">…</svg></span>
  <span class="link__text">Скачать PDF</span>
</a>
<a class="link link--accent link--m link--with-icon" href="https://…"
   target="_blank" rel="noopener" aria-label="Открыть в реестре (открывается в новой вкладке)">
  <span class="link__text">Открыть в реестре</span>
  <span class="link__icon"><svg aria-hidden="true">…</svg></span>
</a>
<nav class="crumbs" aria-label="Хлебные крошки">
  <li class="crumbs__item"><a class="link link--muted" href="/">Главная</a></li>
  <li class="crumbs__item crumbs__item--current">
    <span class="crumbs__current" aria-current="page">Договор №4521</span>
  </li>
<!-- … полная анатомия: specs/Link.md -->
```

## Modal
css: `styles/modal.css` · deps: [button, icon-button, label-helper, checkbox]

Не компонент в привычном смысле — свод правил построения модальных форм. Обязательны шапка (Modal_Top: заголовок + крестик) и подвал (Modal_Bottom: опционально слева, обязательно Primary справа); между ними Modal_Body — произвольный прокручиваемый контент. 12 шагов ширины (--modal-w-1…12, 140–1820px). Закрытие: крестик/Esc/скрим — кроме guarded-форм с несохранённым вводом (скрим игнорируется). Диалог подтверждения удаления — вложенный `.modal-scrim--nested` с Primary в тоне `.btn--danger`.

```html
<div class="modal-scrim">
  <div class="modal modal--w6" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <header class="modal__head">
      <h2 class="modal__title" id="modal-title">Новая сделка</h2>
      <button type="button" class="ibtn ibtn--neutral ibtn--m" aria-label="Закрыть"><svg aria-hidden="true">…</svg></button>
    </header>
    <div class="modal__body">…любой контент — форма, таблица, пустое состояние…</div>
    <footer class="modal__foot">
      <div class="modal__foot-left">
        <button class="btn btn--transparent btn--s"><svg aria-hidden="true">…</svg><span class="btn__label">Изменить</span></button>
      </div>
      <div class="modal__foot-right">
        <button class="btn btn--transparent btn--m"><span class="btn__label">Очистить фильтр</span></button>
        <button class="btn btn--accent btn--m"><span class="btn__label">Сохранить</span></button>
      </div>
    </footer>
  </div>
</div>
<!-- диалог подтверждения — вложенный поверх открытой модалки -->
<div class="modal-scrim modal-scrim--nested">
  <div class="modal modal--w3" role="alertdialog" aria-modal="true">
    …заголовок + сообщение + <button class="btn btn--accent btn--m btn--danger"><span class="btn__label">Удалить</span></button>
  </div>
</div>
<!-- … полная анатомия: specs/Modal.md -->
```

## Pagination
css: `styles/pagination.css` · deps: [dropdown-list, checkbox, label-helper, button, splitter]

Нижняя строка многостраничной таблицы: переключение страниц, выбор количества строк на странице и счётчик диапазона.

```html
<div class="pgn-row">
  <div class="pgn-row__left">
    <div class="pgn-info">…</div>
  </div>
  <div class="pgn-row__right">
    <div class="pgn">
      <button class="pgn__pagesize" aria-haspopup="listbox">Показывать строк: <b>50</b></button>
      <span class="pgn__range">3 из 16</span>
      <nav class="pgn__nav" aria-label="Страницы">
        <button class="pgn__arrow" aria-label="Предыдущая страница">‹</button>
        <button class="pgn__num">1</button>
        <button class="pgn__num" aria-current="page">3</button>
        <span class="pgn__ellipsis" aria-hidden="true">…</span>
        <button class="pgn__num">16</button>
        <button class="pgn__arrow" aria-label="Следующая страница">›</button>
      </nav>
<!-- … полная анатомия: specs/Pagination.md -->
```

## Popover
css: `styles/popover.css` · deps: [button, icon-button, link, chip, label-helper]

Нон-модальный всплывающий контейнер, привязанный к триггеру: расширенный контекстный контент (текст, интерактив, формы, легенды). В отличие от Tooltip — открывается по клику; в отличие от Modal — не блокирует страницу. Header — только заголовок+✕ (без кнопок действий), Footer — foot-left служебное/инфо + foot-right Secondary+Primary. 5 ширин (240–560px), 12 позиций размещения, опциональная стрелка (по умолчанию выключена).

```html
<span class="pop-anchor">
  <button type="button" aria-haspopup="dialog" aria-expanded="true" aria-controls="pop-1">…</button>
  <div id="pop-1" class="pop pop--w-m pop--bottom pop--start pop--floating" role="dialog" aria-modal="false" aria-labelledby="pop-1-title">
    <div class="pop__head">
      <h3 class="pop__title" id="pop-1-title">Изменить тег</h3>
      <button type="button" class="ibtn ibtn--neutral ibtn--s" aria-label="Закрыть">…</button>
    </div>
    <div class="pop__body">…форма, легенда, карточка, таблица…</div>
    <div class="pop__foot">
      <div class="pop__foot-left"></div>
      <div class="pop__foot-right">
        <button class="btn btn--transparent btn--s">Отмена</button>
        <button class="btn btn--accent btn--s">Применить</button>
      </div>
    </div>
    <span class="pop__arrow"></span>
  </div>
</span>
<!-- … полная анатомия: specs/Popover.md -->
```

## ProgressBar
css: `styles/progress-bar.css` · deps: [label-helper]

Линейный индикатор прогресса: заливка трека = доля значения от максимума. Определённый / неопределённый (Indeterminate) режимы, шесть тонов, три размера.

```html
<div class="pbar pbar--m pbar--accent" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" aria-label="Label">
  <div class="pbar__head">
    <span class="pbar__label">Label</span>
    <span class="pbar__value">50/100</span>
  </div>
  <div class="pbar__track"><div class="pbar__fill" style="width:50%"></div></div>
  <span class="ds-helper ds-helper--left pbar__helper">Helper</span>
</div>
<!-- плавающее значение: метка следует за краем заливки -->
<div class="pbar pbar--m pbar--system pbar--floating" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100" aria-label="Вероятность сделки">
  <div class="pbar__track"><div class="pbar__fill" style="width:85%"><span class="pbar__marker">85%</span></div></div>
  <span class="ds-helper ds-helper--left pbar__helper">Вероятность сделки</span>
</div>
<!-- неопределённый: aria-valuenow не указывается -->
<div class="pbar pbar--m pbar--accent pbar--indeterminate" role="progressbar" aria-valuetext="Загрузка">
  <div class="pbar__track"><div class="pbar__fill"></div></div>
</div>
<!-- … полная анатомия: specs/ProgressBar.md -->
```

## Radiobutton
css: `styles/radio.css` · deps: [label-helper]

Радиокнопка позволяет выбрать всего один пункт из списка взаимоисключающих вариантов.

```html
<div class="rb-group" role="radiogroup" aria-labelledby="grp-t">
  <p class="rb-group__title" id="grp-t">Обновлять список</p>
  <div class="rb-group__items">
    <label class="rb rb--selected">
      <input type="radio" class="rb__input" name="refresh" checked>
      <span class="rb__box"><span class="rb__mark"></span></span>
      <span class="rb__content"><span class="rb__label">Ежеминутно</span></span>
    </label>
    <label class="rb rb--unselected">
      <input type="radio" class="rb__input" name="refresh">
      <span class="rb__box"><span class="rb__mark"></span></span>
      <span class="rb__content"><span class="rb__label">Ежечасно</span></span>
    </label>
  </div>
</div>
<div class="rb-group" role="radiogroup" aria-labelledby="grp-t2" aria-describedby="grp-e2">
<!-- … полная анатомия: specs/Radiobutton.md -->
```

## ReadOnlyField
css: `styles/read-only-field.css` · deps: [label-helper, chip, link, tooltip, segment-control, splitter]

Поле для отображения данных без возможности редактирования.

```html
<div class="rof">
  <span class="ds-label"><span class="ds-label__text">ID во внешней АС</span></span>
  <div class="rof__row">
    <span class="rof__icon"><svg aria-hidden="true">…</svg></span>
    <span class="rof__value">123456789012</span>
    <span class="rof__icon rof__icon--interactive" role="button" tabindex="0" aria-label="Скопировать значение"><svg aria-hidden="true">…</svg></span>
  </div>
</div>
<div class="rof">
  <span class="ds-label"><span class="ds-label__text">Регионы присутствия</span></span>
  <div class="rof__row"><div class="rof__value rof__value--chips"><div class="chiplist chiplist--s">…</div></div></div>
</div>
```

## SegmentControl
css: `styles/segment-control.css` · deps: [tab, button, button-group, badge]

Компактный контрол для переключения одного значения параметра — периода, единиц, режима отображения — из 2–6 взаимоисключающих опций.

```html
<div class="segctrl segctrl--m" role="radiogroup" aria-label="Период">
  <div class="segctrl__thumb"></div>
  <button type="button" class="segctrl__item" role="radio" aria-checked="false" tabindex="-1">
    <span class="segctrl__label">Неделя</span>
  </button>
  <button type="button" class="segctrl__item" role="radio" aria-checked="true" tabindex="0">
    <span class="segctrl__label">Месяц</span>
    <span class="badge badge--text badge--s">12</span>
  </button>
  <button type="button" class="segctrl__item" role="radio" aria-checked="false" tabindex="-1">
    <span class="segctrl__label">Год</span>
  </button>
</div>
```

## Select
css: `—` · deps: [checkbox, label-helper, dropdown-list]

Выпадающий список — всплывающая поверхность со списком опций, которая раскрывается под полем Select или InputAutocomplete.

```html
<div role="combobox" aria-expanded="true" aria-controls="ccy">…</div>
<div id="ccy" class="ddl ddl--floating ddl--scroll" role="listbox">
  <div class="ddl__group">Популярные</div>
  <button class="ddl__item" role="option" aria-selected="true">
    <span class="ddl__item-body">
      <span class="ddl__item-label">Доллар <span class="ddl__match">США</span></span>
      <span class="ds-helper">USD · 840</span>
    </span>
  </button>
  <button class="ddl__item ddl__item--checkbox" role="option" aria-checked="true">
    <span class="ddl__item-check"><span class="cb__box"><span class="cb__mark">…</span></span></span>
    <span class="ddl__item-body">…</span>
  </button>
  <button class="ddl__item" role="option" aria-disabled="true">Евро</button>
  <div class="ddl__state ddl__state--empty">…Ничего не найдено</div>
</div>
```

## Splitter
css: `styles/splitter.css` · deps: [button]

Функциональный разделитель контейнера: пользователь тащит сплиттер и регулирует размеры соседних панелей.

```html
<div class="splitpane">
  <div class="splitpane__panel splitpane__a">…</div>
  <div class="spl" role="separator" aria-orientation="vertical"
       aria-valuemin="20" aria-valuemax="80" aria-valuenow="50"
       aria-label="Изменить ширину панелей" tabindex="0">
    <span class="spl__grip"><i></i><i></i><i></i><i></i><i></i><i></i></span>
  </div>
  <div class="splitpane__panel splitpane__b">…</div>
</div>
```

## Switch
css: `styles/switch.css` · deps: [label-helper]

Свитч мгновенно переключает состояние — например, включает или отключает определённую опцию.

```html
<label class="sw sw--on">
  <input type="checkbox" class="sw__input" role="switch" aria-checked="true" checked>
  <span class="sw__control"><span class="sw__thumb"></span></span>
  <span class="sw__content">
    <span class="sw__label">Тёмная тема</span>
    <span class="ds-helper ds-helper--left">Применяется ко всему интерфейсу</span>
  </span>
</label>
<label class="sw sw--off sw--loading">
  <input type="checkbox" class="sw__input" role="switch" disabled>
  <span class="sw__control"><span class="sw__thumb"><span class="sw__spinner"></span></span></span>
</label>
<div class="sw-row">
  <label class="sw sw--on">…</label> <!-- .sw-row разворачивает .sw в row-reverse -->
</div>
```

## Tab
css: `styles/tab.css`

Таб — инструмент переключения между разными вьюхами одного экрана.

```html
<div class="tabs tabs--horiz" role="tablist">
  <button type="button" class="tab tab--m tab--horiz" role="tab" aria-selected="false" tabindex="-1">
    <span class="tab__label">Обзор</span>
  </button>
  <button type="button" class="tab tab--m tab--horiz tab--selected" role="tab" aria-selected="true" tabindex="0">
    <span class="tab__icon"><svg aria-hidden="true">…</svg></span>
    <span class="tab__label">Сделки</span>
    <span class="tab__badge">12</span>
  </button>
</div>
```

## Toast
css: `styles/toast.css` · deps: [button]

Тёмная пилюля-уведомление, всплывающая у верхней границы рабочей области по центру, — индикатор запуска фонового или блокирующего процесса.

```html
<div class="toast-layer toast-layer--bar">
  <div class="toast-stack">
    <div class="toast toast--enter" role="status" aria-live="polite">
      <span class="toast__lead">
        <span class="toast__spinner" aria-hidden="true"></span>
      </span>
      <span class="toast__msg">Выполняется маршрутизация</span>
    </div>
    <div class="toast toast--success" role="status" aria-live="polite">
      <span class="toast__lead">
        <span class="toast__icon" aria-hidden="true"><svg…></svg></span>
      </span>
      <span class="toast__msg">Маршрутизация завершена</span>
    </div>
  </div>
</div>
<!-- … полная анатомия: specs/Toast.md -->
```

## Tooltip
css: `styles/tooltip.css` · deps: [button]

Всплывающая подсказка при наведении или фокусе на объект — иконку, IconButton, обрезанный текст или поле с ошибкой.

```html
<button type="button" class="iconbtn" aria-label="Удалить" aria-describedby="tip-1">…</button>
<span class="tip tip--main tip--top tip--center tip--floating" role="tooltip" id="tip-1">
  Удалить
  <span class="tip__arrow"></span>
</span>
<span class="tip tip--error tip--bottom tip--start tip--no-arrow tip--multiline" role="tooltip">…</span>
```

