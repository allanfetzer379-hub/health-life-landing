(() => {
  'use strict';
  // Same-site return link, keeping campaign/source parameters as on the source site.
  const params = new URLSearchParams(location.search);
  document.querySelectorAll('a[data-next="1"]').forEach(link => {
    const next = new URL(link.getAttribute('href'), location.href);
    params.forEach((value, key) => { if (!next.searchParams.has(key)) next.searchParams.set(key, value); });
    link.href = next.href;
  });
})();
