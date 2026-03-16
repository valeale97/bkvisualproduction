(function(){
  'use strict';
  const lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
  async function inject(sel, url){
    const el = document.querySelector(sel);
    if (!el) return;
    try{
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return;
      el.innerHTML = await res.text();
    }catch(e){}
  }
  document.addEventListener('DOMContentLoaded', async ()=>{
    await inject('[data-include="contact"]', `/partials/contact.${lang}.html`);
    await inject('[data-include="footer"]', `/partials/footer.${lang}.html`);
    // Set copyright year
    document.querySelectorAll('#js-year').forEach(el=> {el.textContent =new Date().getFullYear();})

    // Notify other scripts (cookies, etc.) that async includes are now in the DOM.
    try{ document.dispatchEvent(new CustomEvent('bkvp:includes:done')); }catch(e){}
    // Re-render reCAPTCHA on injected forms if api already loaded
    try{
      if (window.grecaptcha && typeof window.BKVP_onRecaptchaLoad === 'function') window.BKVP_onRecaptchaLoad();
    }catch(e){}
  });
})();
