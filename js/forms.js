/*
  forms.js
  Front-end-only form UX + validation.

  Drop-in backend support:
    - Email endpoint: /send

  IMPORTANT:
  - If APPS_SCRIPT_WEBAPP_URL is not set, forms will show a config warning.
  - reCAPTCHA v2 needs RECAPTCHA_SITE_KEY + server-side verification.
*/

(function(){
  'use strict';

  // ====== CONFIG (replace these) ======
  const CONFIG = window.BKVP_CONFIG = {
    // Google reCAPTCHA v2 (Checkbox) TEST key so the widget renders out-of-the-box.
    // Replace with your real site key when you create it in Google reCAPTCHA.
    RECAPTCHA_SITE_KEY: '6LeeVZksAAAAAB9_3coQ-CWUqmMDA7HEBYkSA46b',
    APPS_SCRIPT_WEBAPP_URL: 'https://recaptcha-bk.bornadji1108.workers.dev'
  };

  const $ = (sel, root=document) => root.querySelector(sel);
  const CALL_HREF = 'tel:+385955984248';
  const CALL_DISPLAY = '+385 95 598 4248';

  function isHr(lang){
    return String(lang || '').toLowerCase().startsWith('hr');
  }

  function escapeHtml(value){
    return String(value ?? '')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function waitMinimum(startedAt, minimumMs){
    const elapsed = performance.now() - startedAt;
    if (elapsed < minimumMs) await delay(minimumMs - elapsed);
  }

  function ensureSubmitOverlay(lang){
    let overlay = document.getElementById('submitOverlay');
    const hr = isHr(lang || document.documentElement.lang || document.body.dataset.lang || 'en');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'submitOverlay';
      overlay.id = 'submitOverlay';
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
      overlay.innerHTML =
        '<div class="submitOverlay__backdrop"></div>' +
        '<div class="submitOverlay__panel" role="status" aria-live="polite">' +
          '<div class="submitOverlay__state submitOverlay__state--sending">' +
            '<div class="submitOverlay__ring submitOverlay__ring--sending">' +
              '<svg class="submitOverlay__svg submitOverlay__svg--sending" viewBox="0 0 120 120" aria-hidden="true">' +
                '<circle class="submitOverlay__track" cx="60" cy="60" r="50"></circle>' +
                '<circle class="submitOverlay__value submitOverlay__value--sending" cx="60" cy="60" r="50"></circle>' +
              '</svg>' +
              '<div class="submitOverlay__icon submitOverlay__icon--camera" aria-hidden="true">' +
                '<svg viewBox="0 0 64 64" fill="none">' +
                  '<path d="M18 22h8l3-5h9l3 5h5c5 0 8 3 8 8v17c0 5-3 8-8 8H18c-5 0-8-3-8-8V30c0-5 3-8 8-8Z" stroke="currentColor" stroke-width="3.4" stroke-linejoin="round"></path>' +
                  '<circle cx="32" cy="39" r="10.5" stroke="currentColor" stroke-width="3.4"></circle>' +
                  '<circle cx="47" cy="30" r="2.2" fill="currentColor"></circle>' +
                '</svg>' +
              '</div>' +
            '</div>' +
            '<div class="submitOverlay__dots" aria-hidden="true"><span></span><span></span><span></span></div>' +
            '<p class="submitOverlay__text js-overlaySendingText"></p>' +
          '</div>' +
          '<div class="submitOverlay__state submitOverlay__state--success">' +
            '<div class="submitOverlay__ring submitOverlay__ring--success">' +
              '<svg class="submitOverlay__svg submitOverlay__svg--success" viewBox="0 0 120 120" aria-hidden="true">' +
                '<circle class="submitOverlay__track submitOverlay__track--success" cx="60" cy="60" r="50"></circle>' +
                '<circle class="submitOverlay__value submitOverlay__value--success" cx="60" cy="60" r="50"></circle>' +
                '<path class="submitOverlay__check" d="M34 61L52 78L86 44"></path>' +
              '</svg>' +
            '</div>' +
            '<p class="submitOverlay__text js-overlaySuccessText"></p>' +
          '</div>' +
          '<div class="submitOverlay__state submitOverlay__state--error">' +
            '<div class="submitOverlay__ring submitOverlay__ring--error">' +
              '<svg class="submitOverlay__svg submitOverlay__svg--error" viewBox="0 0 120 120" aria-hidden="true">' +
                '<circle class="submitOverlay__track submitOverlay__track--error" cx="60" cy="60" r="50"></circle>' +
                '<circle class="submitOverlay__value submitOverlay__value--error" cx="60" cy="60" r="50"></circle>' +
                '<path class="submitOverlay__x submitOverlay__x--one" d="M42 42L78 78"></path>' +
                '<path class="submitOverlay__x submitOverlay__x--two" d="M78 42L42 78"></path>' +
              '</svg>' +
            '</div>' +
            '<p class="submitOverlay__text js-overlayErrorText"></p>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
    }

    const sendingText = overlay.querySelector('.js-overlaySendingText');
    const successText = overlay.querySelector('.js-overlaySuccessText');
    const errorText = overlay.querySelector('.js-overlayErrorText');
    if (sendingText) sendingText.textContent = hr ? 'Slanje poruke...' : 'Sending message...';
    if (successText) successText.textContent = hr ? 'Poruka je uspješno poslana!' : 'Message sent successfully!';
    if (errorText) errorText.textContent = hr ? 'Poruka nije poslana.' : 'Message was not sent.';

    return overlay;
  }

  function showSubmitOverlay(state, lang){
    const overlay = ensureSubmitOverlay(lang);
    if (!overlay) return;

    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    overlay.dataset.state = state;

    overlay.classList.remove('play-success', 'play-error');
    void overlay.offsetWidth;
    if (state === 'success') overlay.classList.add('play-success');
    if (state === 'error') overlay.classList.add('play-error');

    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');
  }

  function hideSubmitOverlay(){
    const overlay = document.getElementById('submitOverlay');
    if (!overlay) return;

    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.dataset.state = '';
    overlay.classList.remove('play-success', 'play-error');

    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');
  }

  function isConfigured(){
    return CONFIG.APPS_SCRIPT_WEBAPP_URL &&
          CONFIG.APPS_SCRIPT_WEBAPP_URL !== 'REPLACE_ME';
  }

  function setStatus(el, type, msg, options = {}){
    if (!el) return;

    const message = escapeHtml(msg);
    el.hidden = false;
    el.className = 'form-status ' + type;

    if (type === 'info') {
      el.innerHTML =
        '<span class="formState formState--loading">' +
          '<span class="formState__dots" aria-hidden="true"><span></span><span></span><span></span></span>' +
          '<span class="formState__text">' + message + '</span>' +
        '</span>';
      return;
    }

    if (type === 'success') {
      el.innerHTML =
        '<span class="formState formState--success">' +
          '<span class="formState__circle" aria-hidden="true">✓</span>' +
          '<span class="formState__text">' + message + '</span>' +
        '</span>';
      return;
    }

    if (type === 'error') {
      const call = options.showCall === false
        ? ''
        : ' <a class="formStatusCall" href="' + CALL_HREF + '">' + CALL_DISPLAY + '</a>';

      el.innerHTML =
        '<span class="formState formState--error">' +
          '<span class="formState__circle" aria-hidden="true">×</span>' +
          '<span class="formState__text">' + message + call + '</span>' +
        '</span>';
      return;
    }

    el.textContent = msg;
  }

  function clearStatus(el){
    if (!el) return;
    el.hidden = true;
    el.textContent = '';
  }

  function validEmail(v){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validPhone(v){
    return /^[0-9+\s().-]{6,24}$/.test(v.trim());
  }

  function setFieldInvalid(form, name){
    if (!form || !name) return;
    form.querySelectorAll('[aria-invalid="true"]').forEach((el)=>{
      el.removeAttribute('aria-invalid');
    });
    form.querySelectorAll('.field--invalid').forEach((el)=>el.classList.remove('field--invalid'));
    const field = form.querySelector('[name="' + name + '"]');
    if (field) {
      field.setAttribute('aria-invalid', 'true');
      const label = field.closest('.field');
      if (label) label.classList.add('field--invalid');
      const enhancedButton = field.dataset.enhancedSelect === 'true'
        ? field.parentElement?.querySelector('.customSelect__button')
        : null;
      const target = enhancedButton || field;
      try { target.focus({ preventScroll: false }); } catch (_) { target.focus(); }
    }
  }

  function clearFieldInvalid(form){
    if (!form) return;
    form.querySelectorAll('[aria-invalid="true"]').forEach((el)=>{
      el.removeAttribute('aria-invalid');
    });
    form.querySelectorAll('.field--invalid').forEach((el)=>el.classList.remove('field--invalid'));
  }

  function serialize(form){
    const data = {};
    new FormData(form).forEach((v,k)=>{ data[k] = String(v).trim(); });
    return data;
  }

  // ----- Contact: "other" modal -----
  function initOtherModal(lang){
    const select = $('#inquiry');
    const modal = $('#otherModal');
    const otherInput = $('#otherDetails');
    if (!select || !modal || !otherInput) return;

    const open = () => {
      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
      otherInput.focus();
    };

    const close = () => {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
      if (select) select.focus();
    };

    $('#otherClose')?.addEventListener('click', close);
    modal.addEventListener('click', (e)=>{
      if (e.target === modal) close();
    });

    document.addEventListener('keydown', (e)=>{
      if (!modal.hidden && e.key === 'Escape') close();
    });

    select.addEventListener('change', ()=>{
      if (select.value === 'other') {
        open();
      } else {
        otherInput.value = '';
      }
    });

    // Keep required only when visible
    const observer = new MutationObserver(()=>{
      otherInput.required = select.value === 'other';
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['hidden'] });
  }

  async function initContactForm(lang){
    document.addEventListener('submit', async (e) => {
      const form = e.target.closest('form[data-form="contact"]');
      if (!form) return;

      e.preventDefault();

      const hr = isHr(lang);
      const status = form.querySelector('#contactStatus, .form-status');
      const submitBtn = form.querySelector('button[type="submit"]');
      if (!status) return;

      clearStatus(status);

      if (!isConfigured()){
        setStatus(status,'error', hr
          ? 'Slanje trenutno nije moguće. Pokušajte ponovno ili nazovite.'
          : 'Sending is currently unavailable. Please try again or give us a call.'
        );
        return;
      }

      const data = serialize(form);
      clearFieldInvalid(form);

      const chronologicalChecks = [
        { name: 'name', invalid: !data.name, message: hr ? 'Unesite ime.' : 'Please enter your first name.' },
        { name: 'surname', invalid: !data.surname, message: hr ? 'Unesite prezime.' : 'Please enter your last name.' },
        { name: 'phone', invalid: !data.phone, message: hr ? 'Unesite broj telefona.' : 'Please enter your phone number.' },
        { name: 'phone', invalid: !!data.phone && !validPhone(data.phone), message: hr ? 'Unesite ispravan broj telefona.' : 'Please enter a valid phone number.' },
        { name: 'email', invalid: !data.email, message: hr ? 'Unesite email.' : 'Please enter your email.' },
        { name: 'email', invalid: !!data.email && !validEmail(data.email), message: hr ? 'Unesite ispravan email.' : 'Please enter a valid email.' },
        { name: 'country', invalid: !data.country, message: hr ? 'Unesite državu.' : 'Please enter your country.' },
        { name: 'need', invalid: !data.need, message: hr ? 'Odaberite kategoriju.' : 'Please choose a category.' },
        { name: 'message', invalid: !data.message, message: hr ? 'Unesite poruku.' : 'Please enter your message.' }
      ];

      const firstProblem = chronologicalChecks.find(item => item.invalid);
      if (firstProblem) {
        setFieldInvalid(form, firstProblem.name);
        setStatus(status, 'error', firstProblem.message, { showCall:false });
        return;
      }

      const token = window.grecaptcha
        ? window.grecaptcha.getResponse(
            form.dataset.recaptchaId ? Number(form.dataset.recaptchaId) : undefined
          )
        : '';

      if (!token) {
        setStatus(
          status,
          'error',
          hr ? 'Potvrdite reCAPTCHA.' : 'Please complete reCAPTCHA.',
          { showCall:false }
        );
        return;
      }

      const startedAt = performance.now();
      if (submitBtn) submitBtn.disabled = true;
      clearStatus(status);
      showSubmitOverlay('sending', lang);

      try {
        const res = await fetch(CONFIG.APPS_SCRIPT_WEBAPP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'send',
            payload: data,
            recaptchaToken: token
          })
        });

        const text = await res.text();
        let json = {};

        try { json = text ? JSON.parse(text) : {}; } catch (e) {}

        if (!res.ok || json.ok === false) {
          throw new Error(
            json.resend_response?.message ||
            json.resend_response?.error ||
            json.details?.message ||
            json.details ||
            json.error ||
            text ||
            `HTTP ${res.status}`
          );
        }

        await waitMinimum(startedAt, 2000);

        showSubmitOverlay('success', lang);
        await delay(1700);
        hideSubmitOverlay();
        clearStatus(status);

        form.reset();
        window.setTimeout(()=>{
          form.querySelectorAll('select[data-enhanced-select="true"]').forEach((sel)=>{
            sel.dispatchEvent(new Event('change', { bubbles:true }));
          });
        }, 0);
        clearFieldInvalid(form);

        if (window.grecaptcha) {
          const widgetId = form.dataset.recaptchaId ? Number(form.dataset.recaptchaId) : undefined;
          if (widgetId !== undefined) window.grecaptcha.reset(widgetId);
        }
      } catch (err) {
        console.error('Contact form error:', err);
        await waitMinimum(startedAt, 2000);
        showSubmitOverlay('error', lang);
        await delay(1700);
        hideSubmitOverlay();
        setStatus(status, 'error', hr
          ? 'Poruka nije poslana. Pokušajte ponovno ili nas nazovite.'
          : 'Message was not sent. Please try again or give us a call.'
        );
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }


  function enhanceSelect(select){
    if (!select || select.dataset.enhancedSelect === 'true') return;
    if (select.multiple) return;

    const label = select.closest('.field');
    const custom = document.createElement('div');
    custom.className = 'customSelect';
    custom.dataset.name = select.name || '';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'customSelect__button';
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');

    const value = document.createElement('span');
    value.className = 'customSelect__value';

    const chev = document.createElement('span');
    chev.className = 'customSelect__chevron';
    chev.setAttribute('aria-hidden', 'true');

    const list = document.createElement('ul');
    const listId = 'custom-select-' + Math.random().toString(36).slice(2, 10);
    list.id = listId;
    list.className = 'customSelect__list';
    list.setAttribute('role', 'listbox');
    button.setAttribute('aria-controls', listId);

    const options = Array.from(select.options);

    function optionLabel(opt){
      return (opt && opt.textContent ? opt.textContent.trim() : '') || '';
    }

    function sync(){
      const selected = select.selectedOptions && select.selectedOptions[0]
        ? select.selectedOptions[0]
        : options.find(opt => opt.selected) || options[0];
      value.textContent = optionLabel(selected) || 'Select';
      const placeholder = !select.value || (selected && selected.disabled && !selected.value);
      custom.classList.toggle('is-placeholder', !!placeholder);
      list.querySelectorAll('.customSelect__option').forEach((item)=>{
        const same = item.dataset.value === String(select.value || '');
        item.classList.toggle('is-selected', same);
        item.setAttribute('aria-selected', same ? 'true' : 'false');
      });
    }

    function close(){
      custom.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    }

    function open(){
      document.querySelectorAll('.customSelect.is-open').forEach((el)=>{
        if (el !== custom) {
          el.classList.remove('is-open');
          el.querySelector('.customSelect__button')?.setAttribute('aria-expanded','false');
        }
      });
      custom.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
      const chosen = list.querySelector('.customSelect__option.is-selected:not([aria-disabled="true"])') || list.querySelector('.customSelect__option:not([aria-disabled="true"])');
      if (chosen) chosen.scrollIntoView({ block:'nearest' });
    }

    function choose(item){
      if (!item || item.getAttribute('aria-disabled') === 'true') return;
      select.value = item.dataset.value || '';
      select.dispatchEvent(new Event('change', { bubbles:true }));
      select.dispatchEvent(new Event('input', { bubbles:true }));
      if (label) label.classList.remove('field--invalid');
      select.removeAttribute('aria-invalid');
      sync();
      close();
      button.focus();
    }

    options.forEach((opt, index)=>{
      const item = document.createElement('li');
      item.className = 'customSelect__option';
      item.setAttribute('role', 'option');
      item.dataset.value = opt.value || '';
      item.dataset.index = String(index);
      item.textContent = optionLabel(opt);
      if (opt.disabled) item.setAttribute('aria-disabled', 'true');
      item.addEventListener('click', ()=>choose(item));
      list.appendChild(item);
    });

    button.appendChild(value);
    button.appendChild(chev);
    custom.appendChild(button);
    custom.appendChild(list);
    select.classList.add('enhancedSelectNative');
    select.dataset.enhancedSelect = 'true';
    select.insertAdjacentElement('afterend', custom);
    sync();

    button.addEventListener('click', ()=>{
      custom.classList.contains('is-open') ? close() : open();
    });

    button.addEventListener('keydown', (e)=>{
      const items = Array.from(list.querySelectorAll('.customSelect__option:not([aria-disabled="true"])'));
      const current = list.querySelector('.customSelect__option.is-active') || list.querySelector('.customSelect__option.is-selected:not([aria-disabled="true"])');
      let idx = current ? items.indexOf(current) : -1;

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!custom.classList.contains('is-open')) open();
        idx = e.key === 'ArrowDown' ? Math.min(items.length - 1, idx + 1) : Math.max(0, idx - 1);
        items.forEach(item => item.classList.remove('is-active'));
        if (items[idx]) {
          items[idx].classList.add('is-active');
          items[idx].scrollIntoView({ block:'nearest' });
        }
      }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!custom.classList.contains('is-open')) {
          open();
        } else {
          choose(list.querySelector('.customSelect__option.is-active') || list.querySelector('.customSelect__option.is-selected:not([aria-disabled="true"])'));
        }
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    });

    select.addEventListener('change', sync);
  }

  function initEnhancedSelects(root=document){
    root.querySelectorAll('.form select:not([data-enhanced-select="true"])').forEach(enhanceSelect);
    if (!document.documentElement.dataset.customSelectOutsideReady) {
      document.documentElement.dataset.customSelectOutsideReady = 'true';
      document.addEventListener('click', (e)=>{
        if (e.target.closest('.customSelect')) return;
        document.querySelectorAll('.customSelect.is-open').forEach((el)=>{
          el.classList.remove('is-open');
          el.querySelector('.customSelect__button')?.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  function initMapFallbacks(){
    const forceFallback = /Instagram|FBAN|FBAV|FB_IAB|Line\/|TikTok/i.test(navigator.userAgent || '');
    document.querySelectorAll('[data-map-fallback]').forEach((wrap)=>{
      if (wrap.dataset.mapFallbackInit === 'true') return;
      wrap.dataset.mapFallbackInit = 'true';
      const iframe = wrap.querySelector('iframe');
      if (!iframe) return;
      let loaded = false;
      const useFallback = () => {
        if (!loaded) wrap.classList.add('projectMap--fallbackActive');
      };
      iframe.addEventListener('load', ()=>{
        loaded = true;
        wrap.classList.add('projectMap--loaded');
        wrap.classList.remove('projectMap--fallbackActive');
      }, { once:true });
      iframe.addEventListener('error', useFallback, { once:true });
      if (forceFallback) {
        wrap.classList.add('projectMap--fallbackActive');
        return;
      }
      window.setTimeout(useFallback, 3500);
    });
  }

  function getSiteKey(){
    const meta = document.querySelector('meta[name="recaptcha-site-key"]');
    const m = meta && meta.content ? meta.content.trim() : '';
    if (m && m !== 'RECAPTCHA_SITE_KEY' && m !== 'REPLACE_ME') return m;

    const c = CONFIG && CONFIG.RECAPTCHA_SITE_KEY ? String(CONFIG.RECAPTCHA_SITE_KEY).trim() : '';
    if (c && c !== 'RECAPTCHA_SITE_KEY' && c !== 'REPLACE_ME') return c;

    return '';
  }

  function renderRecaptcha(){
    if (!window.grecaptcha || typeof window.grecaptcha.render !== 'function') {
      console.error('grecaptcha.render is unavailable');
      return;
    }

    const sitekey = getSiteKey();
    if (!sitekey) return;

    document.querySelectorAll('[data-recaptcha]:not(.js-recaptcha)').forEach((el)=>{
      el.classList.add('js-recaptcha');
    });

    document.querySelectorAll('.js-recaptcha').forEach((el)=>{
      if (el.dataset.rendered === 'true') return;
      try{
        const id = window.grecaptcha.render(el, { sitekey });
        el.dataset.rendered = 'true';
        const form = el.closest('form');
        if (form) form.dataset.recaptchaId = String(id);
      }catch(e){
        console.error('reCAPTCHA render failed:', e);
      }
    });
  }

  // Called by the Google reCAPTCHA script when loaded (see api.js?onload=...&render=explicit)
  window.BKVP_onRecaptchaLoad = function(){
    try{ renderRecaptcha(); }catch(e){}
  };

  // ----- public init -----
  document.addEventListener('DOMContentLoaded', ()=>{
    const lang = document.documentElement.lang || 'en';
    initOtherModal(lang);
    initContactForm(lang);
    initEnhancedSelects(document);
    initMapFallbacks();

    document.addEventListener('bkvp:includes:done', ()=>{
      initEnhancedSelects(document);
      initMapFallbacks();
    });

    try{ renderRecaptcha(); }catch(e){}
  });
})();
