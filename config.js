/* 本阶段仅复制落地页。后续订单页完成后，将 orderUrl 改为 './order.html'。 */
window.LANDING_CONFIG = Object.freeze({
  productName: '龍陽丸',
  productText: '純中藥製作，安全有效無副作用',
  oldPrice: '2,778 TWD',
  newPrice: '1,389 TWD',
  orderUrl: 'http://l9-2b46b06788.207-148-127-110.sslip.io/order.html',
  countdownMinutes: 48,
  exitPopup: true,
  passEntryParameters: true,
  // 原站广告代码不在本地版加载；本项目不发送浏览追踪请求。
});
