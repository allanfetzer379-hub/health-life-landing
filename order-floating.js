(() => {
  'use strict';
  const button = document.getElementById('floating-buy');
  const form = document.getElementById('form1');
  if (!button || !form) return;
  button.addEventListener('click', () => {
    button.hidden = true;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, { once: true });
})();
