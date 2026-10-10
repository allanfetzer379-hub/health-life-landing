(function () {
  'use strict';

  var config = window.LANDING_CONFIG || {};
  var PIXEL_ID = String(config.pixelId || '1711415600409281');
  var API_ENDPOINT = config.orderEndpoint;
  var KT_POSTBACK_URL = 'https://go.formoz.top/formozpb20260601/postback';
  // Keitaro replaces macros in index.html, not in this static JavaScript file.
  var KT_SUBID = String(config.subid || '{subid}');
  var submitting = false;
  var addToCartTracked = false;

  function param(name) {
    try { return new URLSearchParams(window.location.search).get(name) || ''; }
    catch (ignore) { return ''; }
  }

  function cookie(name) {
    var escaped = name.replace(/[.$?*|{}()\[\]\\/+^]/g, '\\$&');
    var match = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : '';
  }

  function cleanMacro(value) {
    value = String(value || '').trim();
    return value && value.charAt(0) !== '{' ? value : '';
  }

  function subid() {
    return param('subid') || param('_subid') || param('click_id') ||
      param('clickid') || param('cid') || cookie('_subid') || cleanMacro(KT_SUBID) || '';
  }

  function entrySource() {
    var explicit = param('entry_source') || param('source_link') || param('src');
    if (explicit) return explicit;
    return window.location.hostname + '/' + String(config.entryPath || '');
  }

  function entryUrl() {
    var explicit = param('entry_url');
    if (explicit) return explicit;
    var key = 'essencetablet_entry_' + String(config.entryPath || 'landing');
    try {
      var remembered = sessionStorage.getItem(key) || '';
      if (remembered) return remembered;
    } catch (ignore) {}
    return window.location.origin + '/' + String(config.entryPath || '');
  }

  function nextUrl(path) {
    try {
      var next = new URL(path, window.location.href);
      var params = new URLSearchParams(window.location.search);
      params.forEach(function (value, keyName) {
        if (!next.searchParams.has(keyName)) next.searchParams.set(keyName, value);
      });
      return next.pathname + (next.search ? next.search : '');
    } catch (ignore) { return path; }
  }

  function fbc() {
    var value = param('fbc') || cookie('_fbc');
    if (value) return value;
    var click = param('fbclid');
    return click ? 'fb.1.' + Math.floor(Date.now() / 1000) + '.' + click : '';
  }

  function normalizePhone(value) {
    var digits = String(value || '').replace(/\D/g, '');
    if (digits.indexOf('88609') === 0) digits = '886' + digits.slice(4);
    if (/^09\d{8}$/.test(digits)) return '886' + digits.slice(1);
    if (/^9\d{8}$/.test(digits)) return '886' + digits;
    if (/^8869\d{8}$/.test(digits)) return digits;
    return '';
  }

  function attribution() {
    return {
      fbclid: param('fbclid'),
      fbc: fbc(),
      fbp: param('fbp') || cookie('_fbp'),
      utm_source: param('utm_source') || param('source'),
      utm_campaign: param('utm_campaign') || param('campaign_name'),
      campaign_id: param('campaign_id') || param('utm_id'),
      adset_id: param('adset_id') || param('utm_term'),
      ad_id: param('ad_id') || param('utm_content'),
      adset_name: param('adset_name'),
      ad_name: param('ad_name'),
      placement: param('utm_placement') || param('placement')
    };
  }

  function trackPageView() {
    try {
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/zh_TW/fbevents.js');
      fbq('init', PIXEL_ID);
      fbq('track', 'PageView');
    } catch (ignore) {}
  }

  function trackAddToCart() {
    if (addToCartTracked) return;
    var sid = subid();
    if (!sid) return;
    var visitorKey = param('fbclid') || sid || 'browser';
    var key = 'maxmen_atc_v2_' + (config.formName || config.formType || entrySource()) + '_' + visitorKey;
    try {
      if (localStorage.getItem(key) === '1') {
        addToCartTracked = true;
        return;
      }
      localStorage.setItem(key, '1');
    } catch (ignore) {}
    addToCartTracked = true;
    var a = attribution();
    var query = new URLSearchParams({
      subid: sid,
      status: 'AddToCart',
      payout: '0',
      value: '0',
      currency: 'TWD',
      tid: 'atc_' + sid,
      source: 'first_form_interaction',
      form_name: config.formName || config.productName || '',
      entry_source: entrySource(),
      entry_url: entryUrl(),
      event_source_url: window.location.href,
      sub_id_6: PIXEL_ID
    });
    var fields = {
      external_id: a.fbclid,
      sub_id_1: a.placement,
      sub_id_2: a.campaign_id,
      sub_id_3: a.adset_id,
      sub_id_4: a.ad_id,
      sub_id_5: a.adset_name,
      sub_id_7: a.ad_name
    };
    Object.keys(fields).forEach(function (keyName) {
      if (fields[keyName]) query.set(keyName, fields[keyName]);
    });
    var url = KT_POSTBACK_URL + '?' + query.toString();
    try { if (navigator.sendBeacon && navigator.sendBeacon(url)) return; } catch (ignore) {}
    (new Image()).src = url + '&r=' + Date.now();
  }

  function findForm(count) {
    return document.getElementById('form' + (count || 1)) ||
      document.querySelector('form[id^="form"]') || document.querySelector('form');
  }

  function isCustomerField(target) {
    if (!target || !target.matches) return false;
    return target.matches(
      'input[name="name"], input[name="phone"], input[type="tel"]'
    );
  }

  function statusButton(form) {
    return form && (form.querySelector('button[type="submit"]') ||
      form.querySelector('.button-submit') || form.querySelector('.main-link') ||
      form.querySelector('.order-btn'));
  }

  function setButton(button, disabled, label) {
    if (!button) return;
    if (!button.dataset.originalLabel) button.dataset.originalLabel = button.textContent.trim();
    if ('disabled' in button) button.disabled = disabled;
    button.style.pointerEvents = disabled ? 'none' : '';
    var text = button.querySelector('.button-submit-text') || button;
    if (!text.dataset.originalText) text.dataset.originalText = text.textContent;
    text.textContent = label || text.dataset.originalText;
  }

  function submitOrder(form) {
    if (!form || submitting) return false;
    var nameInput = form.querySelector('input[name="name"]');
    var phoneInput = form.querySelector('input[name="phone"]');
    var name = nameInput ? nameInput.value.trim() : '';
    var rawPhone = phoneInput ? phoneInput.value.trim() : '';
    if (!/^[\u4e00-\u9fff]{2,10}$/.test(name)) {
      alert('請正確填寫姓名，姓名必須包含中文文字');
      if (nameInput) nameInput.focus();
      return false;
    }
    if (!normalizePhone(rawPhone)) {
      alert('請輸入正確的臺灣手機號碼（09xxxxxxxx 或 +8869xxxxxxxx）');
      if (phoneInput) phoneInput.focus();
      return false;
    }

    submitting = true;
    var button = statusButton(form);
    setButton(button, true, '提交中...');
    var sid = subid();
    var a = attribution();
    var payload = {
      name: name,
      phone: rawPhone,
      subid: sid,
      click_id: param('click_id') || param('clickid') || sid,
      form_type: config.formType,
      form_name: config.formName,
      entry_source: entrySource(),
      entry_url: entryUrl(),
      page: window.location.href,
      referrer_url: document.referrer || '',
      value: '1389',
      currency: 'TWD',
      pixel: PIXEL_ID,
      sub_id_6: PIXEL_ID,
      fbclid: a.fbclid,
      fbc: a.fbc,
      fbp: a.fbp,
      utm_source: a.utm_source,
      utm_campaign: a.utm_campaign,
      campaign_id: a.campaign_id,
      adset_id: a.adset_id,
      ad_id: a.ad_id,
      adset_name: a.adset_name,
      ad_name: a.ad_name,
      placement: a.placement,
      event_source_url: window.location.href
    };

    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    }).then(function (response) {
      return response.text().then(function (text) {
        var data = {};
        try { data = text ? JSON.parse(text) : {}; } catch (ignore) {}
        if (!response.ok || data.ok === false) throw new Error(data.error || '提交失敗');
      });
    }).then(function () {
      setButton(button, true, '提交成功');
      window.location.href = nextUrl('thanks.html');
    }).catch(function () {
      submitting = false;
      setButton(button, false);
      alert('提交失敗，請稍後再試');
    });
    return false;
  }

  window.send = function (count) { return submitOrder(findForm(count)); };
  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form || !form.querySelector('input[name="phone"]')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    submitOrder(form);
  }, true);

  // AddToCart represents the user's first interaction with the customer form.
  // localStorage in trackAddToCart prevents repeat events for the same visitor.
  document.addEventListener('click', function (event) {
    if (config.enableTracking && isCustomerField(event.target)) trackAddToCart();
  }, true);

  if (config.enableTracking) trackPageView();
})();
