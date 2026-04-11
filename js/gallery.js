/*
  gallery.js

  Unified media grid + lightbox for:
  - Portfolio category pages: <body data-category="weddings">
  - Project pages: <body data-project="wedding-film">

  Data source: /js/data.js (window.BKVP_DATA)

  Features:
  - Renders thumbnails (images + videos)
  - Click thumbnail -> opens large viewer (lightbox)
  - Prev/Next controls
  - Keyboard: Esc / Left / Right
  - Swipe on mobile
*/

(function(){
  'use strict';

  const $ = (sel, root=document) => root.querySelector(sel);

  const root = document.body;
  if (!root || !root.dataset) return;

  const lang = root.dataset.lang || document.documentElement.lang || 'en';
  const category = root.dataset.category;
  const projectId = root.dataset.project;

  const store = window.BKVP_DATA;
  if (!store) return;

  // Resolve items
  let title = '';
  let desc = '';
  let items = [];

  if (category && store.portfolio && store.portfolio[category]) {
    const c = store.portfolio[category];

    title = (c.title && (c.title[lang] || c.title.en)) || '';
    desc = (c.desc && (c.desc[lang] || c.desc.en)) || '';

    items = Array.isArray(c.items) ? c.items.slice() : [];
  } else if (projectId && store.projects && store.projects[projectId]) {
    const p = store.projects[projectId];

    title = (p.title && (p.title[lang] || p.title.en)) || '';
    desc = (p.description && (p.description[lang] || p.description.en)) || '';

    if (Array.isArray(p.items) && p.items.length) {
      items = p.items.slice();
    } else {
      const derived = [];
      const fallbackThumb = p.heroPoster || ''; 

      const normalizeVideoItem = (video) => {
        if (!video) return null;

        if (typeof video === 'string') {
          return {
            type: 'video',
            src: video,
            thumb: fallbackThumb,
            alt: title || 'Video'
          };
        }

        const src = video.url || video.src || '';
        if (!src) return null;

        return {
          type: 'video',
          src,
          thumb: video.thumb || fallbackThumb,
          alt: video.alt || title || 'Video'
        };
      };

      const normalizeImageItem = (image) => {
        if (!image) return null;

        if (typeof image === 'string') {
          return {
            type: 'image',
            src: image,
            alt: title || 'Image'
          };
        }

        const src = image.url || image.src || '';
        if (!src) return null;

        return {
          type: 'image',
          src,
          alt: image.alt || title || 'Image'
        };
      };

      const alreadyHasVideo = (src) =>
        derived.some((item) => item.type === 'video' && item.src === src);

      // 1) Add videos[] first
      if (Array.isArray(p.videos) && p.videos.length) {
        p.videos.forEach((video) => {
          const normalized = normalizeVideoItem(video);
          if (!normalized) return;
          if (alreadyHasVideo(normalized.src)) return;
          derived.push(normalized);
        });
      }

      // 2) Fallback to heroVideo only if videos[] is missing/empty
      else if (Array.isArray(p.heroVideo) && p.heroVideo.length) {
        p.heroVideo.forEach((video) => {
          const normalized = normalizeVideoItem(video);
          if (!normalized) return;
          if (alreadyHasVideo(normalized.src)) return;
          derived.push(normalized);
        });
      } else if (p.heroVideo) {
        const normalizedHero = normalizeVideoItem(p.heroVideo);
        if (normalizedHero && !alreadyHasVideo(normalizedHero.src)) {
          derived.push(normalizedHero);
        }
      }

      // 3) Add gallery images
      if (Array.isArray(p.gallery) && p.gallery.length) {
        p.gallery.forEach((image) => {
          const normalized = normalizeImageItem(image);
          if (!normalized) return;
          derived.push(normalized);
        });
      }

      items = derived;
    }
  } else {
    return; // Not a gallery/project page
  }

  // Wire title/description if present
  const titleEl = $('#js-category-title') || $('#js-gallery-title') || $('#js-project-title');
  if (titleEl && title) titleEl.textContent = title;
  // const descEl = $('#js-project-desc') || $('#js-gallery-desc') || $('#js-category-desc');
  // if (descEl && desc) descEl.textContent = desc;

  const descEl = $('#js-project-desc') || $('#js-gallery-desc') || $('#js-category-desc');

  if (descEl && desc) {
    // Add the justified-text class
    descEl.classList.add('justified-text');
    
    // Set the text content
    descEl.textContent = desc;
  }

  // const grid = $('#js-grid') || $('#js-gallery-grid');
  // if (!grid) return;
  // grid.innerHTML = '';

  // // Render thumbnails
  // items.forEach((item, idx) => {
  //   const btn = document.createElement('button');
  //   btn.type = 'button';
  //   btn.className = 'thumb';
  //   btn.dataset.index = String(idx);
  //   btn.setAttribute('aria-label', (lang === 'hr' ? 'Otvori medij' : 'Open media') + ' ' + (idx + 1));

  //   if (item.type === 'video'){
  //     const poster = item.thumb || '/assets/img/logo.jpg';
  //     btn.innerHTML = `
  //       <img src="${escapeHtml(poster)}" alt="${escapeHtml(item.alt || '')}" loading="lazy" />
  //       <span class="badge" aria-hidden="true">VIDEO</span>
  //     `;
  //   } else {
  //     const thumb = item.thumb || item.src;
  //     btn.innerHTML = `<img src="${escapeHtml(thumb)}" alt="${escapeHtml(item.alt || '')}" loading="lazy" />`;
  //   }
  //   grid.appendChild(btn);
  // });

  // // Ensure correct grid class for CSS
  // if (!grid.classList.contains('galleryGrid')) grid.classList.add('galleryGrid');

//   const grid = $('#js-grid') || $('#js-gallery-grid');
//   if (!grid) return;
//   grid.innerHTML = '';

//   // Ensure correct grid class for CSS
//   if (!grid.classList.contains('galleryGrid')) grid.classList.add('galleryGrid');

//   const PAGE_SIZE = 6;
//   let renderedCount = 0;
//   let isBatchLoading = false;
//   let observer = null;

//   function createThumb(item, idx) {
//     const btn = document.createElement('button');
//     btn.type = 'button';
//     btn.className = 'thumb';
//     btn.dataset.index = String(idx);
//     btn.setAttribute(
//       'aria-label',
//       (lang === 'hr' ? 'Otvori medij' : 'Open media') + ' ' + (idx + 1)
//     );

//     if (item.type === 'video') {
//       const poster = item.thumb || '/assets/img/logo.jpg';
//       btn.innerHTML = `
//         <img
//           src="${escapeHtml(poster)}"
//           alt="${escapeHtml(item.alt || '')}"
//           loading="lazy"
//           decoding="async"
//         />
//         <span class="badge" aria-hidden="true">VIDEO</span>
//       `;
//     } else {
//       const thumb = item.thumb || item.src;
//       btn.innerHTML = `
//         <img
//           src="${escapeHtml(thumb)}"
//           alt="${escapeHtml(item.alt || '')}"
//           loading="lazy"
//           decoding="async"
//         />
//       `;
//     }

//     return btn;
//   }

//   const loader = document.createElement('div');
//   loader.className = 'galleryLoader';
//   loader.setAttribute('aria-hidden', 'true');
//   loader.style.display = 'none';
//   loader.innerHTML = `
//     <span></span>
//     <span></span>
//     <span></span>
//   `;

//   const sentinel = document.createElement('div');
//   sentinel.className = 'gallerySentinel';
//   sentinel.setAttribute('aria-hidden', 'true');

//   grid.insertAdjacentElement('afterend', loader);
//   loader.insertAdjacentElement('afterend', sentinel);

//   function showLoader() {
//     loader.style.display = 'flex';
//   }

//   function hideLoader() {
//     loader.style.display = 'none';
//   }

//   function waitForBatchImages(images) {
//     return new Promise((resolve) => {
//       if (!images.length) {
//         resolve();
//         return;
//       }

//       let remaining = images.length;
//       let finished = false;

//       const done = () => {
//         if (finished) return;
//         remaining -= 1;
//         if (remaining <= 0) {
//           finished = true;
//           clearTimeout(timer);
//           resolve();
//         }
//       };

//       const timer = setTimeout(() => {
//         if (finished) return;
//         finished = true;
//         resolve();
//       }, 5000);

//       images.forEach((img) => {
//         if (img.complete) {
//           done();
//           return;
//         }

//         const onDone = () => {
//           img.removeEventListener('load', onDone);
//           img.removeEventListener('error', onDone);
//           done();
//         };

//         img.addEventListener('load', onDone, { once: true });
//         img.addEventListener('error', onDone, { once: true });
//       });
//     });
//   }

//   async function renderNextBatch() {
//   if (isBatchLoading) return;
//   if (renderedCount >= items.length) return;

//   isBatchLoading = true;
//   showLoader();

//   const loaderStartedAt = performance.now();

//   const fragment = document.createDocumentFragment();
//   const batchImages = [];
//   const end = Math.min(renderedCount + PAGE_SIZE, items.length);

//   for (let i = renderedCount; i < end; i++) {
//     const thumbNode = createThumb(items[i], i);
//     const img = thumbNode.querySelector('img');
//     if (img) batchImages.push(img);
//     fragment.appendChild(thumbNode);
//   }

//   grid.appendChild(fragment);
//   renderedCount = end;

//   await waitForBatchImages(batchImages);

//   // keep loader visible for at least 500ms
//   const elapsed = performance.now() - loaderStartedAt;
//   const remaining = Math.max(0, 1000 - elapsed);

//   if (remaining > 0) {
//     await new Promise((resolve) => setTimeout(resolve, remaining));
//   }

//   hideLoader();
//   isBatchLoading = false;

//   if (renderedCount >= items.length) {
//     if (observer) observer.disconnect();
//     return;
//   }

//   const rect = sentinel.getBoundingClientRect();
//   if (rect.top <= window.innerHeight + 300) {
//     renderNextBatch();
//   }
// }

//   if ('IntersectionObserver' in window) {
//     observer = new IntersectionObserver((entries) => {
//       for (const entry of entries) {
//         if (entry.isIntersecting) {
//           renderNextBatch();
//           break;
//         }
//       }
//     }, {
//       root: null,
//       rootMargin: '300px 0px',
//       threshold: 0
//     });

//     observer.observe(sentinel);
//   } else {
//     window.addEventListener('scroll', fallbackScrollCheck, { passive: true });
//     window.addEventListener('resize', fallbackScrollCheck);
//   }

//   // initial load
//   renderNextBatch();

const grid = $('#js-grid') || $('#js-gallery-grid');
if (!grid) return;
grid.innerHTML = '';

// Ensure correct grid class for CSS
if (!grid.classList.contains('galleryGrid')) grid.classList.add('galleryGrid');

const PAGE_SIZE = 6;
const SCROLL_STEP_TO_LOAD = 160; // load next batch after user scrolls this much downward

let renderedCount = 0;
let isBatchLoading = false;
let lastLoadScrollY = window.scrollY;

function createThumb(item, idx) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'thumb';
  btn.dataset.index = String(idx);
  btn.setAttribute(
    'aria-label',
    (lang === 'hr' ? 'Otvori medij' : 'Open media') + ' ' + (idx + 1)
  );

  if (item.type === 'video') {
    const poster = item.thumb || '/assets/img/logo.jpg';
    btn.innerHTML = `
      <img
        src="${escapeHtml(poster)}"
        alt="${escapeHtml(item.alt || '')}"
        loading="lazy"
        decoding="async"
      />
      <span class="badge" aria-hidden="true">VIDEO</span>
    `;
  } else {
    const thumb = item.thumb || item.src;
    btn.innerHTML = `
      <img
        src="${escapeHtml(thumb)}"
        alt="${escapeHtml(item.alt || '')}"
        loading="lazy"
        decoding="async"
      />
    `;
  }

  return btn;
}

const loader = document.createElement('div');
loader.className = 'galleryLoader';
loader.setAttribute('aria-hidden', 'true');
loader.style.display = 'none';
loader.innerHTML = `
  <span></span>
  <span></span>
  <span></span>
`;

grid.insertAdjacentElement('afterend', loader);

function showLoader() {
  loader.style.display = 'flex';
}

function hideLoader() {
  loader.style.display = 'none';
}

function waitForBatchImages(images) {
  return new Promise((resolve) => {
    if (!images.length) {
      resolve();
      return;
    }

    let remaining = images.length;
    let finished = false;

    const done = () => {
      if (finished) return;
      remaining -= 1;
      if (remaining <= 0) {
        finished = true;
        clearTimeout(timer);
        resolve();
      }
    };

    const timer = setTimeout(() => {
      if (finished) return;
      finished = true;
      resolve();
    }, 1200);

    images.forEach((img) => {
      if (img.complete) {
        done();
        return;
      }

      const onDone = () => {
        img.removeEventListener('load', onDone);
        img.removeEventListener('error', onDone);
        done();
      };

      img.addEventListener('load', onDone, { once: true });
      img.addEventListener('error', onDone, { once: true });
    });
  });
}

async function renderNextBatch() {
  if (isBatchLoading) return;
  if (renderedCount >= items.length) return;

  isBatchLoading = true;
  showLoader();

  const loaderStartedAt = performance.now();

  const fragment = document.createDocumentFragment();
  const batchImages = [];
  const end = Math.min(renderedCount + PAGE_SIZE, items.length);

  for (let i = renderedCount; i < end; i++) {
    const thumbNode = createThumb(items[i], i);
    const img = thumbNode.querySelector('img');
    if (img) batchImages.push(img);
    fragment.appendChild(thumbNode);
  }

  grid.appendChild(fragment);
  renderedCount = end;

  await waitForBatchImages(batchImages);

  const elapsed = performance.now() - loaderStartedAt;
  const remaining = Math.max(0, 1000 - elapsed);

  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }

  hideLoader();
  isBatchLoading = false;

  // reset scroll checkpoint after each successful load
  lastLoadScrollY = window.scrollY;

  if (renderedCount >= items.length) {
    window.removeEventListener('scroll', handleGalleryScroll);
  }
}

function handleGalleryScroll() {
  if (isBatchLoading) return;
  if (renderedCount >= items.length) return;

  const currentY = window.scrollY;
  const scrolledDownSinceLastLoad = currentY - lastLoadScrollY;

  if (scrolledDownSinceLastLoad >= SCROLL_STEP_TO_LOAD) {
    renderNextBatch();
  }
}

window.addEventListener('scroll', handleGalleryScroll, { passive: true });

// initial load
renderNextBatch();

  // Lightbox markup that matches styles.css
  let lb = $('#lightbox');
  if (!lb){
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox';
    lb.setAttribute('aria-hidden','true');
    lb.innerHTML = `
      <div class="lightbox__inner" role="dialog" aria-modal="true" aria-label="Media viewer">
        <div class="lightbox__top">
          <button class="lbBtn" type="button" id="lb-close" aria-label="Close">×</button>
          <div style="display:flex;gap:.5rem">
            <button class="lbBtn" type="button" id="lb-prev" aria-label="Previous">‹</button>
            <button class="lbBtn" type="button" id="lb-next" aria-label="Next">›</button>
          </div>
        </div>
        <div class="lightbox__stage">
          <div class="lightbox__media" id="lightbox-media"></div>
        </div>
        <div class="lightbox__bottom">
          <p class="muted" id="lb-caption" style="margin:0"></p>
          <p class="counter muted" id="lb-counter" style="margin:0"></p>
        </div>
      </div>
    `;
    document.body.appendChild(lb);
  }

  const lbMedia = $('#lightbox-media', lb);
  const lbClose = $('#lb-close', lb);
  const lbPrev = $('#lb-prev', lb);
  const lbNext = $('#lb-next', lb);
  const lbCaption = $('#lb-caption', lb);
  const lbCounter = $('#lb-counter', lb);
  if (!lbMedia || !lbClose || !lbPrev || !lbNext) return;

  let current = 0;
  let lastFocused = null;

 function openAt(i){
  current = clamp(i, 0, items.length - 1);
  lastFocused = document.activeElement;

  const item = items[current];
  if (lbMedia.dataset.currentSrc !== item.src) {
    render();
  }

  lb.setAttribute('aria-hidden', 'false');
  document.documentElement.classList.add('no-scroll');
}

function close(){
  lb.setAttribute('aria-hidden', 'true');
  document.documentElement.classList.remove('no-scroll');

  const html5Video = lbMedia.querySelector('video');
  if (html5Video) html5Video.pause();

  const vimeoIframe = lbMedia.querySelector('iframe[src*="player.vimeo.com"]');
  if (vimeoIframe && vimeoIframe.contentWindow) {
    vimeoIframe.contentWindow.postMessage(JSON.stringify({ method: 'pause' }), '*');
  }

  if (lastFocused && lastFocused.focus) lastFocused.focus();
}

function render(){
  const item = items[current];
  lbMedia.dataset.currentSrc = item.src;
  lbMedia.innerHTML = '';

  if (item.type === 'video'){
    const vimeoId = getVimeoId(item.src);

    if (vimeoId){
      const wrap = document.createElement('div');
      wrap.className = 'lb-vimeo is-loading';

      if (item.thumb){
        const cover = document.createElement('img');
        cover.className = 'lb-vimeo__cover';
        cover.src = item.thumb;
        cover.alt = item.alt || '';
        wrap.appendChild(cover);
      }

      const iframe = document.createElement('iframe');
      iframe.src = buildVimeoEmbedUrl(vimeoId);
      iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('title', item.alt || 'Vimeo video');
      iframe.loading = 'eager';

      iframe.addEventListener('load', () => {
        wrap.classList.remove('is-loading');
      }, { once: true });

      wrap.appendChild(iframe);
      lbMedia.appendChild(wrap);
    } else {
      const v = document.createElement('video');
      v.controls = true;
      v.playsInline = true;
      v.preload = 'metadata';
      v.src = item.src;
      if (item.thumb) v.poster = item.thumb;
      lbMedia.appendChild(v);
    }
  } else {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt || '';
    lbMedia.appendChild(img);
  }

  if (lbCaption) lbCaption.textContent = item.alt || '';
  if (lbCounter) lbCounter.textContent = `${current + 1} / ${items.length}`;
}

  function prev(){
    current = (current - 1 + items.length) % items.length;
    render();
  }

  function next(){
    current = (current + 1) % items.length;
    render();
  }

  // Click thumbnail
  grid.addEventListener('click', (e)=>{
    const btn = e.target.closest('button.thumb');
    if (!btn) return;
    openAt(Number(btn.dataset.index));
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);

  // Click backdrop closes
  lb.addEventListener('click', (e)=>{
    if (e.target === lb) close();
  });

  // Keyboard
  document.addEventListener('keydown', (e)=>{
    if (lb.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Swipe
  let startX = 0;
  let startY = 0;
  lb.addEventListener('touchstart', (e)=>{
    if (lb.getAttribute('aria-hidden') === 'true') return;
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
  }, { passive:true });

  lb.addEventListener('touchend', (e)=>{
    if (lb.getAttribute('aria-hidden') === 'true') return;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    dx > 0 ? prev() : next();
  }, { passive:true });

  // Vimeo helpers
  function getVimeoId(src){
    if (!src) return '';
    const s = String(src).trim();
    // vimeo:123456789
    const m1 = s.match(/^vimeo:(\d+)$/i);
    if (m1) return m1[1];
    // https://vimeo.com/123456789 or https://player.vimeo.com/video/123456789
    const m2 = s.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    if (m2) return m2[1];
    return '';
  }

  function buildVimeoEmbedUrl(id){
    // Lightbox player (not background): show controls, autoplay on open.
    const params = new URLSearchParams({
      autoplay: '1',
      title: '0',
      byline: '0',
      portrait: '0',
      playsinline: '1'
    });
    return `https://player.vimeo.com/video/${encodeURIComponent(id)}?${params.toString()}`;
  }

  // Utils
  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }
  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
  }

})();
