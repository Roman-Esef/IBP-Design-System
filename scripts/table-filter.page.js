/* =========================================================================
   TableFilter — страница ДС: конструктор, витрины, модалка фильтра.
   Ядро — бар над таблицей: кнопка «Фильтр» (+ сплит-сброс), чиплист
   применённых параметров, счётчик «+N» и шеврон-аккордеон.
   ========================================================================= */
(function () {
  const L = window.DS_ICONS || {};
  const glyph = (n) => L[n] || '';

  /* ---------- пул демонстрационных параметров ---------- */
  const PARAM_POOL = [
    ['ТБ', 'ЦА, МБ, СРБ, СЗБ'],
    ['Скрыть сделки', 'ЦЭ'],
    ['Дески', 'RE, TMT, CND'],
    ['Группа продуктов', 'Продукты ДИД, Кредиты, Лизинг'],
    ['Валюта', 'RUB, USD, EUR'],
    ['Стадия', 'Согласование, Подписание'],
    ['Клиентский менеджер', 'Иванов И. И.'],
    ['Сумма', 'от 100 млн ₽'],
  ];
  function paramsFor(n) {
    const out = [];
    for (let i = 0; i < n; i++) out.push(PARAM_POOL[i % PARAM_POOL.length]);
    return out;
  }

  /* ---------- чип-параметр ---------- */
  function makeChip([label, values]) {
    const el = document.createElement('span');
    el.className = 'chip chip--edit chip--s';
    el.tabIndex = 0;
    const text = values ? label + ': ' + values : label;
    const lb = document.createElement('span'); lb.className = 'chip__label'; lb.textContent = text;
    el.appendChild(lb);
    const rm = document.createElement('span'); rm.className = 'chip__remove'; rm.setAttribute('role', 'button');
    rm.setAttribute('aria-label', 'Убрать ' + label); rm.innerHTML = glyph('close');
    el.appendChild(rm);
    return el;
  }

  /* ---------- кластер-триггер ---------- */
  function makeTrigger(applied) {
    const wrap = document.createElement('div');
    wrap.className = 'tfilter__trigger';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Фильтр таблицы');
    wrap.innerHTML =
      '<button type="button" class="btn btn--outline btn--xs tfilter__open" aria-haspopup="dialog" aria-expanded="false"><i data-icon="filter"></i><span class="btn__label">Фильтр</span></button>';
    if (applied) {
      wrap.insertAdjacentHTML('beforeend',
        '<button type="button" class="btn btn--outline btn--xs btn--icon-only tfilter__reset" aria-label="Сбросить фильтры"><i data-icon="filter-reset"></i></button>');
    }
    return wrap;
  }

  /* ---------- сборка бара ---------- */
  function buildBar(o = {}) {
    const { applied = false, params = [], expanded = false, disabled = false } = o;
    const bar = document.createElement('div');
    bar.className = 'tfilter';
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Фильтр таблицы');
    if (!expanded) bar.classList.add('tfilter--collapsed');
    if (disabled) { bar.classList.add('tfilter--disabled'); bar.setAttribute('aria-disabled', 'true'); }
    bar.dataset.expanded = String(expanded);

    bar.appendChild(makeTrigger(applied && params.length > 0));

    if (applied && params.length) {
      const chips = document.createElement('div');
      chips.className = 'tfilter__chips';
      chips.setAttribute('role', 'group');
      chips.setAttribute('aria-label', 'Применённые параметры');
      params.forEach(p => {
        const chip = makeChip(p);
        const rm = chip.querySelector('.chip__remove');
        rm.addEventListener('click', () => {
          chip.style.transition = 'opacity .18s, transform .18s';
          chip.style.opacity = '0'; chip.style.transform = 'scale(.85)';
          setTimeout(() => { chip.remove(); updateBar(bar); if (!chips.querySelector('.chip')) collapseToEmpty(bar); }, 180);
        });
        chip.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); rm.click(); }
        });
        chips.appendChild(chip);
      });
      bar.appendChild(chips);

      const tail = document.createElement('div');
      tail.className = 'tfilter__tail';
      tail.innerHTML =
        '<span class="badge badge--xs badge--neutral badge--text tfilter__more" aria-hidden="true"></span>' +
        '<button type="button" class="ibtn ibtn--neutral ibtn--s tfilter__toggle" aria-label="Развернуть фильтр" aria-expanded="' + expanded + '"><span class="tfilter__chev"><i data-icon="chevron-down"></i></span></button>';
      bar.appendChild(tail);

      tail.querySelector('.tfilter__toggle').addEventListener('click', () => {
        const now = bar.dataset.expanded !== 'true';
        bar.dataset.expanded = String(now);
        bar.classList.toggle('tfilter--collapsed', !now);
        updateBar(bar);
      });
    }

    window.dsIcons && window.dsIcons.apply(bar);
    return bar;
  }

  /* ---------- когда сняли последний параметр — вернуть одиночную кнопку ---------- */
  function collapseToEmpty(bar) {
    bar.querySelectorAll('.tfilter__chips, .tfilter__tail').forEach(n => n.remove());
    const trig = bar.querySelector('.tfilter__trigger');
    if (trig) { trig.replaceWith(makeTrigger(false)); window.dsIcons && window.dsIcons.apply(bar); }
  }

  /* ---------- измерение переполнения ---------- */
  function updateBar(bar) {
    const chipsEl = bar.querySelector('.tfilter__chips');
    const tail = bar.querySelector('.tfilter__tail');
    if (!chipsEl || !tail) return;
    const chips = Array.from(chipsEl.querySelectorAll('.chip'));
    const more = tail.querySelector('.tfilter__more');
    const toggle = tail.querySelector('.tfilter__toggle');
    const chev = tail.querySelector('.tfilter__chev i');
    const expanded = bar.dataset.expanded === 'true';
    /* сброс перед замером: все видимы, шринк запрещён — меряем НАТУРАЛЬНЫЕ ширины */
    chips.forEach(c => { c.style.display = ''; c.style.flex = ''; c.style.minWidth = ''; });

    /* доступную ширину под чипы считаем от всего бара; .tfilter__trigger теперь
       display:contents (сам без бокса) — ширину триггера меряем по его кнопкам */
    const GAP = 4, RESERVE = 60;
    const trigger = bar.querySelector('.tfilter__trigger');
    const triggerBtns = trigger ? Array.from(trigger.querySelectorAll('.btn')) : [];
    const triggerW = triggerBtns.reduce((sum, b, i) => sum + b.offsetWidth + (i > 0 ? GAP : 0), 0);
    const avail = bar.clientWidth - triggerW - (triggerBtns.length ? GAP : 0);
    const widths = chips.map(c => c.offsetWidth);   /* меряем, пока все видимы */

    function fits(reserve) {
      let used = 0, n = 0;
      for (let i = 0; i < widths.length; i++) {
        const next = n === 0 ? widths[i] : used + GAP + widths[i];
        if (next + (reserve ? GAP + RESERVE : 0) <= avail) { used = next; n++; } else break;
      }
      return n;
    }
    const overflow = fits(false) < chips.length;

    if (expanded) {
      tail.classList.remove('is-off');
      more.style.display = 'none';
      toggle.style.display = '';
      if (chev) { chev.setAttribute('data-icon', 'chevron-up'); }
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Свернуть фильтр');
    } else if (overflow) {
      const vis = Math.max(fits(true), 1);
      const hidden = chips.length - vis;
      chips.forEach((c, i) => { c.style.display = i < vis ? '' : 'none'; });
      /* последнему видимому чипу разрешаем ужаться (многоточие в chip__label),
         чтобы хвост «+N» + шеврон всегда оставался в баре даже в узком контейнере */
      const lastVis = chips[vis - 1];
      lastVis.style.flex = '0 1 auto';
      lastVis.style.minWidth = '0';
      tail.classList.remove('is-off');
      more.style.display = hidden > 0 ? '' : 'none';
      more.textContent = '+' + hidden;
      more.setAttribute('aria-label', 'ещё ' + hidden + ' параметров');
      toggle.style.display = '';
      if (chev) { chev.setAttribute('data-icon', 'chevron-down'); }
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Развернуть фильтр');
    } else {
      tail.classList.add('is-off');
    }
    window.dsIcons && window.dsIcons.apply(tail);
  }

  /* переизмерять бар при изменении ширины сцены */
  function observeBar(bar, host) {
    updateBar(bar);
    const ro = new ResizeObserver(() => updateBar(bar));
    ro.observe(host);
    requestAnimationFrame(() => updateBar(bar));
    setTimeout(() => updateBar(bar), 60);
  }

  /* ========================================================================= */
  document.addEventListener('DOMContentLoaded', () => {

    /* ---------------- КОНСТРУКТОР ---------------- */
    (function () {
      const controls = document.getElementById('pg-controls');
      const stage = document.getElementById('pg-stage');
      if (!controls || !stage) return;
      const state = { applied: 'yes', count: '5', expand: 'collapsed', mode: 'default' };

      function ctl(labelText, options, get, set, keepSelect) {
        const wrap = document.createElement('div'); wrap.className = 'ctl';
        if (keepSelect) wrap.dataset.pgKeepSelect = '';
        const l = document.createElement('div'); l.className = 'lbl'; l.textContent = labelText; wrap.appendChild(l);
        const box = document.createElement('div'); box.className = 'pg-select';
        const sel = document.createElement('select');
        options.forEach(([v, t]) => { const o = document.createElement('option'); o.value = v; o.textContent = t; if (v === get()) o.selected = true; sel.appendChild(o); });
        sel.value = get();
        sel.addEventListener('change', () => { set(sel.value); render(); });
        box.appendChild(sel); wrap.appendChild(box);
        return wrap;
      }

      const cApplied = ctl('Фильтр применён', [['no', 'Нет'], ['yes', 'Да']], () => state.applied, v => state.applied = v);
      const cCount = ctl('Параметров выбрано', [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8']], () => state.count, v => state.count = v, true);
      const cExpand = ctl('Раскрытие', [['collapsed', 'Свёрнут'], ['expanded', 'Развёрнут']], () => state.expand, v => state.expand = v);
      const cMode = ctl('Состояние', [['default', 'Обычный'], ['disabled', 'Заблокирован']], () => state.mode, v => state.mode = v);
      controls.append(cApplied, cCount, cExpand, cMode);

      function render() {
        const applied = state.applied === 'yes';
        cCount.classList.toggle('is-off', !applied);
        cExpand.classList.toggle('is-off', !applied);
        stage.innerHTML = '';
        const bar = buildBar({
          applied,
          params: applied ? paramsFor(parseInt(state.count, 10)) : [],
          expanded: state.expand === 'expanded',
          disabled: state.mode === 'disabled',
        });
        bar.style.width = '100%';
        stage.appendChild(bar);
        observeBar(bar, stage);
        // открытие модалки из конструктора
        const open = bar.querySelector('.tfilter__open');
        open && open.addEventListener('click', () => openFilterModal(open));
        const reset = bar.querySelector('.tfilter__reset');
        reset && reset.addEventListener('click', () => { state.applied = 'no'; cApplied.querySelector('select').value = 'no'; render(); });
      }
      render();
    })();

    /* ---------------- АНАТОМИЯ ---------------- */
    (function () {
      const host = document.getElementById('anat-stage');
      if (!host) return;
      const bar = buildBar({ applied: true, params: paramsFor(4), expanded: false });
      bar.style.width = '100%';
      host.appendChild(bar);
      observeBar(bar, host);
    })();

    /* ---------------- ВАРИАНТЫ · КНОПКА ---------------- */
    (function () {
      const host = document.getElementById('variants-btn');
      if (!host) return;
      const rows = [
        { k: 'Обычная', d: 'Фильтр не применён — одиночная кнопка Outline S', bar: { applied: false } },
        { k: 'Сплит со сбросом', d: 'Применён ≥1 параметр — кнопка + сброс всех', bar: { applied: true, params: paramsFor(2) } },
      ];
      rows.forEach(r => {
        const row = document.createElement('div'); row.className = 'vrow';
        row.innerHTML = '<div class="vrow__cap"><span class="k">' + r.k + '</span><span class="d">' + r.d + '</span></div>';
        const demo = document.createElement('div'); demo.className = 'vrow__demo';
        // показать только триггер (без чиплиста) в первой строке-варианте
        demo.appendChild(makeTrigger(r.bar.applied));
        window.dsIcons && window.dsIcons.apply(demo);
        row.appendChild(demo); host.appendChild(row);
      });
    })();

    /* ---------------- ВАРИАНТЫ · СОСТОЯНИЕ БАРА ---------------- */
    (function () {
      const host = document.getElementById('variants-states');
      if (!host) return;
      const rows = [
        { k: 'Filtered = No', d: 'Фильтр не применён', bar: { applied: false } },
        { k: 'Filtered = Yes · 1 ряд', d: 'Свёрнут, лишнее в «+N»', bar: { applied: true, params: paramsFor(6), expanded: false } },
        { k: 'Filtered = Yes · N рядов', d: 'Развёрнут на несколько рядов', bar: { applied: true, params: paramsFor(6), expanded: true } },
      ];
      rows.forEach(r => {
        const row = document.createElement('div'); row.className = 'vrow';
        row.innerHTML = '<div class="vrow__cap"><span class="k">' + r.k + '</span><span class="d">' + r.d + '</span></div>';
        const demo = document.createElement('div'); demo.className = 'vrow__demo';
        const bar = buildBar(r.bar); bar.style.width = '100%';
        demo.appendChild(bar);
        row.appendChild(demo); host.appendChild(row);
        observeBar(bar, demo);
      });
    })();

    /* ---------------- СОСТОЯНИЯ ---------------- */
    (function () {
      const host = document.getElementById('states-demo');
      if (!host) return;
      const items = [
        { cap: 'По умолчанию', desc: 'Применён фильтр, бар свёрнут в один ряд', bar: { applied: true, params: paramsFor(4) } },
        { cap: 'Заблокирован', desc: 'Бар недоступен целиком — pointer-events: none, opacity', bar: { applied: true, params: paramsFor(4), disabled: true } },
        { cap: 'Без фильтра', desc: 'Нет применённых параметров — одиночная кнопка', bar: { applied: false } },
      ];
      items.forEach(it => {
        const cell = document.createElement('div'); cell.className = 'state-cell';
        cell.innerHTML = '<span class="state-cap">' + it.cap + '</span>';
        const box = document.createElement('div'); box.style.cssText = 'width:100%;';
        const bar = buildBar(it.bar); bar.style.width = '100%';
        box.appendChild(bar); cell.appendChild(box);
        cell.insertAdjacentHTML('beforeend', '<span class="state-desc">' + it.desc + '</span>');
        host.appendChild(cell);
        observeBar(bar, box);
      });
    })();

    /* ---------------- ЦВЕТА ---------------- */
    (function () {
      const root = document.getElementById('color-ref');
      if (!root) return;
      const groups = [
        { name: 'Кнопка «Фильтр» (Outline)', rows: [
          ['Ведущая воронка', '--primary'], ['Обводка', '--border-primary'],
          ['Текст', '--text-primary'], ['Фон', '--bg-tile'],
        ]},
        { name: 'Чип-параметр (Edit · Fill)', rows: [
          ['Фон', '--st-system-light'], ['Обводка', '--st-system-midlight'],
          ['Текст', '--text-primary'], ['Крестик', '--text-secondary'],
        ]},
        { name: 'Хвост', rows: [
          ['Счётчик «+N»', '--text-inactive'], ['Шеврон', '--text-secondary'],
        ]},
        { name: 'Заблокированный бар', rows: [
          ['Прозрачность', '--st-disabled-mid'],
        ]},
      ];
      root.innerHTML = groups.map(g => `
        <section class="cref-group">
          <h3>${g.name}</h3>
          <div class="cref-rows">
            ${g.rows.map(([role, tok]) => `
              <div class="cref-row">
                <div class="cref-sw"><div class="cf" style="background:var(${tok});"></div></div>
                <div class="cref-meta"><p class="role">${role}</p><p class="tname">${tok}</p></div>
              </div>`).join('')}
          </div>
        </section>`).join('');
    })();

    /* ---------------- РАЗМЕРЫ (измерено) ---------------- */
    (function () {
      const tbody = document.querySelector('#size-table tbody');
      if (!tbody) return;
      const host = document.createElement('div');
      host.style.cssText = 'position:absolute; left:-9999px; top:0; width:900px;';
      document.body.appendChild(host);
      const bar = buildBar({ applied: true, params: paramsFor(3) });
      bar.style.width = '100%';
      host.appendChild(bar);
      const r = n => Math.round(parseFloat(n));
      const btn = bar.querySelector('.tfilter__open');
      const reset = bar.querySelector('.tfilter__reset');
      const chip = bar.querySelector('.chip');
      const toggle = bar.querySelector('.tfilter__toggle');
      const rows = [
        ['Кнопка «Фильтр»', 'Button · Outline S', r(getComputedStyle(btn).height) + ' px', 'Ведущая воронка 16px, тонирована в --primary'],
        ['Сброс', 'Button · Outline S · icon-only', r(getComputedStyle(reset).height) + ' px', 'Иконка filter-reset 16px'],
        ['Чип-параметр', 'Chip · Edit S', r(getComputedStyle(chip).height) + ' px', 'Макс. ширина 320px, дальше многоточие'],
        ['Шеврон-аккордеон', 'IconButton · Neutral S', r(getComputedStyle(toggle).height) + ' px', 'chevron-down / chevron-up'],
        ['Зазор в баре', '—', r(getComputedStyle(bar).gap) + ' px', 'Между всеми элементами и между чипами'],
      ];
      host.remove();
      tbody.innerHTML = rows.map(([a, b, c, d]) => `<tr><td>${a}</td><td class="dsc">${b}</td><td class="num">${c}</td><td class="rec">${d}</td></tr>`).join('');
    })();

    /* ---------------- REDLINE (измерено на живом экземпляре) ---------------- */
    (function () {
      const tbody = document.querySelector('#dev-spec-table tbody');
      if (!tbody) return;
      const host = document.createElement('div');
      host.style.cssText = 'position:absolute; left:-9999px; top:0; width:900px;';
      document.body.appendChild(host);
      const bar = buildBar({ applied: true, params: paramsFor(3) });
      bar.style.width = '100%';
      host.appendChild(bar);
      const r = n => Math.round(parseFloat(n) * 10) / 10;
      const csBar = getComputedStyle(bar);
      const btn = bar.querySelector('.tfilter__open');
      const chip = bar.querySelector('.chip');
      const csChip = getComputedStyle(chip);
      const lbl = getComputedStyle(chip.querySelector('.chip__label'));
      const more = getComputedStyle(bar.querySelector('.tfilter__more'));
      const rows = [
        ['Зазор бара (row / column)', r(csBar.rowGap) + ' / ' + r(csBar.columnGap) + ' px'],
        ['Высота кнопки «Фильтр»', r(getComputedStyle(btn).height) + ' px'],
        ['Высота чипа-параметра', r(csChip.height) + ' px'],
        ['Паддинг чипа (Y / X)', r(csChip.paddingTop) + ' / ' + r(csChip.paddingLeft) + ' px'],
        ['Радиус чипа', r(csChip.borderTopLeftRadius) + ' px'],
        ['Макс. ширина чипа', csChip.maxWidth],
        ['Типографика чипа (кегль / интерлиньяж)', r(lbl.fontSize) + ' / ' + r(lbl.lineHeight) + ' px'],
        ['Типографика «+N» (кегль)', r(more.fontSize) + ' px'],
      ];
      host.remove();
      tbody.innerHTML = rows.map(([k, v]) => `<tr><td>${k}</td><td class="rt-num">${v}</td></tr>`).join('');
    })();

    /* ---------------- МОДАЛКА ФИЛЬТРА ---------------- */
    let openerEl = null;
    let presets = [
      { name: 'Мои сделки ЦА', count: 3 },
      { name: 'Крупные кредиты RUB', count: 4 },
    ];

    function nested(parentScrim, opts) {
      const { title, body, danger, confirmLabel, onConfirm } = opts;
      const scrim = document.createElement('div');
      scrim.className = 'modal-scrim modal-scrim--nested';
      const w = danger ? 3 : 4;
      scrim.innerHTML =
        '<div class="modal modal--w' + w + '" role="alertdialog" aria-modal="true">' +
          '<div class="modal__head"><h2 class="modal__title">' + title + '</h2>' +
          '<span class="modal__close"><button type="button" class="ibtn ibtn--neutral ibtn--m" aria-label="Закрыть"><i data-icon="close"></i></button></span></div>' +
          '<div class="modal__body">' + body + '</div>' +
          '<div class="modal__foot"><div class="modal__foot-left"></div><div class="modal__foot-right">' +
            '<button type="button" class="btn btn--outline btn--m nested-cancel"><span class="btn__label">Отмена</span></button>' +
            '<button type="button" class="btn btn--accent btn--m' + (danger ? ' btn--danger' : '') + ' nested-ok"><span class="btn__label">' + confirmLabel + '</span></button>' +
          '</div></div>' +
        '</div>';
      parentScrim.appendChild(scrim);
      const close = () => scrim.remove();
      scrim.querySelector('.modal__close button').addEventListener('click', close);
      scrim.querySelector('.nested-cancel').addEventListener('click', close);
      scrim.querySelector('.nested-ok').addEventListener('click', () => { onConfirm && onConfirm(scrim); close(); });
      scrim.addEventListener('mousedown', (e) => { if (e.target === scrim) close(); });
      window.dsIcons && window.dsIcons.apply(scrim);
      return scrim;
    }

    function fieldsPanel() {
      return '<p class="tfm__panel-title">Общая информация</p>' +
        '<div class="inp inp--m"><label class="ds-label ds-label--left"><span class="ds-label__text">Название сделки</span></label>' +
          '<div class="inp__field"><input class="inp__control" placeholder="Например, 1-Кредит-199"></div></div>' +
        '<div class="inp inp--m"><label class="ds-label ds-label--left"><span class="ds-label__text">Территориальный банк</span></label>' +
          '<div class="inp__field"><span class="inp__chips">' +
            '<span class="chip chip--edit chip--s"><span class="chip__label">ЦА</span><span class="chip__remove" role="button" aria-label="Убрать ЦА">' + glyph('close') + '</span></span>' +
            '<span class="chip chip--edit chip--s"><span class="chip__label">МБ</span><span class="chip__remove" role="button" aria-label="Убрать МБ">' + glyph('close') + '</span></span>' +
          '</span><input class="inp__control" placeholder="Добавить…"><span class="inp__acts"><button class="inp__act" aria-label="Показать список">' + glyph('chevron-down') + '</button></span></div></div>' +
        '<label class="cb cb--selected" style="align-items:flex-start;"><input type="checkbox" class="cb__input" checked>' +
          '<span class="cb__box"><span class="cb__mark">' + glyph('check') + '</span></span>' +
          '<span class="cb__content"><span class="cb__label">Скрыть сделки ЦЭ</span></span></label>';
    }

    function presetsPanel(scrim) {
      const wrap = document.createElement('div');
      wrap.innerHTML = '<p class="tfm__panel-title">Сохранённые фильтры</p>';
      const list = document.createElement('div'); list.className = 'preset-list';
      function draw() {
        list.innerHTML = '';
        if (!presets.length) {
          list.innerHTML = '<div class="preset-empty">Пока нет сохранённых фильтров.<br>Настройте параметры и сохраните набор.</div>';
        } else {
          presets.forEach((p, i) => {
            const row = document.createElement('div'); row.className = 'preset-row';
            row.innerHTML =
              '<span class="preset-row__name">' + p.name + '</span>' +
              '<span class="preset-row__count">' + p.count + ' парам.</span>' +
              '<button type="button" class="btn btn--outline btn--xs pr-apply"><span class="btn__label">Применить</span></button>' +
              '<button type="button" class="ibtn ibtn--neutral ibtn--s pr-del" aria-label="Удалить пресет"><i data-icon="trash"></i></button>';
            row.querySelector('.pr-del').addEventListener('click', () => {
              nested(scrim, {
                title: 'Удалить пресет?', danger: true, confirmLabel: 'Удалить',
                body: '<p style="margin:0;">Пресет «' + p.name + '» будет удалён без возможности восстановления.</p>',
                onConfirm: () => { presets.splice(i, 1); draw(); },
              });
            });
            row.querySelector('.pr-apply').addEventListener('click', () => closeFilterModal(true));
            list.appendChild(row);
          });
        }
        window.dsIcons && window.dsIcons.apply(list);
      }
      draw();
      wrap.appendChild(list);
      wrap._draw = draw;
      return wrap;
    }

    let activeScrim = null;
    function openFilterModal(opener) {
      if (activeScrim) closeFilterModal(false);
      openerEl = opener || null;
      const scrim = document.createElement('div');
      scrim.className = 'modal-scrim';
      const modal = document.createElement('div');
      modal.className = 'modal modal--w6';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'Фильтр таблицы');

      const tabs = [
        { id: 'general', label: 'Общие' },
        { id: 'dates', label: 'Даты' },
        { id: 'presets', label: 'Сохранённые фильтры' },
      ];
      const nav = '<div class="tabs tabs--vert tfm__nav" role="tablist" aria-label="Разделы фильтра">' +
        tabs.map((t, i) => '<button type="button" class="tab tab--m tab--vert' + (i === 0 ? ' tab--selected' : '') + '" role="tab" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-tab="' + t.id + '"><span class="tab__label">' + t.label + '</span></button>').join('') +
        '</div>';

      modal.innerHTML =
        '<div class="modal__head"><h2 class="modal__title">Фильтр</h2>' +
          '<span class="modal__close"><button type="button" class="ibtn ibtn--neutral ibtn--m" aria-label="Закрыть"><i data-icon="close"></i></button></span></div>' +
        '<div class="modal__body modal__body--flush"><div class="tfm__body">' + nav + '<div class="tfm__panel" id="tfm-panel"></div></div></div>' +
        '<div class="modal__foot"><div class="modal__foot-left">' +
          '<button type="button" class="btn btn--transparent btn--m tfm-save"><i data-icon="bookmark-add"></i><span class="btn__label">Сохранить фильтр</span></button>' +
          '</div><div class="modal__foot-right">' +
          '<button type="button" class="btn btn--transparent btn--m tfm-clear"><span class="btn__label">Очистить</span></button>' +
          '<button type="button" class="btn btn--accent btn--m tfm-apply"><span class="btn__label">Применить</span></button>' +
        '</div></div>';

      scrim.appendChild(modal);
      document.body.appendChild(scrim);
      activeScrim = scrim;
      if (opener) opener.setAttribute('aria-expanded', 'true');

      const panel = modal.querySelector('#tfm-panel');
      const presetsWrap = presetsPanel(scrim);
      function showTab(id) {
        if (id === 'presets') { panel.innerHTML = ''; panel.appendChild(presetsWrap); }
        else if (id === 'dates') { panel.innerHTML = '<p class="tfm__panel-title">Даты</p><div class="inp inp--m"><label class="ds-label ds-label--left"><span class="ds-label__text">Период сделки</span></label><div class="inp__field"><input class="inp__control" placeholder="ММ.ДД.ГГГГ"><span class="inp__acts"><button class="inp__act" aria-label="Открыть календарь">' + glyph('calendar') + '</button></span></div></div>'; }
        else { panel.innerHTML = fieldsPanel(); }
        window.dsIcons && window.dsIcons.apply(panel);
      }
      showTab('general');

      modal.querySelectorAll('[role="tab"]').forEach(tb => {
        tb.addEventListener('click', () => {
          modal.querySelectorAll('[role="tab"]').forEach(x => { x.classList.remove('tab--selected'); x.setAttribute('aria-selected', 'false'); x.tabIndex = -1; });
          tb.classList.add('tab--selected'); tb.setAttribute('aria-selected', 'true'); tb.tabIndex = 0;
          showTab(tb.dataset.tab);
        });
      });

      modal.querySelector('.tfm-save').addEventListener('click', () => {
        nested(scrim, {
          title: 'Сохранить фильтр', confirmLabel: 'Сохранить',
          body: '<div class="inp inp--m"><label class="ds-label ds-label--left"><span class="ds-label__text">Название пресета</span></label><div class="inp__field"><input class="inp__control nested-name" placeholder="Например, Мои сделки"></div></div>',
          onConfirm: (s) => {
            const name = (s.querySelector('.nested-name').value || '').trim() || 'Новый фильтр';
            const exists = presets.find(p => p.name === name);
            if (exists) {
              nested(scrim, {
                title: 'Заменить пресет?', confirmLabel: 'Заменить',
                body: '<p style="margin:0;">Пресет с именем «' + name + '» уже существует. Заменить его текущими параметрами?</p>',
                onConfirm: () => { exists.count = 4; presetsWrap._draw && presetsWrap._draw(); },
              });
            } else if (presets.length >= 5) {
              nested(scrim, { title: 'Достигнут лимит', confirmLabel: 'Понятно', body: '<p style="margin:0;">Сохранено максимум 5 фильтров. Удалите один, чтобы добавить новый.</p>' });
            } else {
              presets.push({ name, count: 4 }); presetsWrap._draw && presetsWrap._draw();
            }
          },
        });
      });

      modal.querySelector('.tfm-clear').addEventListener('click', () => {
        modal.querySelectorAll('.tfm__panel .chip').forEach(c => c.remove());
        modal.querySelectorAll('.tfm__panel .inp__control').forEach(i => { i.value = ''; });
        modal.querySelectorAll('.tfm__panel .cb__input').forEach(i => { i.checked = false; });
      });
      modal.querySelector('.tfm-apply').addEventListener('click', () => closeFilterModal(true));
      modal.querySelector('.modal__close button').addEventListener('click', () => closeFilterModal(false));
      scrim.addEventListener('mousedown', (e) => { if (e.target === scrim) closeFilterModal(false); });

      window.dsIcons && window.dsIcons.apply(scrim);
    }

    function closeFilterModal() {
      if (!activeScrim) return;
      activeScrim.remove(); activeScrim = null;
      if (openerEl) { openerEl.setAttribute('aria-expanded', 'false'); openerEl = null; }
    }

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !activeScrim) return;
      const nestedScrim = activeScrim.querySelector('.modal-scrim--nested');
      if (nestedScrim) nestedScrim.remove(); else closeFilterModal(false);
    });

    const openBtn = document.getElementById('open-modal');
    openBtn && openBtn.addEventListener('click', () => openFilterModal(openBtn));

    /* ---------------- COPY-TO-CLIPBOARD ---------------- */
    document.querySelectorAll('.code-panel__copy').forEach(btn => {
      const target = document.getElementById(btn.dataset.copyTarget);
      if (!target) return;
      const label = btn.querySelector('.copy-label');
      btn.addEventListener('click', async () => {
        const text = target.textContent;
        try { await navigator.clipboard.writeText(text); }
        catch (e) {
          const ta = document.createElement('textarea');
          ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); } catch (e2) {}
          ta.remove();
        }
        btn.classList.add('is-copied');
        const prev = label.textContent; label.textContent = 'Скопировано';
        setTimeout(() => { btn.classList.remove('is-copied'); label.textContent = prev; }, 1600);
      });
    });
  });
})();
