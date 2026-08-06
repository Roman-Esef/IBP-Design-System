(function () {
  'use strict';
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';
  var COLS = '8px 44px minmax(200px,2.2fr) minmax(130px,1.3fr) minmax(110px,1fr) minmax(160px,1.6fr) 64px minmax(8px,1fr)';

  var ROWS = [
    { name: 'ООО «ЮгСтрой»',      amount: '1 240 500,00', status: ['success', 'Активна'], owner: 'Иванова А.' },
    { name: 'АО «Ресурс-Инвест»', amount: '860 000,00',   status: ['warning', 'На проверке'], owner: 'Петров С.' },
    { name: 'ИП Смирнов Д. В.',   amount: '312 750,00',   status: ['error', 'Просрочена'], owner: 'Иванова А.' },
    { name: 'ООО «Восток Трейд»', amount: '2 005 000,00', status: ['success', 'Активна'], owner: 'Кузьмин П.' },
    { name: 'ООО «Балт Логистик»',amount: '95 400,00',    status: ['info', 'Новая'], owner: 'Петров С.' }
  ];

  function headerRow(withCb) {
    return '<div class="tbl__row" style="grid-template-columns:' + COLS + ';">' +
      '<div class="th th--separator"></div>' +
      '<div class="th th--center">' + (withCb ? '<label class="cb cb--no-content"><input type="checkbox" class="cb__input"><span class="cb__box"><span class="cb__mark"></span></span></label>' : '') + '</div>' +
      '<div class="th"><span class="th__label">Контрагент</span></div>' +
      '<div class="th th--right"><span class="th__label">Сумма, ₽</span></div>' +
      '<div class="th"><span class="th__label">Статус</span></div>' +
      '<div class="th"><span class="th__label">Ответственный</span></div>' +
      '<div class="th th--center"><span class="th__label">Действие</span></div>' +
      '<div class="th th--separator"></div>' +
      '</div>';
  }

  function dataRow(r, selected) {
    var mark = selected ? '<span class="cb__mark">' + CHECK + '</span>' : '<span class="cb__mark"></span>';
    var cbCls = 'cb cb--no-content' + (selected ? ' cb--selected' : '');
    return '<div class="tbl__row' + (selected ? ' tbl__row--selected' : '') + '" style="grid-template-columns:' + COLS + ';">' +
      '<div class="tc tc--separator"></div>' +
      '<div class="tc tc--center"><label class="' + cbCls + '"><input type="checkbox" class="cb__input"' + (selected ? ' checked' : '') + '>' + '<span class="cb__box">' + mark + '</span></label></div>' +
      '<div class="tc"><span class="tc__row"><span class="tc__text tc__text--truncate">' + r.name + '</span></span></div>' +
      '<div class="tc tc--numbers"><span class="tc__row"><span class="tc__text">' + r.amount + '</span></span></div>' +
      '<div class="tc"><span class="chip chip--s chip--' + r.status[0] + '"><span class="chip__label">' + r.status[1] + '</span></span></div>' +
      '<div class="tc"><span class="tc__row"><span class="tc__text tc__text--truncate">' + r.owner + '</span></span></div>' +
      '<div class="tc tc--center"><div class="tc__hidden"><button class="ibtn ibtn--neutral ibtn--s" aria-label="Изменить"><i data-icon="edit"></i></button></div></div>' +
      '<div class="tc tc--separator"></div>' +
      '</div>';
  }

  function skeletonRow() {
    return '<div class="tbl__row" style="grid-template-columns:' + COLS + ';">' +
      '<div class="tc tc--separator"></div>' +
      '<div class="tc tc--center"></div>' +
      '<div class="tc tc--skeleton" aria-busy="true"><span class="tc__skeleton"></span></div>' +
      '<div class="tc tc--skeleton" aria-busy="true"><span class="tc__skeleton" style="width:70%"></span></div>' +
      '<div class="tc tc--skeleton" aria-busy="true"><span class="tc__skeleton" style="width:50%"></span></div>' +
      '<div class="tc tc--skeleton" aria-busy="true"><span class="tc__skeleton" style="width:60%"></span></div>' +
      '<div class="tc"></div>' +
      '<div class="tc tc--separator"></div>' +
      '</div>';
  }

  function paginationRow(bulkCount, total) {
    var out = '';
    if (bulkCount > 0) {
      out += '<div class="pgn-row pgn-row--bulk"><div class="pgn-bulk">' +
        '<span class="pgn-bulk__count" aria-live="polite">Выбрано: <b>' + bulkCount + '</b> из ' + total + '</span>' +
        '<span class="pgn-bulk__actions">' +
          '<button class="btn btn--outline btn--s"><i data-icon="download"></i><span class="btn__label">Экспорт</span></button>' +
          '<button class="btn btn--outline btn--error btn--s"><i data-icon="trash"></i><span class="btn__label">Удалить</span></button>' +
        '</span></div></div>';
    }
    out += '<div class="pgn-row">' +
      '<div class="pgn-row__left"><div class="pgn-info">' + total + ' записей</div></div>' +
      '<div class="pgn-row__right"><div class="pgn">' +
        '<span class="pgn__range">1 из ' + Math.max(1, Math.ceil(total / 10)) + '</span>' +
        '<nav class="pgn__nav" aria-label="Страницы">' +
          '<button class="pgn__arrow" aria-label="Предыдущая страница" disabled>‹</button>' +
          '<button class="pgn__num" aria-current="page">1</button>' +
          '<button class="pgn__num">' + Math.max(2, Math.ceil(total / 10)) + '</button>' +
          '<button class="pgn__arrow" aria-label="Следующая страница">›</button>' +
        '</nav>' +
      '</div></div>' +
    '</div>';
    return out;
  }

  function emptyBody() {
    return '<div class="dtable__empty">' +
      '<span class="illu" data-illu="empty-folder" aria-hidden="true"></span>' +
      '<p class="dtable__empty-title">Ничего не найдено</p>' +
      '<p class="dtable__empty-text">Попробуйте изменить параметры фильтра или очистить его.</p>' +
      '<button class="btn btn--outline btn--s"><span class="btn__label">Очистить фильтр</span></button>' +
      '</div>';
  }

  function toolbar(opts) {
    var left = '<div class="dtable__title-row"><h3 class="dtable__title">' + (opts.title || 'Таблица') + '</h3><span class="dtable__count">' + ROWS.length + '</span></div>';
    if (opts.filter) {
      left += '<div class="tfilter" role="group" aria-label="Фильтр таблицы">' +
        '<button class="btn btn--outline btn--s tfilter__open" aria-haspopup="dialog" aria-expanded="false"><i data-icon="filter"></i><span class="btn__label">Фильтр</span></button>' +
        '<span class="chip chip--edit chip--m tfilter__applied" tabindex="0"><span class="chip__label">Применено: 2</span><span class="chip__remove" role="button" aria-label="Сбросить все фильтры"><i data-icon="close"></i></span></span>' +
      '</div>';
    }
    var right = '<button class="btn btn--accent btn--s"><i data-icon="add"></i><span class="btn__label">Добавить</span></button>';
    return '<div class="dtable__toolbar">' +
      '<div class="dtable__toolbar-left">' + left + '</div>' +
      '<div class="dtable__toolbar-right">' + right + '</div>' +
      '</div>';
  }

  function build(opts) {
    var html = '<div class="dtable" ' + (opts.state === 'loading' ? 'aria-busy="true"' : '') + '>';
    if (opts.toolbar) html += toolbar(opts);
    html += '<div class="dtable__body">';
    if (opts.state === 'empty') {
      html += emptyBody();
    } else if (opts.state === 'loading') {
      html += '<div class="tbl">' + headerRow(true) + skeletonRow() + skeletonRow() + skeletonRow() + skeletonRow() + '</div>';
    } else {
      var rows = '';
      for (var i = 0; i < ROWS.length; i++) rows += dataRow(ROWS[i], i < opts.selected);
      html += '<div class="tbl">' + headerRow(true) + rows + '</div>';
    }
    html += '<div class="dtable__edge dtable__edge--l" aria-hidden="true"></div><div class="dtable__edge dtable__edge--r" aria-hidden="true"></div>';
    html += '</div>';
    if (opts.footer) html += '<div class="dtable__footer">' + paginationRow(opts.selected, ROWS.length) + '</div>';
    html += '</div>';
    return html;
  }

  function bindScrollFx(root) {
    var body = root.querySelector('.dtable__body');
    var dtable = root;
    if (!body || !dtable) return;
    function sync() {
      dtable.classList.toggle('dtable--scrolled', body.scrollTop > 0);
      dtable.classList.toggle('dtable--edge-l', body.scrollLeft > 0);
      dtable.classList.toggle('dtable--edge-r', body.scrollWidth - body.scrollLeft - body.clientWidth > 1);
    }
    body.addEventListener('scroll', sync);
    sync();
  }

  function readOpts() {
    return {
      toolbar: document.getElementById('ctl-toolbar').checked,
      title: document.getElementById('ctl-title').value || 'Таблица',
      filter: document.getElementById('ctl-filter').checked,
      state: document.getElementById('ctl-state').value,
      selected: parseInt(document.getElementById('ctl-selected').value, 10) > 0 ? (document.getElementById('ctl-selected').value === '24' ? ROWS.length : 2) : 0,
      footer: document.getElementById('ctl-footer').checked
    };
  }

  function render() {
    var opts = readOpts();
    var host = document.getElementById('demo-dtable');
    if (!host) return;
    host.outerHTML = build(opts).replace('class="dtable"', 'class="dtable" id="demo-dtable"');
    var root = document.getElementById('demo-dtable');
    if (window.dsIcons) window.dsIcons.apply(root);
    if (window.dsIllustrations) window.dsIllustrations.apply(root);
    bindScrollFx(root);

    toggle('ctl-title-wrap', opts.toolbar);
    toggle('ctl-filter-wrap', opts.toolbar);
    toggle('ctl-selected-wrap', opts.state === 'default' && opts.footer);
  }

  function toggle(id, on) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle('is-off', !on);
  }

  function buildAnatomy() {
    var host = document.getElementById('anat-dia');
    if (!host) return;
    var opts = { toolbar: true, title: 'Заявки', filter: true, state: 'default', selected: 0, footer: true };
    host.innerHTML = build(opts);
    if (window.dsIcons) window.dsIcons.apply(host);
    var hostRect = host.getBoundingClientRect();
    function markAt(el, n) {
      if (!el) return;
      var r = el.getBoundingClientRect();
      var span = document.createElement('span');
      span.className = 'mk';
      span.style.top = (r.top - hostRect.top + r.height / 2) + 'px';
      span.style.left = '-11px';
      span.textContent = n;
      host.appendChild(span);
    }
    host.style.paddingLeft = '14px';
    markAt(host.querySelector('.dtable__toolbar'), 1);
    markAt(host.querySelector('.th'), 2);
    markAt(host.querySelector('.tbl__row:not(:first-child)'), 3);
    markAt(host.querySelector('.pgn-row'), 4);
  }

  function buildStates() {
    var host = document.getElementById('states-grid');
    if (!host) return;
    var defs = [
      { label: 'Default', opts: { toolbar: true, title: 'Заявки', filter: false, state: 'default', selected: 0, footer: true } },
      { label: 'Loading', opts: { toolbar: true, title: 'Заявки', filter: false, state: 'loading', selected: 0, footer: false } },
      { label: 'Empty',   opts: { toolbar: true, title: 'Заявки', filter: false, state: 'empty', selected: 0, footer: false } }
    ];
    var html = '';
    defs.forEach(function (d) {
      html += '<div class="st-card"><span class="st-card__label">' + d.label + '</span>' + build(d.opts) + '</div>';
    });
    host.innerHTML = html;
    if (window.dsIcons) window.dsIcons.apply(host);
    if (window.dsIllustrations) window.dsIllustrations.apply(host);
  }

  function redline() {
    var probe = document.querySelector('#demo-dtable');
    if (!probe) return;
    var dtableCs = getComputedStyle(probe);
    var set = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
    set('rl-radius', dtableCs.borderRadius);
    var tb = probe.querySelector('.dtable__toolbar');
    if (tb) {
      var tbCs = getComputedStyle(tb);
      set('rl-toolbar-pad', tbCs.paddingTop + ' / ' + tbCs.paddingLeft);
      set('rl-toolbar-h', Math.round(tb.getBoundingClientRect().height) + 'px');
      set('rl-toolbar-gap', tbCs.gap || tbCs.columnGap);
    }
    var th = probe.querySelector('.th');
    if (th) set('rl-th-z', getComputedStyle(th).zIndex);
    var edge = probe.querySelector('.dtable__edge');
    if (edge) set('rl-edge-w', getComputedStyle(edge).width);
  }

  function copyButtons() {
    document.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var node = document.getElementById('code-' + btn.getAttribute('data-copy'));
        if (!node) return;
        navigator.clipboard.writeText(node.textContent).then(function () {
          var old = btn.textContent; btn.textContent = 'Скопировано';
          setTimeout(function () { btn.textContent = old; }, 1200);
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    ['ctl-toolbar', 'ctl-title', 'ctl-filter', 'ctl-state', 'ctl-selected', 'ctl-footer'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', render);
    });
    render();
    buildAnatomy();
    buildStates();
    copyButtons();
    setTimeout(redline, 60);
  });
})();
