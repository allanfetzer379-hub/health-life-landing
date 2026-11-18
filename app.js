(() => {
  'use strict';
  const config = window.LANDING_CONFIG || {
    productName: '帝皇鹿精丸',
    productSku: 'nk-emperor-deer',
    productText: '帝皇鹿精丸',
    orderUrl: './order.html',
    countdownMinutes: 48,
    exitPopup: true,
    passEntryParameters: true,
  };

  const next = new URL(config.orderUrl || './order.html', document.baseURI);
  if (config.passEntryParameters) {
    const params = new URLSearchParams(location.search);
    const entry = params.get('entry_url') || location.href;
    try {
      const entryUrl = new URL(entry, location.href);
      const firstPath = entryUrl.pathname.replace(/^\/+/, '').split('/')[0];
      if (!params.has('entry_source')) {
        params.set('entry_source', entryUrl.hostname + (firstPath ? '/' + firstPath : ''));
      }
      params.set('entry_url', entry);
      params.forEach((value, key) => {
        if (!next.searchParams.has(key)) next.searchParams.set(key, value);
      });
    } catch (e) {}
  }
  document.querySelectorAll('a[data-next="1"]').forEach(link => {
    link.href = next.href;
  });

  const fontBtns = document.querySelectorAll('.tvbs-font-btn');
  fontBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fontBtns.forEach(option => {
        const active = option === btn;
        option.classList.toggle('active', active);
        option.setAttribute('aria-pressed', String(active));
      });
      const root = document.documentElement;
      root.classList.remove('font-md', 'font-lg', 'font-xl');
      root.classList.add('font-' + btn.dataset.size);
    });
  });

  const checkboxes = document.querySelectorAll('.symptom-cb');
  const countEl = document.getElementById('checked-count');
  function updateSymptomQuiz() {
    let count = 0;
    checkboxes.forEach(cb => {
      const parent = cb.closest('.quiz-item');
      if (cb.checked) {
        count++;
        parent?.classList.add('checked');
      } else {
        parent?.classList.remove('checked');
      }
    });
    if (countEl) countEl.textContent = String(Math.max(1, count));
  }
  checkboxes.forEach(cb => cb.addEventListener('change', updateSymptomQuiz));
  updateSymptomQuiz();

  const duration = Math.max(0, Number(config.countdownMinutes) || 48) * 60;
  const deadline = Date.now() + duration * 1000;
  const minutes = document.querySelector('.min');
  const seconds = document.querySelector('.sec');
  let timer;
  function tick() {
    const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    if (minutes) minutes.textContent = String(Math.floor(remaining / 60)).padStart(2, '0');
    if (seconds) seconds.textContent = String(remaining % 60).padStart(2, '0');
    if (remaining > 0) timer = setTimeout(tick, 1000);
  }
  tick();

  const orderRecords = [
    "剛剛 台北市大安區 陳先生（58歲）成功搶購了【帝皇鹿精丸】半價優惠名額（NT$ 1,380）",
    "1分鐘前 新北市板橋區 林大哥（63歲）成功訂購了【帝皇鹿精丸】1盒（60粒裝）",
    "2分鐘前 台中市西屯區 張先生（55歲）成功搶購了【帝皇鹿精丸】半價優惠名額（NT$ 1,380）",
    "3分鐘前 高雄市三民區 黃先生（61歲）成功訂購了【帝皇鹿精丸】1盒（60粒裝）",
    "5分鐘前 桃園市中壢區 李大哥（54歲）成功搶購了【帝皇鹿精丸】半價優惠名額（NT$ 1,380）",
    "6分鐘前 台南市東區 吳先生（66歲）成功訂購了【帝皇鹿精丸】1盒（60粒裝）",
    "8分鐘前 新竹市東區 蔡先生（52歲）成功搶購了【帝皇鹿精丸】半價優惠名額（NT$ 1,380）",
    "9分鐘前 彰化縣員林市 許大哥（60歲）成功訂購了【帝皇鹿精丸】1盒（60粒裝）",
    "12分鐘前 屏東縣屏東市 鄭先生（68歲）成功搶購了【帝皇鹿精丸】半價優惠名額（NT$ 1,380）",
    "15分鐘前 嘉義市西區 謝先生（57歲）成功訂購了【帝皇鹿精丸】半價優惠名額（NT$ 1,380）"
  ];
  const toastEl = document.getElementById('live-toast');
  const toastText = document.getElementById('live-toast-text');
  let recordIdx = 0;
  if (toastEl && toastText) {
    setInterval(() => {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translateY(10px)';
      setTimeout(() => {
        recordIdx = (recordIdx + 1) % orderRecords.length;
        toastText.textContent = orderRecords[recordIdx];
        toastEl.style.opacity = '1';
        toastEl.style.transform = 'translateY(0)';
      }, 350);
    }, 5000);
  }

  const modal = document.getElementById('comeback');
  const close = modal?.querySelector('.comeback_close');
  const popupKey = 'nk-tvbs-popup:' + config.productSku;
  let shown = false;

  function openPopup() {
    if (shown || !modal) return;
    shown = true;
    try {
      if (window.sessionStorage.getItem(popupKey) === '1') return;
      window.sessionStorage.setItem(popupKey, '1');
    } catch (e) {}
    modal.style.display = 'block';
  }
  function closePopup() {
    if (modal) modal.style.display = 'none';
  }
  close?.addEventListener('click', closePopup);
  modal?.addEventListener('click', e => { if (e.target === modal) closePopup(); });

  if (config.exitPopup) {
    setTimeout(() => {
      window.addEventListener('scroll', () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
        if (progress > 0.35 && !shown) openPopup();
      }, { passive: true });
    }, 10000);
  }
})();
