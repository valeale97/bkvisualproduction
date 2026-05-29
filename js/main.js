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
    const poster = site.heroPoster || '';
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
  // Fixed WhatsApp button
  // ----------------------------
  function initWhatsAppFloatingButton(){
    if (document.getElementById('whatsapp-floating')) return;
    const link = document.createElement('a');
    link.id = 'whatsapp-floating';
    link.className = 'whatsappFloat';
    link.href = 'https://wa.me/385955984248';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'WhatsApp');
    link.title = 'WhatsApp';
    link.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.9a8.5 8.5 0 0 1-12.5 7.5L3 21l1.7-4.7A8.5 8.5 0 1 1 20.5 11.9zm-8.5-7a6.5 6.5 0 0 0-5.6 9.7l.2.4-.9 2.4 2.5-.8.4.2a6.5 6.5 0 1 0 3.4-12zm3.8 9.2c-.2.6-1.1 1.1-1.5 1.2-.4.1-.8.1-1.3 0-.3-.1-.7-.2-1.2-.4a10.3 10.3 0 0 1-3.6-3.1c-.4-.5-1-1.3-1-2.3s.5-1.5.7-1.7c.2-.2.4-.3.6-.3h.4c.1 0 .3 0 .4.3l.6 1.4c.1.2.1.3 0 .4l-.2.3c-.1.1-.2.2-.3.4-.1.1-.2.3 0 .5.2.2.7 1.2 1.6 2 .9.8 1.6 1 1.9 1.1.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.3.6c.2.1.4.2.4.3 0 .1 0 .6-.2 1.2z"/></svg>';
    document.body.appendChild(link);
  }

  // ----------------------------
  // Footer year
  // ----------------------------
  const yearEl = $('#js-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Render hero background media if present
  initHeroMedia();
  initWhatsAppFloatingButton();


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
  // Active link state (all pages with same-page nav anchors)
  // ----------------------------
  const sectionIds = Array.from(document.querySelectorAll('.nav__links a[href^="#"]'))
    .map((a) => (a.getAttribute('href') || '').slice(1))
    .filter((id, index, arr) => id && arr.indexOf(id) === index);

  if (!sectionIds.length) {
    ['about', 'services-projects', 'portfolio', 'projects', 'contact'].forEach((id) => {
      if (document.getElementById(id)) sectionIds.push(id);
    });
  }

  const navLinks = sectionIds
    .map((id) => ({ id, a: $(`.nav__links a[href="#${id}"]`) }))
    .filter((x) => x.a);

  // ----------------------------
  // Rotating preview images (Home lists)
  // ----------------------------
  function getMediaPositionValue(item){
    if (!item || typeof item !== 'object') return '';
    return item.position || item.objectPosition || item.thumbPosition || item.coverPosition || item.mediaPosition || item.dataPosition || item['data-position'] || '';
  }

  function parseRotatingGallery(raw){
    if (!raw) return [];
    const trimmed = String(raw).trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => {
            if (typeof item === 'string') return { src: item, position: '' };
            if (!item || typeof item !== 'object') return null;
            const src = item.src || item.url || '';
            if (!src) return null;
            return { src, position: getMediaPositionValue(item) };
          }).filter(Boolean);
        }
      } catch (_) {}
    }

    return trimmed
      .split('||')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((src) => ({ src, position: '' }));
  }

  function applyRotatingFrame(img, frame){
    if (!img || !frame || !frame.src) return;
    img.src = frame.src;
    if (frame.position) img.style.objectPosition = frame.position;
    else img.style.removeProperty('object-position');
  }

  function initRotatingPreviews(){
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const previews = Array.from(document.querySelectorAll('[data-rotating-gallery]'));
    if (!previews.length) return;

    previews.forEach((img) => {
      const raw = img.getAttribute('data-rotating-gallery') || '';
      const frames = parseRotatingGallery(raw);
      if (!frames.length) return;

      if (frames[0] && frames[0].position) {
        img.style.objectPosition = frames[0].position;
      }

      if (reduceMotion || frames.length < 2 || img.dataset.rotatorReady === '1') return;
      img.dataset.rotatorReady = '1';
      let index = 0;
      window.setInterval(() => {
        index = (index + 1) % frames.length;
        applyRotatingFrame(img, frames[index]);
      }, 5000);
    });
  }

  initRotatingPreviews();
  document.addEventListener('DOMContentLoaded', initRotatingPreviews);
  window.addEventListener('load', initRotatingPreviews);
  window.addEventListener('bkvp:home-rendered', initRotatingPreviews);


  function initMediaPositioning(){
    const media = Array.from(document.querySelectorAll('[data-media-position], [data-position], [data-object-position]'));
    if (!media.length) return;

    media.forEach((el) => {
      const pos = (el.getAttribute('data-media-position') || el.getAttribute('data-position') || el.getAttribute('data-object-position') || '').trim();
      if (!pos) return;
      el.style.objectPosition = pos;
    });
  }

  initMediaPositioning();
  document.addEventListener('DOMContentLoaded', initMediaPositioning);
  window.addEventListener('load', initMediaPositioning);
  window.addEventListener('bkvp:home-rendered', initMediaPositioning);

  if (navLinks.length) {
    const setActiveNavLink = (id) => {
      navLinks.forEach((x) => x.a.classList.toggle('is-active', x.id === id));
    };

    const updateActiveNavByScroll = () => {
      const available = sectionIds
        .map((id) => ({ id, el: document.getElementById(id) }))
        .filter((x) => x.el);
      if (!available.length) return;

      const probeLine = Math.min(window.innerHeight * .46, 360);
      let activeId = available[0].id;

      available.forEach((item) => {
        const rect = item.el.getBoundingClientRect();
        if (rect.top <= probeLine && rect.bottom > 80) activeId = item.id;
      });

      const pageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
      if (pageBottom) activeId = available[available.length - 1].id;

      setActiveNavLink(activeId);
    };

    let tickingActiveNav = false;
    const requestActiveNavUpdate = () => {
      if (tickingActiveNav) return;
      tickingActiveNav = true;
      requestAnimationFrame(() => {
        updateActiveNavByScroll();
        tickingActiveNav = false;
      });
    };

    const observedSections = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((ent) => {
          if (!ent.isIntersecting) return;
          setActiveNavLink(ent.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 }
    );

    const observeNavSections = () => {
      sectionIds.forEach((id) => {
        const sec = document.getElementById(id);
        if (sec && !observedSections.has(sec)) {
          observedSections.add(sec);
          io.observe(sec);
        }
      });
      updateActiveNavByScroll();
    };

    observeNavSections();
    window.addEventListener('scroll', requestActiveNavUpdate, { passive: true });
    window.addEventListener('resize', requestActiveNavUpdate);
    document.addEventListener('bkvp:includes:done', observeNavSections);
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
  // Eye Photography FAQ: batch load questions on scroll
  // ----------------------------
  function initLazyEyeFaqs(){
    const blocks = Array.from(document.querySelectorAll('.eyeFaq:not([data-faq-lazy-ready="true"])'));
    if (!blocks.length) return;

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    blocks.forEach((faq) => {
      const items = Array.from(faq.querySelectorAll(':scope > details'));
      if (items.length <= 6) {
        faq.dataset.faqLazyReady = 'true';
        return;
      }

      faq.dataset.faqLazyReady = 'true';
      faq.classList.add('eyeFaq--lazy');

      const pageSize = 6;
      const scrollStepToLoad = 80;
      const bottomThreshold = 180;
      let rendered = 0;
      let loading = false;
      let lastLoadY = window.scrollY;

      const loader = document.createElement('div');
      loader.className = 'eyeFaqLoader';
      loader.setAttribute('aria-hidden', 'true');
      loader.hidden = true;
      loader.innerHTML = '<span></span><span></span><span></span>';

      items.forEach((item) => item.remove());
      faq.insertAdjacentElement('afterend', loader);

      function showLoader(){ loader.hidden = false; }
      function hideLoader(){ loader.hidden = true; }

      function isNearFaqEnd(){
        const rect = faq.getBoundingClientRect();
        return rect.bottom - window.innerHeight <= bottomThreshold;
      }

      function revealNew(nodes){
        if (reduce) {
          nodes.forEach((node) => node.classList.add('is-faq-visible'));
          return;
        }
        window.requestAnimationFrame(() => {
          nodes.forEach((node, index) => {
            node.style.transitionDelay = Math.min(index * 70, 350) + 'ms';
            node.classList.add('is-faq-visible');
          });
        });
      }

      async function renderNextBatch(initial){
        if (loading || rendered >= items.length) return;
        loading = true;
        if (!initial) showLoader();

        const fragment = document.createDocumentFragment();
        const nodes = [];
        const end = Math.min(rendered + pageSize, items.length);

        for (let i = rendered; i < end; i += 1) {
          const node = items[i];
          node.classList.add('eyeFaq__item');
          if (!reduce) node.classList.add('is-faq-new');
          fragment.appendChild(node);
          nodes.push(node);
        }

        faq.appendChild(fragment);
        rendered = end;
        revealNew(nodes);

        if (!initial) {
          await new Promise((resolve) => window.setTimeout(resolve, 520));
        }

        hideLoader();
        loading = false;
        lastLoadY = window.scrollY;

        if (rendered >= items.length) {
          window.removeEventListener('scroll', onScroll);
          loader.remove();
        }
      }

      function onScroll(){
        if (loading || rendered >= items.length) return;
        const moved = window.scrollY - lastLoadY;
        if (moved >= scrollStepToLoad && isNearFaqEnd()) {
          renderNextBatch(false);
        }
      }

      window.addEventListener('scroll', onScroll, { passive:true });
      renderNextBatch(true);
    });
  }

  initLazyEyeFaqs();
  document.addEventListener('DOMContentLoaded', initLazyEyeFaqs);
  window.addEventListener('load', initLazyEyeFaqs);

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
