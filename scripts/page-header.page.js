/* PageHeader — конструктор и демо страницы компонента */
(function(){
'use strict';

function getIcon(name, size){
  size = size || 20;
  if(!window.DS_ICONS) return '';
  var raw = window.DS_ICONS[name] || ''; if(!raw) return '';
  var d = document.createElement('div'); d.innerHTML = raw;
  var s = d.firstElementChild; if(!s) return '';
  s.setAttribute('width', size); s.setAttribute('height', size); s.setAttribute('aria-hidden','true');
  return s.outerHTML;
}
function esc(str){ return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

/* ---------- сборка PageHeader из опций ---------- */
function buildPhead(o){
  o = o || {};
  var title = o.title || 'D-007. ПАО «Газпром»';

  var row = '';
  if (o.ico) row += '<span class="phead__title-ico" aria-hidden="true">' + getIcon('drag-dots',24) + '</span>';
  row += '<h' + (o.hLevel || 2) + ' class="phead__title">' + esc(title) + '</h' + (o.hLevel || 2) + '>';
  if (o.edit) row += '<button type="button" class="ibtn ibtn--neutral ibtn--s phead__edit" aria-label="Переименовать">' + getIcon('edit',20) + '</button>';

  if (o.chips === 'one' || o.chips === 'list'){
    var chip = function(t){ return '<span class="chip chip--readonly chip--s"><span class="chip__label">' + t + '</span></span>'; };
    var chips = (o.chips === 'one') ? chip('Черновик') : chip('Черновик') + chip('На утверждении') + chip('PE');
    row += '<div class="phead__chips">' + chips + '</div>';
  }
  if (o.ret) row += '<span class="phead__return"><button type="button" class="btn btn--outline btn--xs">' + getIcon('flip-backward',16) + '<span class="btn__label">' + esc(o.retLabel || 'В сделку') + '</span></button></span>';

  var sub = '';
  if (o.sub === 'std'){
    sub = '<div class="phead__subtitle"><span class="phead__subtitle-ico" aria-hidden="true">' + getIcon('check-circle-filled',16) + '</span>Дата фактического погашения 12.01.2021</div>';
  } else if (o.sub === 'custom'){
    sub = '<div class="phead__subtitle">' +
      '<span class="phead__meta"><span class="phead__meta-ico">' + getIcon('copy',16) + '</span>7</span>' +
      '<span class="phead__meta"><span class="phead__meta-ico phead__meta-ico--ok">' + getIcon('check-circle',16) + '</span>Версия 12 (07.02.2021)</span>' +
      '</div>';
  }

  var acts = '';
  var n = Number(o.actions || 0);
  if (n > 0 || o.menu){
    var list = [];
    if (n >= 1) list.push('<button type="button" class="btn btn--outline btn--m">' + getIcon('star',20) + '<span class="btn__label">В избранное</span></button>');
    if (n >= 3) list.push('<button type="button" class="btn btn--outline btn--m">' + getIcon('refresh',20) + '<span class="btn__label">Пересчёт метрик</span></button>');
    if (n >= 2) list.push('<button type="button" class="btn btn--accent btn--m">' + getIcon('download',20) + '<span class="btn__label">Выгрузить</span></button>');
    if (o.menu) list.push('<button type="button" class="btn btn--outline btn--m btn--icon-only" aria-label="Ещё действия" aria-haspopup="menu" aria-expanded="' + (o.menuOpen ? 'true' : 'false') + '">' + getIcon('more-dots',20) + '</button>');
    acts = '<div class="phead__actions">' + list.join('') + '</div>';
  }

  var cls = 'phead';
  if (o.dashboard) cls += ' phead--dashboard';
  if (o.stack) cls += ' phead--stack';

  return '<div class="' + cls + '"><div class="phead__main"><div class="phead__title-row">' + row + '</div>' + sub + '</div>' + acts + '</div>';
}

function mount(id, opts){
  var el = document.getElementById(id);
  if (el) el.innerHTML = buildPhead(opts);
}

/* ---------- конструктор ---------- */
function rebuild(){
  var width = document.getElementById('ctl-width').value;
  var vp = document.getElementById('demo-viewport');
  vp.style.width = width + 'px';

  var o = {
    title:   document.getElementById('ctl-title').value.trim() || 'D-007. ПАО «Газпром»',
    ico:     document.getElementById('ctl-ico').checked,
    edit:    document.getElementById('ctl-edit').checked,
    chips:   document.getElementById('ctl-chips').value === 'none' ? null : document.getElementById('ctl-chips').value,
    ret:     document.getElementById('ctl-return').checked,
    sub:     document.getElementById('ctl-sub').value === 'none' ? null : document.getElementById('ctl-sub').value,
    actions: document.getElementById('ctl-actions').value,
    menu:    document.getElementById('ctl-menu').checked,
    dashboard: document.getElementById('ctl-dash').checked,
    stack:   width === '375'
  };
  /* MenuButton неактуален, когда действий нет вовсе */
  document.getElementById('demo-phead').innerHTML = buildPhead(o);
}

var ids = ['ctl-title','ctl-ico','ctl-edit','ctl-chips','ctl-return','ctl-sub','ctl-actions','ctl-menu','ctl-dash','ctl-width'];
ids.forEach(function(id){
  var el = document.getElementById(id);
  if (el){ el.addEventListener('change', rebuild); el.addEventListener('input', rebuild); }
});

/* ---------- статичные демо ---------- */
function renderDemos(){
  rebuild();

  /* Использование */
  mount('ex-list',   { title:'Текущий портфель ДИД', edit:false, actions:'1', menu:false, hLevel:3 });
  mount('ex-deal',   { title:'1234. СамолётИнвестПродакшн', edit:true, chips:'list', sub:'custom', actions:'2', menu:true, hLevel:3 });
  mount('ex-nested', { title:'Плановые платежи по сделке', ret:true, retLabel:'В сделку', hLevel:3 });

  /* Анатомия */
  mount('anat-phead', { ico:true, edit:true, chips:'one', ret:true, sub:'custom', actions:'2', menu:true, hLevel:3 });

  /* Варианты */
  mount('v-chip-one',  { edit:true, chips:'one', hLevel:3 });
  mount('v-chip-list', { edit:true, chips:'list', hLevel:3 });
  mount('v-return',    { ret:true, hLevel:3 });
  mount('v-sub-std',   { edit:true, sub:'std', hLevel:3 });
  mount('v-sub-custom',{ edit:true, sub:'custom', hLevel:3 });
  mount('v-act-2m',    { edit:true, actions:'2', menu:true, hLevel:3 });
  mount('v-act-1',     { edit:true, actions:'1', hLevel:3 });
  mount('v-act-m',     { edit:true, menu:true, hLevel:3 });
  mount('v-dash',      { edit:true, chips:'one', sub:'custom', actions:'2', menu:true, dashboard:true, hLevel:3 });

  /* Поведение */
  mount('b-menu', { edit:true, actions:'2', menu:true, menuOpen:true, hLevel:3 });
  var bm = document.getElementById('b-menu');
  if (bm){
    var anchor = bm.querySelector('.phead__actions');
    if (anchor){
      anchor.style.position = 'relative';
      anchor.insertAdjacentHTML('beforeend',
        '<div class="menu menu--floating" role="menu" style="position:absolute;top:calc(100% + 6px);right:0;z-index:5;">' +
          '<button type="button" class="menu__item" role="menuitem"><span class="menu__item-icon">' + getIcon('download-report',20) + '</span><span class="menu__item-label">Выгрузить в XLSX</span></button>' +
          '<button type="button" class="menu__item" role="menuitem"><span class="menu__item-icon">' + getIcon('history',20) + '</span><span class="menu__item-label">История изменений</span></button>' +
          '<hr class="menu__divider">' +
          '<button type="button" class="menu__item menu__item--danger" role="menuitem"><span class="menu__item-icon">' + getIcon('trash',20) + '</span><span class="menu__item-label">Удалить сделку</span></button>' +
        '</div>');
    }
  }
  mount('b-trunc', { title:'ФИ: 111-Акции-2 · КГ ГАЗНЕФТЕХИМПРОМСТРОЙ НЕДВИЖИМОСТЬ, внутригрупповой кредит', edit:true, actions:'1', hLevel:3 });
  mount('b-ad-desktop', { edit:true, chips:'one', sub:'custom', actions:'3', menu:true, hLevel:3 });
  mount('b-ad-tablet',  { edit:true, chips:'one', sub:'custom', actions:'1', menu:true, hLevel:3 });
  mount('b-ad-mobile',  { edit:true, chips:'one', sub:'custom', actions:'1', menu:true, stack:true, hLevel:3 });
}

/* ---------- redline ---------- */
function measureRedline(){
  var root = document.getElementById('rl-phead'); if(!root) return;
  function set(id,v){ var n=document.getElementById(id); if(n) n.textContent=v; }
  var title = getComputedStyle(document.getElementById('rl-title-el'));
  var sub   = getComputedStyle(document.getElementById('rl-sub-el'));
  var row   = getComputedStyle(document.getElementById('rl-row'));
  var main  = getComputedStyle(document.getElementById('rl-main'));
  var rootS = getComputedStyle(root);
  var acts  = getComputedStyle(document.getElementById('rl-acts'));
  var dash  = getComputedStyle(document.getElementById('rl-dash-el'));
  set('rl-title', title.fontSize + ' / ' + title.lineHeight + ' · ' + title.fontWeight);
  set('rl-sub', sub.fontSize + ' / ' + sub.lineHeight);
  set('rl-rowgap', row.columnGap || row.gap);
  set('rl-maingap', main.rowGap || main.gap);
  set('rl-rootgap', rootS.columnGap || rootS.gap);
  set('rl-actgap', acts.columnGap || acts.gap);
  set('rl-rowh', row.minHeight);
  set('rl-dash', dash.paddingTop + ' / ' + dash.paddingLeft + ' · радиус ' + dash.borderTopLeftRadius);
}

/* ---------- copy buttons ---------- */
document.querySelectorAll('.copy-btn').forEach(function(btn){
  btn.addEventListener('click', function(){
    var el = document.getElementById('code-' + btn.getAttribute('data-copy')); if(!el) return;
    navigator.clipboard.writeText(el.textContent).then(function(){
      btn.textContent='Скопировано ✓'; btn.classList.add('is-copied');
      setTimeout(function(){ btn.textContent='Скопировать'; btn.classList.remove('is-copied'); }, 2000);
    });
  });
});

renderDemos();
setTimeout(measureRedline, 300);
})();
