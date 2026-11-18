(() => {
  'use strict';

  const dock = document.getElementById('checkout-dock');
  const button = document.getElementById('floating-buy');
  const form = document.getElementById('form1');
  const fields = form?.querySelector('.checkout-fields');
  const price = document.querySelector('.new_price > div');
  if (!dock || !button || !fields || !price) return;

  dock.querySelector('.checkout-dock-price').textContent = price.textContent.trim();

  const bounds = fields.getBoundingClientRect();
  dock.hidden = bounds.bottom > 0 && bounds.top < window.innerHeight;

  const fieldsObserver = new IntersectionObserver(([entry]) => {
    dock.hidden = entry.isIntersecting;
  });
  fieldsObserver.observe(fields);

  button.addEventListener('click', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    form.focus({ preventScroll: true });
    form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
})();
