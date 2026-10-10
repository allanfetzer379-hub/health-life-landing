/* 本地化的落地页、购买页和成功页配置。 */
window.LANDING_CONFIG = Object.freeze({
  productName: '龍陽丸',
  productText: '純中藥製作，安全有效無副作用',
  oldPrice: '2,778 TWD',
  newPrice: '1,389 TWD',
  orderUrl: './order.html',
  orderEndpoint: '',
  orderCountdownMinutes: 15,
  formType: 'longyangwan_908_l9',
  formName: '9/8NK龍陽丸中轉（生活網）9',
  pixelId: '',
  entryPath: location.pathname.replace(/^\/+/, '').split('/')[0],
  subid: '',
  enableTracking: false,
  countdownMinutes: 48,
  exitPopup: true,
  passEntryParameters: true,
  // 原站广告代码不在本地版加载；本项目不发送浏览追踪请求。
});
