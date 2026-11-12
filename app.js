/* 原站交互的独立版本，无框架、无第三方依赖。 */
(() => {
  'use strict';
  const config = window.LANDING_CONFIG;
  const contents = {
    product_name: config.productName,
    product_text: config.productText,
    old_price: config.oldPrice,
    new_price: config.newPrice,
  };
  for (const [className, value] of Object.entries(contents)) {
    document.querySelectorAll(`.${className}`).forEach(element => {
      element.textContent = value;
    });
  }

  // 原站的导航、社交标签、正文链接和 CTA 都转到同一个订购页。
  const next = new URL(config.orderUrl, document.baseURI);
  if (config.passEntryParameters) {
    const params = new URLSearchParams(location.search);
    const entry = params.get('entry_url') || location.href;
    const entryUrl = new URL(entry, location.href);
    const firstPath = entryUrl.pathname.replace(/^\/+/, '').split('/')[0];
    if (!params.has('entry_source')) {
      params.set('entry_source', entryUrl.hostname + (firstPath ? '/' + firstPath : ''));
    }
    params.set('entry_url', entry);
    params.forEach((value, key) => {
      if (!next.searchParams.has(key)) next.searchParams.set(key, value);
    });
  }
  document.querySelectorAll('a[data-next="1"]').forEach(link => {
    link.href = next.href;
  });

  // 保留每次打开页面重新开始的 48 分钟倒计时，修复原代码未定义 d 的异常。
  const duration = Math.max(0, Number(config.countdownMinutes) || 0) * 60;
  const deadline = Date.now() + duration * 1000;
  const minutes = document.querySelector('.min');
  const seconds = document.querySelector('.sec');
  let timer;
  function tick() {
    const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    minutes.textContent = String(Math.floor(remaining / 60)).padStart(2, '0');
    seconds.textContent = String(remaining % 60).padStart(2, '0');
    if (remaining > 0) timer = setTimeout(tick, 1000);
  }
  tick();
  window.addEventListener('pagehide', () => clearTimeout(timer));
  window.addEventListener('pageshow', event => { if (event.persisted) tick(); });

  const modal = document.getElementById('comeback');
  const close = modal.querySelector('.comeback_close');
  const offer = document.getElementById('product-offer');
  const floating = document.getElementById('floating-order');
  const jump = document.getElementById('jump-to-offer');
  const popupKey = 'nk-offer-popup:' + config.productSku;
  let waitedLongEnough = false;
  let reachedOffer = false;
  let shown = false;
  let previouslyFocused;
  function openPopup() {
    shown = true;
    try {
      if (window.sessionStorage.getItem(popupKey) === '1') return;
      window.sessionStorage.setItem(popupKey, '1');
    } catch {
      // 存储不可用时，当前页面仍只弹一次。
    }
    previouslyFocused = document.activeElement;
    modal.style.display = 'block';
    close.focus({ preventScroll: true });
  }
  function closePopup() {
    modal.style.display = 'none';
    updateOffers();
    previouslyFocused?.focus({ preventScroll: true });
  }
  function updateOffers() {
    const visible = document.visibilityState === 'visible';
    if (visible && offer && !reachedOffer) {
      const rect = offer.getBoundingClientRect();
      reachedOffer = rect.top < window.innerHeight && rect.bottom > 0;
    }
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    if (config.exitPopup && visible && waitedLongEnough && progress > 0.25 && !reachedOffer && !shown) {
      openPopup();
    }
    if (floating) {
      floating.hidden = reachedOffer || progress <= 0.30 || modal.style.display === 'block';
    }
  }
  close.addEventListener('click', closePopup);
  close.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      closePopup();
    }
  });
  modal.addEventListener('click', event => {
    if (event.target === modal) closePopup();
  });
  document.addEventListener('keydown', event => {
    if (modal.style.display !== 'block') return;
    if (event.key === 'Escape') closePopup();
    if (event.key === 'Tab') {
      const focusable = Array.from(modal.querySelectorAll('a[href], button, [tabindex="0"]'));
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });
  if (config.exitPopup) {
    setTimeout(() => {
      waitedLongEnough = true;
      updateOffers();
    }, 12000);
  }

  if (offer && jump) {
    jump.addEventListener('click', () => {
      offer.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'end' });
    });
  }
  window.addEventListener('scroll', updateOffers, { passive: true });
  window.addEventListener('resize', updateOffers);
  window.addEventListener('load', updateOffers);
  window.addEventListener('pageshow', event => {
    if (event.persisted && modal.style.display === 'block') closePopup();
    else updateOffers();
  });
  document.addEventListener('visibilitychange', updateOffers);
  updateOffers();
})();
