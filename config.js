/* 本地化的落地页、购买页和成功页配置。 */
window.LANDING_CONFIG = Object.freeze({
  productName: '帝皇鹿精丸',
  productSku: 'nk-emperor-deer',
  productText: '帝皇鹿精丸',
  oldPrice: '2,760 TWD',
  newPrice: '1,380 TWD',
  orderUrl: './order.html',
  orderEndpoint: '',
  orderCountdownMinutes: 15,
  formType: 'di_huang_lu_jing_wan_908_l9',
  formName: '9/8NK帝皇鹿精丸中轉（生活網）9',
  pixelId: '',
  entryPath: location.pathname.replace(/^\/+/, '').split('/')[0],
  subid: '',
  enableTracking: false,
  countdownMinutes: 48,
  exitPopup: true,
  passEntryParameters: true,
  // 原站广告代码不在本地版加载；本项目不发送浏览追踪请求。
});
