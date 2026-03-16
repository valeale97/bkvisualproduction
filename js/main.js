/*
  main.js (BK Visual Production)
  - Mobile nav toggle (keyboard accessible)
  - Smooth scrolling for in-page anchors
  - Active nav state on scroll
  - Footer year
  - Cookie banner consent (GDPR-lite, localStorage)

  NOTE: This file supports both the Home layout and inner pages.
*/

(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ----------------------------
  // Theme (Dark default + optional Light)
  // ----------------------------
  const THEME_KEY = 'bkvp_theme';

  function getCookie(name){
    const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()\[\]\\\/\+^]/g, '\\$&') + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }

  function setCookie(name, value, days){
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
  }

  function getStoredTheme(){
    try {
      const t = localStorage.getItem(THEME_KEY);
      if (t === 'light' || t === 'dark') return t;
    } catch (_) {}
    const c = getCookie(THEME_KEY);
    if (c === 'light' || c === 'dark') return c;
    return 'dark';
  }

  function rememberAllowed(){
    // Mirrors "Remember my choice" in your cookie UI (best-effort).
    try {
      const raw = localStorage.getItem('bkvp_consent') || '';
      if (!raw) return true;
      const obj = JSON.parse(raw);
      if (typeof obj.remember === 'boolean') return obj.remember;
      return true;
    } catch (_) {
      return true;
    }
  }

  function applyTheme(theme){
    const t = (theme === 'light') ? 'light' : 'dark';
    if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');

    const btn = $('.themeToggle');
    if (btn) {
      btn.setAttribute('aria-pressed', String(t === 'light'));
      btn.setAttribute('aria-label', t === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    }

    try { localStorage.setItem(THEME_KEY, t); } catch (_) {}
    if (rememberAllowed()) setCookie(THEME_KEY, t, 365);
  }

  function initTheme(){
    applyTheme(getStoredTheme());
    const btn = $('.themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      applyTheme(isLight ? 'dark' : 'light');
    });
  }

  // ----------------------------
  // Hero background video (local MP4 or Vimeo)
  // Configured in /js/data.js as BKVP_DATA.site.heroVideo
  // ----------------------------
  function getVimeoId(src){
    if (!src) return '';
    const s = String(src).trim();
    const m1 = s.match(/^vimeo:(\d+)$/i);
    if (m1) return m1[1];
    const m2 = s.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    if (m2) return m2[1];
    return '';
  }

  // function buildVimeoBackgroundUrl(id){
  //   const params = new URLSearchParams({
  //     background: '1',
  //     autoplay: '1',
  //     loop: '1',
  //     muted: '1',
  //     title: '0',
  //     byline: '0',
  //     portrait: '0'
  //   });
  //   return `https://player.vimeo.com/video/${encodeURIComponent(id)}?${params.toString()}`;
  // }

  function buildVimeoBackgroundUrl(id){
    const params = new URLSearchParams({
      background: '1',
      autoplay: '1',
      loop: '1',
      muted: '1',
      playsinline: '1',
      title: '0',
      byline: '0',
      portrait: '0'
    });
    return `https://player.vimeo.com/video/${encodeURIComponent(id)}?${params.toString()}`;
  }

  function initHeroMedia(){
    const mount = document.querySelector('[data-hero-media]');
    if (!mount) return;

    const lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
    const site = (window.BKVP_DATA && window.BKVP_DATA.site) ? window.BKVP_DATA.site : null;
    if (!site || !site.heroVideo) return;

    const pick = (obj) => {
      if (typeof obj === 'string') return obj;
      if (!obj || typeof obj !== 'object') return '';
      return obj[lang] || obj.en || obj.hr || '';
    };

    const src = pick(site.heroVideo);
    const poster = site.heroPoster || '/assets/img/logo.jpg';
    if (!src) return;

    // Clear any fallback markup
    while (mount.firstChild) mount.removeChild(mount.firstChild);

    const vimeoId = getVimeoId(src);
    if (vimeoId){
      const iframe = document.createElement('iframe');
      iframe.src = buildVimeoBackgroundUrl(vimeoId);
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.setAttribute('title', 'Hero video');
      iframe.setAttribute('loading', 'eager');
      mount.appendChild(iframe);
      return;
    }

    // Fallback: local mp4
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('poster', poster);
    const source = document.createElement('source');
    source.src = src;
    source.type = 'video/mp4';
    video.appendChild(source);
    mount.appendChild(video);
  }

  // ----------------------------
  // Footer year
  // ----------------------------
  const yearEl = $('#js-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Render hero background media if present
  initHeroMedia();

  // Theme init
  initTheme();

  // ----------------------------
  // Mobile nav
  // ----------------------------
  const toggleBtn = $('.nav__toggle') || $('#menuBtn');
  const links = $('#nav-links') || $('#navList') || $('.nav__links');

  function isOpen() {
    return !!(links && links.classList.contains('is-open'));
  }

  function setOpen(open) {
    if (!toggleBtn || !links) return;
    links.classList.toggle('is-open', open);
    // Animate hamburger into an X
    toggleBtn.classList.toggle('is-open', open);
    toggleBtn.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('no-scroll', open);

    if (open) {
      const first = links.querySelector('a');
      first && first.focus({ preventScroll: true });
    }
  }

  if (toggleBtn && links) {
    toggleBtn.addEventListener('click', () => setOpen(!isOpen()));

    // Close on link click (for in-page anchors)
    links.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#')) setOpen(false);
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) setOpen(false);
    });
  }

  // ----------------------------
  // Smooth scrolling (same-page anchors)
  // ----------------------------
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.getElementById(id.slice(1));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });

  // ----------------------------
  // Active link state (Home)
  // ----------------------------
  const sectionIds = ['about', 'portfolio', 'projects', 'contact'];
  const navLinks = sectionIds
    .map((id) => ({ id, a: $(`.nav__links a[href="#${id}"]`) }))
    .filter((x) => x.a);

  if (navLinks.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((ent) => {
          if (!ent.isIntersecting) return;
          navLinks.forEach((x) => x.a.classList.toggle('is-active', x.id === ent.target.id));
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 }
    );

    sectionIds.forEach((id) => {
      const sec = document.getElementById(id);
      if (sec) io.observe(sec);
    });
  }

  // ----------------------------
  // Scroll reveal (soft, modern)
  // ----------------------------
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = [
    ...$$('.section'),
    ...$$('.card'),
    ...$$('.project'),
    ...$$('.thumb'),
    ...$$('.frameLink'),
    ...$$('.tiles > a, .tilegrid > a, .thumb-grid > a')
  ].filter((el, i, arr) => el && arr.indexOf(el) === i);

  // Add base class + simple stagger within a common parent
  revealEls.forEach((el) => {
    el.classList.add('reveal');
  });

  if (revealEls.length) {
    if (reduceMotion) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    } else {
      const ioReveal = new IntersectionObserver(
        (entries) => {
          entries.forEach((ent) => {
            if (!ent.isIntersecting) return;
            const el = ent.target;

            // Stagger items that share a grid parent
            const parent = el.parentElement;
            if (parent) {
              const siblings = Array.from(parent.children).filter((n) => n.classList && n.classList.contains('reveal'));
              const idx = siblings.indexOf(el);
              if (idx >= 0) el.style.transitionDelay = `${Math.min(idx * 60, 240)}ms`;
            }

            el.classList.add('is-visible');
            ioReveal.unobserve(el);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
      );

      revealEls.forEach((el) => ioReveal.observe(el));
    }
  }

  // ----------------------------
  // Cookie preferences (modal)
  // Goals for this site:
  // - reCAPTCHA is ALWAYS enabled (spam protection)
  // - "Preference cookies" are OPTIONAL (remember cookie choices)
  // If preference cookies are rejected, the modal will be shown again
  // on the next page load because nothing is stored.
  // ----------------------------
  function initCookiePrefs(){
    // Prevent double-init if the async footer include fires later.
    if (window.__BKVP_COOKIES_INIT) return;
    const PREF_COOKIE = 'bkvp_prefs';
    const PREF_LS = 'bkvp_cookie_prefs_v5';

    const banner = $('#cookie') || $('#cookieBanner') || document.querySelector('[data-cookie]');
    if (!banner) return; // Will retry after includes are injected.
    window.__BKVP_COOKIES_INIT = true;

    const btnAccept = (banner.querySelector('[data-cookie-accept]') || $('#cookie-accept') || $('#cookieAccept')) || null;
    const btnReject = banner.querySelector('[data-cookie-reject]');
    const btnSettings = banner.querySelector('[data-cookie-settings]');
    const btnSave = banner.querySelector('[data-cookie-save]');
    const panel = banner.querySelector('[data-cookie-panel]');
    const backdrop = (banner.querySelector('[data-cookie-close]') || banner.querySelector('.cookie__backdrop'));

  function setCookie(name, value, days) {
    try {
      const maxAge = days * 24 * 60 * 60;
      document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
    } catch {
      /* ignore */
    }
  }

  function getCookie(name) {
    try {
      const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
      return m ? decodeURIComponent(m[1]) : '';
    } catch {
      return '';
    }
  }

  // Session-only choice (used when preference cookies are rejected)
  let sessionPrefs = null;

  function readPrefs() {
    const raw = getCookie(PREF_COOKIE) || (() => {
      try { return localStorage.getItem(PREF_LS) || ''; } catch { return ''; }
    })();
    if (!raw) return null;
    try {
      const obj = JSON.parse(raw);
      if (!obj || typeof obj !== 'object') return null;
      // Version bump: require v5 so old cookies won't suppress the modal.
      if (obj.v !== 5) return null;
      return { v: 5, remember: !!obj.remember };
    } catch {
      return null;
    }
  }

  function clearStoredPrefs(){
    try { setCookie(PREF_COOKIE, '', -1); } catch(e){}
    try { localStorage.removeItem(PREF_LS); } catch(e){}
  }

  function writePrefs(prefs){
    const safe = { v: 5, remember: !!prefs.remember, ts: Date.now() };
    sessionPrefs = safe;
    if (safe.remember){
      const str = JSON.stringify(safe);
      setCookie(PREF_COOKIE, str, 180);
      try { localStorage.setItem(PREF_LS, str); } catch { /* ignore */ }
    } else {
      clearStoredPrefs();
    }
    document.dispatchEvent(new CustomEvent('bkvp:cookiePrefs', { detail: safe }));
  }

  function showCookieModal(show) {
    banner.hidden = !show;
    document.documentElement.classList.toggle('no-scroll', show);
    if (show) {
      try { (btnAccept || banner.querySelector('button')).focus({ preventScroll: true }); } catch (e) {}
    }
  }

  function applyPrefs(prefs){
    if (!prefs) return;
    // Only one user-controllable toggle now: remember
    const rememberCb = banner.querySelector('input[data-cookie-toggle="remember"]');
    if (rememberCb) rememberCb.checked = !!prefs.remember;
  }

    const existing = readPrefs();
    if (!existing) showCookieModal(true);
    else { showCookieModal(false); applyPrefs(existing); }

    // Manage panel
    function togglePanel(open) {
      if (!panel) return;
      panel.hidden = !open;
      banner.classList.toggle('is-managing', open);
      if (open) {
        try { panel.querySelector('input[data-cookie-toggle]')?.focus({ preventScroll: true }); } catch (e) {}
      }
    }

    btnSettings && btnSettings.addEventListener('click', () => togglePanel(!!panel && panel.hidden));

    // If user explicitly rejects cookies, we block the page as requested.
    function ensureCookieGate() {
      let gate = document.getElementById('cookieGate');
      if (gate) return gate;
      gate = document.createElement('div');
      gate.id = 'cookieGate';
      gate.className = 'cookieGate';
      gate.hidden = true;
      gate.innerHTML = `
        <div class="cookieGate__inner" role="dialog" aria-modal="true" aria-label="Cookies required">
          <h3 class="cookieGate__title">Cookies required</h3>
          <p class="cookieGate__text">To use this website, cookies must be accepted. You can change your choice at any time.</p>
          <div class="cookieGate__actions">
            <button class="btn btn--primary" type="button" data-cookie-gate-review>Review cookie options</button>
          </div>
        </div>`;
      document.body.appendChild(gate);
      gate.addEventListener('click', (e) => {
        if (e.target.matches('[data-cookie-gate-review]')) {
          e.preventDefault();
          // Hide the gate first so the preferences modal is actually visible.
          hideCookieGate();
          showCookieModal(true);
          togglePanel(true);
        }
      });
      return gate;
    }

    function showCookieGate() {
      const gate = ensureCookieGate();
      gate.hidden = false;
      document.documentElement.classList.add('is-locked');
    }

    function hideCookieGate() {
      const gate = document.getElementById('cookieGate');
      if (gate) gate.hidden = true;
      document.documentElement.classList.remove('is-locked');
    }

    // Accept: enable preference cookie storage
    btnAccept && btnAccept.addEventListener('click', () => {
      writePrefs({ remember: true });
      applyPrefs(sessionPrefs);
      showCookieModal(false);
      togglePanel(false);
      hideCookieGate();
    });

    // Reject: do NOT store any preference cookies
    btnReject && btnReject.addEventListener('click', () => {
      writePrefs({ remember: false });
      showCookieModal(false);
      togglePanel(false);
      // Explicit reject blocks access.
      showCookieGate();
    });

    // Save custom (remember toggle only)
    btnSave && btnSave.addEventListener('click', () => {
      const remember = !!banner.querySelector('input[data-cookie-toggle="remember"]')?.checked;
      writePrefs({ remember });
      applyPrefs(sessionPrefs);
      showCookieModal(false);
      togglePanel(false);
      hideCookieGate();
    });

    // Close on backdrop (only after user has made a choice in this session)
    backdrop && backdrop.addEventListener('click', () => {
      if (readPrefs() || sessionPrefs) showCookieModal(false);
    });

    // Allow opening cookie settings from anywhere
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cookie-open]');
      if (!btn) return;
      e.preventDefault();
      showCookieModal(true);
      togglePanel(true);
    });
  }
  // Run now (for pages where cookie markup is in the HTML)
  initCookiePrefs();
  // Run again after async footer/contact partials are injected
  document.addEventListener('bkvp:includes:done', initCookiePrefs);

})();
