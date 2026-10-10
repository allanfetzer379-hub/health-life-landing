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
  let shown = false;
  let previouslyFocused;
  function openPopup() {
    if (!config.exitPopup || shown) return;
    shown = true;
    previouslyFocused = document.activeElement;
    modal.style.display = 'block';
    close.focus({ preventScroll: true });
  }
  function closePopup() {
    modal.style.display = 'none';
    previouslyFocused?.focus({ preventScroll: true });
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
      const focusable = Array.from(modal.querySelectorAll('a[href], [tabindex="0"]'));
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });
  if (config.exitPopup) {
    document.body.addEventListener('mouseout', event => {
      if (event.clientY < 0 && !event.relatedTarget) openPopup();
    });
    // 首次后退展示原站弹窗；关闭后再次后退可正常离开，不无限拦截。
    try {
      if (!history.state?.landingPopupGuard) {
        history.pushState({ landingPopupGuard: true }, '', location.href);
      }
      window.addEventListener('popstate', () => {
        if (!shown) {
          history.pushState({ landingPopupGuard: true }, '', location.href);
          openPopup();
        }
      });
    } catch (_) { /* file:// 浏览器限制不影响其余交互。 */ }
  }
})();
