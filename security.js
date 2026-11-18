(function () {
  'use strict';

  // Reduce casual asset copying without interfering with forms, links, or scrolling.
  document.addEventListener('dragstart', function (event) {
    if (event.target && event.target.closest && event.target.closest('img,video')) {
      event.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('contextmenu', function (event) {
    if (event.target && event.target.closest && event.target.closest('img,video')) {
      event.preventDefault();
    }
  }, { passive: false });

  document.querySelectorAll('img,video').forEach(function (media) {
    media.setAttribute('draggable', 'false');
    media.oncontextmenu = function () { return false; };
  });
})();
