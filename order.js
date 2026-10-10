(() => {
  'use strict';
  const config = window.LANDING_CONFIG;
  document.querySelectorAll('.product_name').forEach(el => { el.textContent = config.productName; });
  document.querySelector('.old_price').textContent = config.oldPrice;
  document.querySelector('.new_price > div').textContent = config.newPrice + ' ';
  const end = Date.now() + Math.max(0, Number(config.orderCountdownMinutes) || 0) * 60000;
  const clock = document.getElementById('timerr');
  let timer;
  function tick() {
    const seconds = Math.max(0, Math.ceil((end - Date.now()) / 1000));
    clock.querySelector('.hours').textContent = String(Math.floor(seconds / 3600)).padStart(2, '0');
    clock.querySelector('.min').textContent = String(Math.floor(seconds / 60) % 60).padStart(2, '0');
    clock.querySelector('.sec').textContent = String(seconds % 60).padStart(2, '0');
    if (seconds > 0) timer = setTimeout(tick, 1000);
  }
  tick();
  window.addEventListener('pagehide', () => clearTimeout(timer));
  window.addEventListener('pageshow', event => { if (event.persisted) tick(); });
})();
