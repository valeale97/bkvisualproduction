/*
  forms.js
  Front-end-only form UX + validation.

  Drop-in backend (Google Apps Script) support:
    - Email endpoint: /send
    - Calendar endpoint: /availability and /book

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
    APPS_SCRIPT_WEBAPP_URL: 'https://recaptcha-bk.bornadji1108.workers.dev',
    CALENDAR_ID: 'REPLACE_ME',
    WORKING_HOURS: { start: '09:00', end: '17:00' },
    BREAKS: [ { start: '12:00', end: '13:00' } ],
    SLOT_MINUTES: 30
  };

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function isConfigured(){
    return CONFIG.APPS_SCRIPT_WEBAPP_URL &&
          CONFIG.APPS_SCRIPT_WEBAPP_URL !== 'REPLACE_ME';
  }

  function setStatus(el, type, msg){
    el.hidden = false;
    el.className = 'form-status ' + type;
    el.textContent = msg;
  }

  function clearStatus(el){
    el.hidden = true;
    el.textContent = '';
  }

  function validEmail(v){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validPhone(v){
    return /^[0-9+\s-]{6,20}$/.test(v.trim());
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

  // ----- Booking time rules -----
  function timeToMinutes(t){
    const [h,m] = t.split(':').map(Number);
    return h*60+m;
  }

  function inRange(min, start, end){
    return min >= start && min < end;
  }

  function isInBreak(minutes){
    return CONFIG.BREAKS.some(b=>inRange(minutes, timeToMinutes(b.start), timeToMinutes(b.end)));
  }

  function generateTimeOptions(){
    const start = timeToMinutes(CONFIG.WORKING_HOURS.start);
    const end = timeToMinutes(CONFIG.WORKING_HOURS.end);
    const options = [];
    for (let m = start; m <= end - CONFIG.SLOT_MINUTES; m += CONFIG.SLOT_MINUTES){
      if (isInBreak(m)) continue;
      const hh = String(Math.floor(m/60)).padStart(2,'0');
      const mm = String(m%60).padStart(2,'0');
      options.push(`${hh}:${mm}`);
    }
    return options;
  }

  async function fetchTakenSlots(dateStr){
    if (!isConfigured()) return [];
    try{
      const url = new URL(CONFIG.APPS_SCRIPT_WEBAPP_URL);
      url.searchParams.set('action','availability');
      url.searchParams.set('date', dateStr);
      url.searchParams.set('calendarId', CONFIG.CALENDAR_ID);
      const res = await fetch(url.toString(), { method:'GET' });
      if (!res.ok) return [];
      const json = await res.json();
      return Array.isArray(json.taken) ? json.taken : [];
    }catch{
      return [];
    }
  }

  async function initBookingForm(lang){
    const form = $('#bookingForm');
    if (!form) return;

    const status = $('#bookingStatus');
    const timeSelect = $('#termin_time');
    const dateInput = $('#termin_date');

    // Populate time options
    if (timeSelect){
      timeSelect.innerHTML = '';
      for (const t of generateTimeOptions()){
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        timeSelect.appendChild(opt);
      }
    }

    async function refreshTaken(){
      if (!dateInput || !timeSelect) return;
      const dateStr = dateInput.value;
      if (!dateStr) return;

      const taken = await fetchTakenSlots(dateStr);
      const takenSet = new Set(taken);

      [...timeSelect.options].forEach(o=>{
        o.disabled = takenSet.has(o.value);
      });

      // If current is disabled, pick the first enabled
      if (timeSelect.value && takenSet.has(timeSelect.value)){
        const first = [...timeSelect.options].find(o=>!o.disabled);
        if (first) timeSelect.value = first.value;
      }

      // Show note if backend not configured
      if (!isConfigured()){
        setStatus(status, 'warn', lang === 'hr'
          ? 'Slanje rezervacije zahtijeva konfiguraciju (Apps Script / reCAPTCHA).'
          : 'Booking submission requires configuration (Apps Script / reCAPTCHA).'
        );
      } else {
        clearStatus(status);
      }
    }

    dateInput?.addEventListener('change', refreshTaken);
    await refreshTaken();

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      clearStatus(status);

      if (!isConfigured()){
        setStatus(status, 'warn', lang === 'hr'
          ? 'Slanje zahtjeva nije moguće dok se ne postavi Apps Script (pogledaj /server/apps-script/README.txt).'
          : 'Submission is disabled until Apps Script is configured (see /server/apps-script/README.txt).'
        );
        return;
      }

      const data = serialize(form);
      if (!validEmail(data.email)){
        setStatus(status,'error', lang==='hr' ? 'Unesite ispravan email.' : 'Please enter a valid email.');
        return;
      }
      if (data.phone && !validPhone(data.phone)){
        setStatus(status,'error', lang==='hr' ? 'Unesite ispravan broj telefona.' : 'Please enter a valid phone number.');
        return;
      }
      if (!data.termin_date || !data.termin_time){
        setStatus(status,'error', lang==='hr' ? 'Odaberite datum i vrijeme.' : 'Choose a date and time.');
        return;
      }

      // Basic reCAPTCHA token capture (v2 checkbox)
      const token = window.grecaptcha ? window.grecaptcha.getResponse(form.dataset.recaptchaId ? Number(form.dataset.recaptchaId) : undefined) : '';
      if (!token){
        setStatus(status,'error', lang==='hr' ? 'Potvrdite reCAPTCHA.' : 'Please complete reCAPTCHA.');
        return;
      }

      try{
        setStatus(status,'info', lang==='hr' ? 'Slanje...' : 'Sending...');
        const res = await fetch(CONFIG.APPS_SCRIPT_WEBAPP_URL, {
          method:'POST',
          headers:{ 'Content-Type':'application/json' },
          body: JSON.stringify({ action:'send', payload: data, recaptchaToken: token })
        });

        const text = await res.text();
        let json = {};
        try {
          json = text ? JSON.parse(text) : {};
        } catch (e) {}

        if (!res.ok || json.ok === false) {
          throw new Error(
            json.resend_response?.message ||
            json.details?.message ||
            json.details ||
            json.error ||
            text ||
            `HTTP ${res.status}`
          );
        }

        setStatus(status,'success', lang==='hr' ? 'Poruka poslana! Javit ćemo se uskoro.' : 'Message sent! We’ll get back soon.');
        form.reset();
        if (window.grecaptcha) window.grecaptcha.reset();
      }catch(err){
        console.error('Contact form error:', err);
        setStatus(
          status,
          'error',
          err && err.message
            ? err.message
            : (lang==='hr'
                ? 'Greška pri slanju. Pokušajte ponovno.'
                : 'Failed to send. Please try again.')
        );
      }
    });
  }

  async function initContactForm(lang){
    const form = $('#contactForm');
    if (!form) return;
    const status = $('#contactStatus');

    if (!isConfigured()){
      setStatus(status, 'warn', lang === 'hr'
        ? 'Slanje poruke zahtijeva konfiguraciju (Apps Script / reCAPTCHA).'
        : 'Form submission requires configuration (Apps Script / reCAPTCHA).'
      );
    }

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      clearStatus(status);

      if (!isConfigured()){
        setStatus(status,'warn', lang==='hr'
          ? 'Slanje nije moguće dok se ne postavi Apps Script (pogledaj /server/apps-script/README.txt).'
          : 'Submission is disabled until Apps Script is configured (see /server/apps-script/README.txt).'
        );
        return;
      }

      const data = serialize(form);
      if (!data.name || !data.surname){
        setStatus(status,'error', lang==='hr' ? 'Unesite ime i prezime.' : 'Please enter your name and surname.');
        return;
      }
      if (!validEmail(data.email)){
        setStatus(status,'error', lang==='hr' ? 'Unesite ispravan email.' : 'Please enter a valid email.');
        return;
      }
      if (data.phone && !validPhone(data.phone)){
        setStatus(status,'error', lang==='hr' ? 'Unesite ispravan broj telefona.' : 'Please enter a valid phone number.');
        return;
      }
      const inquiry = data.inquiry || data.topic || data.need || '';
      if (inquiry === 'other' && !data.other_details){
        setStatus(status,'error', lang==='hr' ? 'Opišite što trebate (Other).' : 'Please describe what you need (Other).');
        return;
      }

      const token = window.grecaptcha ? window.grecaptcha.getResponse(form.dataset.recaptchaId ? Number(form.dataset.recaptchaId) : undefined) : '';
      if (!token){
        setStatus(status,'error', lang==='hr' ? 'Potvrdite reCAPTCHA.' : 'Please complete reCAPTCHA.');
        return;
      }

      try{
        setStatus(status,'info', lang==='hr' ? 'Slanje...' : 'Sending...');
        const res = await fetch(CONFIG.APPS_SCRIPT_WEBAPP_URL, {
          method:'POST',
          headers:{ 'Content-Type':'application/json' },
          body: JSON.stringify({ action:'send', payload: data, recaptchaToken: token })
        });
        const text = await res.text();
        let json = {};
        try {
          json = text ? JSON.parse(text) : {};
        } catch (e) {}

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
        setStatus(status,'success', lang==='hr' ? 'Poruka poslana! Javit ćemo se uskoro.' : 'Message sent! We’ll get back soon.');
        form.reset();
        if (window.grecaptcha) window.grecaptcha.reset();
      }catch(err){
        console.error('Contact form error:', err);
        setStatus(
          status,
          'error',
          err && err.message
            ? err.message
            : (lang==='hr'
                ? 'Greška pri slanju. Pokušajte ponovno.'
                : 'Failed to send. Please try again.')
        );
      }
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
    initBookingForm(lang);

    // If reCAPTCHA is already loaded, render immediately.
    try{ renderRecaptcha(); }catch(e){}
  });
})();
