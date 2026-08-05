/* ============================================================
   tbl-resize.js — универсальное изменение ширины колонки для
   любой статичной .tbl-таблицы документации (делегирование на
   document, работает без инициализации на каждой странице).
   Ручки с [data-resize] (Конструктор, демо «Ширина колонок»)
   уже имеют свою логику — этот скрипт их не трогает.
   ============================================================ */
(function () {
  'use strict';
  var MIN = 96;

  function ensureGuide(tbl) {
    var g = tbl.querySelector(':scope > .tbl__guide');
    if (!g) { g = document.createElement('span'); g.className = 'tbl__guide'; tbl.appendChild(g); }
    return g;
  }
  function colIndex(row, th) { return Array.prototype.indexOf.call(row.children, th); }
  function parseTracks(row) {
    return row.style.gridTemplateColumns.trim().match(/[a-zA-Z-]*\([^)]*\)|\S+/g) || [];
  }
  function applyTracks(tbl, idx, px) {
    var rows = tbl.querySelectorAll(':scope > .tbl__row');
    rows.forEach(function (row) {
      var tracks = parseTracks(row);
      if (idx >= tracks.length) return;
      tracks[idx] = px + 'px';
      var last = tracks.length - 1;
      if (last !== idx && !/^minmax\(/.test(tracks[last])) tracks[last] = 'minmax(8px,1fr)';
      row.style.gridTemplateColumns = tracks.join(' ');
    });
  }
  function guideAt(tbl, clientX) {
    var g = ensureGuide(tbl);
    g.style.left = (clientX - tbl.getBoundingClientRect().left + tbl.scrollLeft) + 'px';
  }
  function startResize(e, handle) {
    var th = handle.closest('.th');
    var row = handle.closest('.tbl__row');
    var tbl = handle.closest('.tbl');
    if (!th || !row || !tbl) return;
    e.preventDefault();
    var idx = colIndex(row, th);
    var x0 = e.clientX, w0 = th.getBoundingClientRect().width;
    tbl.classList.add('tbl--resizing');
    th.classList.add('th--resizing');
    function move(ev) {
      var w = Math.max(MIN, Math.round(w0 + (ev.clientX - x0)));
      applyTracks(tbl, idx, w);
      guideAt(tbl, ev.clientX);
    }
    function up() {
      tbl.classList.remove('tbl--resizing');
      th.classList.remove('th--resizing');
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
    }
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
    move(e);
  }

  document.addEventListener('pointerdown', function (e) {
    var h = e.target.closest && e.target.closest('.th__resize');
    if (!h || h.hasAttribute('data-resize')) return;
    startResize(e, h);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var h = document.activeElement;
    if (!h || !h.classList || !h.classList.contains('th__resize') || h.hasAttribute('data-resize')) return;
    var th = h.closest('.th'), row = h.closest('.tbl__row'), tbl = h.closest('.tbl');
    if (!th || !row || !tbl) return;
    e.preventDefault();
    var idx = colIndex(row, th);
    var w = Math.max(MIN, Math.round(th.getBoundingClientRect().width + (e.key === 'ArrowRight' ? 16 : -16)));
    applyTracks(tbl, idx, w);
  });
})();
