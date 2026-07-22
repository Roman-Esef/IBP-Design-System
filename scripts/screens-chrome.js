/* ============================================================
   SCREENS CHROME — общий рантайм оболочки приложения для раздела
   «Примеры экранов». Собирает NavPanel из данных меню ДС и включает
   её поведение (rail ⇄ drawer ⇄ fixed, тултип, оверлей), чтобы
   компонент работал «из коробки», а не только как CSS-оболочка.

   Монтаж: <aside class="scr__rail" data-screen-rail
              data-active="<имя-иконки>" data-avatar="ИБ"
              data-user="Александров Петр" data-role="Аналитик ДИД"
              data-org="SMB Недвижимость +2"></aside>
   Требует подключённых icons-data.js + ds-icons.js.
   ============================================================ */
(function () {
  var host = document.querySelector('[data-screen-rail]');
  if (!host) return;

  var active = host.getAttribute('data-active') || 'main-page';
  var avatar = host.getAttribute('data-avatar') || 'ИБ';
  var uName = host.getAttribute('data-user') || 'Александров Петр Константинович';
  var uRole = host.getAttribute('data-role') || 'Консультант-аналитик ДИД';
  var uOrg = host.getAttribute('data-org') || 'SMB Недвижимость +2';

  function ic(name) { return '<i data-icon="' + name + '"></i>'; }

  // Меню — тот же набор, что в проде IBP (см. nav-panel.page.js)
  var HOME = { icon: 'main-page', label: 'Главная' };
  var BLOCKS = [
    { label: 'Origination', items: [
      { icon: 'Important-deals', label: 'Обязательные сделки' },
      { icon: 'deals-possible-deals', label: 'Возможные сделки' },
      { icon: 'sales-projects', label: 'Проекты продаж CIB' },
      { icon: 'calc', label: 'Калькулятор' },
      { icon: 'funds', label: 'Фонды' }
    ] },
    { label: 'Pipeline', items: [
      { icon: 'pipeline', label: 'Pipeline' },
      { icon: 'corporate-transactions', label: 'Корпоративные запросы' },
      { icon: 'payments-ib', label: 'Реестр платежей IB' }
    ] },
    { label: 'Текущий портфель ДИД', items: [
      { icon: 'current-depo', label: 'Текущий портфель ДИД' },
      { icon: 'cash-flow', label: 'Прогноз CashFlow' },
      { icon: 'percent-circle', label: 'Процентные схемы' }
    ] },
    { label: 'Отчеты', items: [
      { icon: 'reports-1-c', label: 'Отчёты 1C/Navision' },
      { icon: 'reserve', label: 'Расчет резерва' },
      { icon: 'rwa', label: 'RWA' },
      { icon: 'bar-chart', label: 'Метрики' }
    ] },
    { label: 'Администрирование', items: [
      { icon: 'admin-panel-settings', label: 'Администрирование' }
    ] }
  ];

  function itemHTML(it, first) {
    var sel = it.icon === active;
    return '<a class="nav__item' + (sel ? ' nav__item--selected' : '') + '" href="#"'
      + (sel ? ' aria-current="page"' : '') + '>'
      + '<span class="nav__ico">' + ic(it.icon) + '</span>'
      + '<span class="nav__label">' + it.label + '</span>'
      + (it.badge ? '<span class="nav__badge"><span class="badge badge--xs badge--accent" aria-hidden="true">' + it.badge + '</span></span>' : '')
      + '</a>';
  }

  function build(mode) {
    var s = '<nav class="nav nav--' + mode + '" aria-label="Главное меню">';
    // top: бургер (+ pin в развёрнутых режимах)
    s += '<div class="nav__top">';
    s += '<button type="button" class="ibtn ibtn--neutral ibtn--m nav__burger" aria-label="'
      + (mode === 'rail' ? 'Развернуть меню' : 'Свернуть меню') + '">' + ic('left-menu') + '</button>';
    if (mode !== 'rail') {
      s += '<button type="button" class="ibtn ibtn--neutral ibtn--m nav__pin" aria-pressed="' + (mode === 'fixed')
        + '" aria-label="' + (mode === 'fixed' ? 'Открепить панель' : 'Закрепить панель') + '">'
        + ic(mode === 'fixed' ? 'unpin-menu' : 'pin-menu') + '</button>';
    }
    s += '</div>';
    // list
    s += '<div class="nav__list">';
    s += itemHTML(HOME);
    BLOCKS.forEach(function (b, i) {
      s += '<div class="nav__block' + (i === 0 ? ' nav__block--first' : '') + '">';
      s += '<div class="nav__block-label">' + b.label + '</div>';
      b.items.forEach(function (it) { s += itemHTML(it); });
      s += '</div>';
    });
    s += '</div>';
    // footer: аватар + профиль + логаут
    s += '<div class="nav__footer">'
      + '<div class="nav__user">'
      + '<span class="av av--circular av--m"><span class="av__text">' + avatar + '</span></span>'
      + '<span class="nav__user-text">'
      + '<span class="nav__user-name">' + uName + '</span>'
      + '<span class="nav__user-role">' + uRole + '</span>'
      + '<span class="nav__user-org">' + uOrg + '</span>'
      + '</span></div>'
      + '<button type="button" class="ibtn ibtn--neutral ibtn--m nav__logout" aria-label="Выйти">' + ic('logout') + '</button>'
      + '</div>';
    s += '</nav>';
    return s;
  }

  var scrim = null;
  function removeScrim() { if (scrim) { scrim.remove(); scrim = null; } }
  function addScrim() {
    removeScrim();
    scrim = document.createElement('div');
    scrim.className = 'scr__scrim';
    scrim.addEventListener('click', function () { render('rail'); });
    document.body.appendChild(scrim);
  }

  function render(mode) {
    host.innerHTML = build(mode);
    if (window.dsIcons) window.dsIcons.apply(host);
    var nav = host.querySelector('.nav');
    var burger = host.querySelector('.nav__burger');
    var pin = host.querySelector('.nav__pin');

    // rail: позиционирование тултипа (fixed label — как в nav-panel.page.js)
    if (mode === 'rail') {
      nav.addEventListener('mouseover', placeTip);
      nav.addEventListener('focusin', placeTip);
    }
    function placeTip(e) {
      var item = e.target.closest && e.target.closest('.nav__item');
      if (!item || !nav.contains(item)) return;
      var lbl = item.querySelector('.nav__label');
      if (!lbl) return;
      var r = item.getBoundingClientRect();
      lbl.style.top = (r.top + r.height / 2) + 'px';
      lbl.style.left = (r.right + 10) + 'px';
    }

    // бургер: rail → drawer (оверлей), drawer → rail
    burger.addEventListener('click', function () {
      render(mode === 'rail' ? 'drawer' : 'rail');
    });
    // pin: drawer → fixed (закрепить), fixed → drawer
    if (pin) pin.addEventListener('click', function () {
      render(mode === 'fixed' ? 'drawer' : 'fixed');
    });

    // drawer — оверлей поверх контента + скрим (клик вне / Esc → rail)
    if (mode === 'drawer') addScrim(); else removeScrim();
  }

  render('rail');

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && host.querySelector('.nav--drawer')) render('rail');
  });
})();

/* ---------- RiskMetric: поповер по клику на информер (делегирование) ------- */
(function () {
  function closeAll(except) {
    document.querySelectorAll('.pop-anchor .pop:not([hidden])').forEach(function (p) {
      if (p === except) return;
      p.hidden = true;
      var t = p.closest('.pop-anchor').querySelector('.chip__info');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
  document.addEventListener('click', function (e) {
    var closeBtn = e.target.closest ? e.target.closest('.pop__close') : null;
    if (closeBtn) { closeAll(null); return; }
    var info = e.target.closest ? e.target.closest('.chip__info') : null;
    if (info) {
      var anchor = info.closest('.pop-anchor');
      var pop = anchor && anchor.querySelector('.pop');
      if (pop) {
        e.preventDefault();
        var willOpen = pop.hidden;
        closeAll(willOpen ? pop : null);
        pop.hidden = !willOpen;
        info.setAttribute('aria-expanded', String(willOpen));
        return;
      }
    }
    if (!(e.target.closest && e.target.closest('.pop'))) closeAll(null);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(null); });
})();
