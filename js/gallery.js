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

  function getItemPosition(item){
    if (!item || typeof item !== 'object') return '';
    return item.position || item.objectPosition || item.thumbPosition || item.coverPosition || item.mediaPosition || item.dataPosition || item['data-position'] || '';
  }

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
          alt: video.alt || title || 'Video',
          position: getItemPosition(video)
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
          alt: image.alt || title || 'Image',
          position: getItemPosition(image)
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
  

// loading tiles on webpage

const grid = $('#js-grid') || $('#js-gallery-grid');
if (!grid) return;
grid.innerHTML = '';

// Ensure correct grid class for CSS
if (!grid.classList.contains('galleryGrid')) grid.classList.add('galleryGrid');

const PAGE_SIZE = 6;
const SCROLL_STEP_TO_LOAD = 60;
const BOTTOM_THRESHOLD = 120; // px from bottom before loading next batch

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

  const media = btn.querySelector('img, video');
  const itemPosition = getItemPosition(item);
  if (media && itemPosition) {
    media.style.objectPosition = itemPosition;
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

function isNearBottom() {
  const scrollBottom = window.scrollY + window.innerHeight;
  const pageHeight = document.documentElement.scrollHeight;
  return pageHeight - scrollBottom <= BOTTOM_THRESHOLD;
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

  lastLoadScrollY = window.scrollY;

  if (renderedCount >= items.length) {
    window.removeEventListener('scroll', handleGalleryScroll);
    return;
  }

  // user may already be at the bottom, so continue loading without waiting
  if (isNearBottom()) {
    renderNextBatch();
  }
}

function handleGalleryScroll() {
  if (isBatchLoading) return;
  if (renderedCount >= items.length) return;

  const currentY = window.scrollY;
  const scrolledDownSinceLastLoad = currentY - lastLoadScrollY;

  if (
    scrolledDownSinceLastLoad >= SCROLL_STEP_TO_LOAD ||
    isNearBottom()
  ) {
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
        <button class="lbBtn lbBtn--close" type="button" id="lb-close" aria-label="Close">×</button>
        <button class="lbBtn lbBtn--prev" type="button" id="lb-prev" aria-label="Previous">‹</button>
        <button class="lbBtn lbBtn--next" type="button" id="lb-next" aria-label="Next">›</button>
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
  let savedScrollY = 0;
  let viewportWatcherBound = false;

  function setLightboxViewportHeight(){
    const viewport = window.visualViewport;
    const height = viewport && viewport.height ? viewport.height : window.innerHeight;
    document.documentElement.style.setProperty('--bkvp-lightbox-height', `${Math.round(height)}px`);
  }

  function bindLightboxViewportWatchers(){
    if (viewportWatcherBound) return;
    viewportWatcherBound = true;

    window.addEventListener('resize', setLightboxViewportHeight, { passive:true });
    window.addEventListener('orientationchange', () => {
      setLightboxViewportHeight();
      window.setTimeout(setLightboxViewportHeight, 250);
    }, { passive:true });

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', setLightboxViewportHeight, { passive:true });
      window.visualViewport.addEventListener('scroll', setLightboxViewportHeight, { passive:true });
    }
  }

  function lockPageScroll(){
    setLightboxViewportHeight();
    savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.documentElement.classList.add('no-scroll', 'lightbox-lock');
    document.body.classList.add('no-scroll', 'lightbox-lock');
    document.body.style.top = `-${savedScrollY}px`;
  }

  function unlockPageScroll(){
    const y = savedScrollY;
    document.documentElement.classList.remove('no-scroll', 'lightbox-lock');
    document.body.classList.remove('no-scroll', 'lightbox-lock');
    document.body.style.top = '';
    window.scrollTo(0, y);
  }

 function openAt(i){
  current = clamp(i, 0, items.length - 1);
  lastFocused = document.activeElement;
  bindLightboxViewportWatchers();
  setLightboxViewportHeight();

  const item = items[current];
  if (lbMedia.dataset.currentSrc !== item.src) {
    render();
  }

  lb.setAttribute('aria-hidden', 'false');
  lockPageScroll();
}

function close(){
  lb.setAttribute('aria-hidden', 'true');
  unlockPageScroll();

  const html5Video = lbMedia.querySelector('video');
  if (html5Video) html5Video.pause();

  const vimeoIframe = lbMedia.querySelector('iframe[src*="player.vimeo.com"]');
  if (vimeoIframe && vimeoIframe.contentWindow) {
    vimeoIframe.contentWindow.postMessage(JSON.stringify({ method: 'pause' }), '*');
  }

  lbMedia.innerHTML = '';
  lbMedia.dataset.currentSrc = '';

  if (lastFocused && lastFocused.focus) lastFocused.focus();
}

function render(){
  const item = items[current];
  const isVideo = item.type === 'video';
  const vimeoId = isVideo ? getVimeoId(item.src) : '';

  lb.classList.toggle('is-video', isVideo);
  lb.classList.toggle('is-vimeo', !!vimeoId);

  lbMedia.dataset.currentSrc = item.src;
  lbMedia.innerHTML = '';

  if (isVideo){

    if (vimeoId){
      const wrap = document.createElement('div');
      wrap.className = 'lb-vimeo is-loading';

      if (item.thumb){
        const cover = document.createElement('img');
        cover.className = 'lb-vimeo__cover';
        cover.src = item.thumb;
        cover.alt = item.alt || '';
        const coverPosition = getItemPosition(item);
        if (coverPosition) cover.style.objectPosition = coverPosition;
        wrap.appendChild(cover);
      }

      const iframe = document.createElement('iframe');
      iframe.src = buildVimeoEmbedUrl(vimeoId);
      iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media');
      iframe.setAttribute('allowfullscreen', 'allowfullscreen');
      iframe.setAttribute('webkitallowfullscreen', '');
      iframe.setAttribute('mozallowfullscreen', '');
      iframe.setAttribute('title', item.alt || 'Vimeo video');
      iframe.loading = 'eager';

      iframe.addEventListener('load', () => {
        wrap.classList.remove('is-loading');
      }, { once: true });

      const fullscreenBtn = document.createElement('button');
      fullscreenBtn.type = 'button';
      fullscreenBtn.className = 'lb-vimeoFull';
      fullscreenBtn.setAttribute('aria-label', 'Open fullscreen');
      fullscreenBtn.innerHTML = '⛶';
      
      fullscreenBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
      
        const target = iframe;
      
        if (target.requestFullscreen) {
          target.requestFullscreen().catch(() => {});
        } else if (target.webkitRequestFullscreen) {
          target.webkitRequestFullscreen();
        } else if (wrap.requestFullscreen) {
          wrap.requestFullscreen().catch(() => {});
        } else if (wrap.webkitRequestFullscreen) {
          wrap.webkitRequestFullscreen();
        }
      });
      
      wrap.appendChild(iframe);
      wrap.appendChild(fullscreenBtn);
      lbMedia.appendChild(wrap);
    } else {
      const v = document.createElement('video');
      v.controls = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.setAttribute('webkit-playsinline', '');
      v.preload = 'metadata';
      v.src = item.src;
      if (item.thumb) v.poster = item.thumb;
      lbMedia.appendChild(v);
    }
  } else {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt || '';
    const imagePosition = getItemPosition(item);
    if (imagePosition) img.style.objectPosition = imagePosition;
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
      controls: '1',
      fullscreen: '1',
      playsinline: '1',
      dnt: '1'
    });
    return `https://player.vimeo.com/video/${encodeURIComponent(id)}?${params.toString()}`;
  }

  // Utils
  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }
  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
  }

})();
