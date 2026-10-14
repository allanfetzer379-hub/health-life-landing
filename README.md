# 落地页、购买页与成功页前端项目

基于用户提供的原站公开 HTML、CSS 与素材制作，采集日期：2026-10-10。
原站：http://l9-2b46b06788.207-148-127-110.sslip.io/

## 当前发布配置

- 仓库：https://github.com/allanfetzer379-hub/health-life-landing
- GitHub Pages：https://allanfetzer379-hub.github.io/health-life-landing/
- 发布来源：`main` 分支、仓库根目录。推送更新后 GitHub Pages 会自动重新部署。

## 本次包含

- 原站文章、导航、图片、评论、产品区、底部按钮与弹窗。
- 原站购买页 `order.html`：背景、横幅、GIF/WebP 动图、对比图、价格、姓名/手机表单、货到付款信息。
- 原站提交成功页 `thanks.html`：产品图、成功提示、订单说明和返回链接。
- 原始样式及 479 / 640 / 700 / 767 / 1019px 响应式规则。
- 全部 43 个原始图片、动图、头像、SVG 图标，资源无需从原站加载。
- 48 分钟倒计时、3 秒定时优惠弹窗、弹窗关闭、导航和 CTA 跳转。
- 可编辑 HTML / CSS / JavaScript，无依赖、无需构建。

管理后台已单独部署：https://allanfetzer379-hub.github.io/health-life-admin/ 。数据库项目为 health-life-orders。
订购、导航、社交标签与正文链接都沿用原站的“前往订购页”行为；目的地已改为自己网站的 `./order.html`。
全部页面和素材可以离线浏览；真实订单提交仍需要联网及可用的订单后端。

## 订单接收接口状态

购买页保留原站表单校验、提交防重复、错误提示和成功后的 `thanks.html` 跳转。
2026-10-11 改为自有 Supabase Edge Function `submit-order`，连接配置在 `backend-config.js`，不再向原站接口提交资料。真实客户姓名原样保存，姓名或电话任一命中历史订单时标记重粉，订单仍然入库。

请求成功且返回订单编号后才跳转成功页；网络失败保留重试编号，避免相同请求重复入库。后台保存 IP、设备、广告来源 ID，匿名客户端不能读取客户资料。

FB/TK 像素由后台「系统设置」保存，在页面加载时读取。默认空配置，不发送广告事件。配置启用后发送浏览事件，下单成功发送 Lead / SubmitForm；这些事件代表提交表单，不代表付款。

## 最快查看

解压后双击 `index.html` 即可打开。图片、样式和脚本均为相对路径。
浏览器对 `file://` 的历史记录功能有差异；测试“后退弹窗”请使用下面的本地服务器。

## 推荐本地运行

安装 Node.js 18 或以上版本，在本文件所在目录打开终端：

```sh
node tools/server.mjs
```

然后打开 http://127.0.0.1:4173/ 。无需安装任何项目依赖。如果系统有 npm，也可以使用 `npm start`。
停止服务：终端按 Ctrl+C。

也可以使用已安装的 Python：

```sh
python -m http.server 4173 --bind 127.0.0.1
```

检查本地引用、图片完整性、倒计时边界与子目录链接：

```sh
node tools/check.mjs
node tools/check-order.mjs
```

## 部署到 GitHub Pages

1. 在自己的 GitHub 账号新建仓库，例如 `company-landing`。
2. 上传这个目录内的文件到仓库根目录，确保根目录直接包含 `index.html`、`styles.css`、`app.js`、`config.js` 和 `img/`。不要把外层 `landing-page/` 文件夹再套一层。
3. 一并保留 `.nojekyll`。`tools/`、`preview/` 和说明文件可以保留；它们不是页面运行依赖。
4. 打开仓库 **Settings → Pages**。
5. 在 **Build and deployment → Source** 选择 **Deploy from a branch**。
6. 选择 **main** 分支和 **/(root)**，点击 **Save**。
7. 等待 GitHub 部署完成，访问 Pages 设置中显示的地址，通常为 `https://你的账号.github.io/company-landing/`。

本项目无需构建步骤，也不需要自行设置 Actions workflow。所有页面素材使用相对路径，兼容仓库子目录。
GitHub 官方步骤：[配置 GitHub Pages 发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

上传新版本后，等待 Pages 部署完成，再刷新浏览器；图片不更新时可强制刷新。
如页面出现 404，先检查 `index.html` 是否在选择的分支根目录，以及 Pages 部署是否成功。

## 修改位置

| 文件 | 用途 |
| --- | --- |
| `index.html` | 全部页面结构、文章文字、图片路径、评论 |
| `styles.css` | 原站样式，保留原规则顺序 |
| `config.js` | 产品名称、价格、倒计时、订购目标地址、定时弹窗开关 |
| `app.js` | 产品名填充、链接参数、倒计时、弹窗 |
| `order.html` / `order.css` | 原购买页结构与原始样式 |
| `order.js` | 原购买页 15 分钟倒计时、产品名称与价格填充 |
| `order-bridge.js` | 自有订单提交、格式校验、重试防重复与成功跳转 |
| `backend-config.js` / `pixels.js` | Supabase 公开连接配置、后台像素设置加载 |
| `thanks.html` / `thanks.css` / `thanks.js` | 原成功页及站内返回链接 |
| `img/` | 原始图片与图标 |
| `order/img/` | 购买页的原图与动图 |
| `assets-manifest.json` | 素材文件大小和 SHA-256 完整性记录 |
| `preview/` | 本地版桌面与手机预览截图 |
| `VERIFICATION.md` | 复刻范围、差异及检查结果 |

`config.js` 的 `orderUrl` 是 `./order.html`；订单服务由 `backend-config.js` 配置，不能放入数据库密码或 service-role 密钥。
如果只想关闭3 秒优惠弹窗，将 `exitPopup` 改成 `false`。
`passEntryParameters` 控制跳转时是否携带原站已有的来源与查询参数。

## 与原站的明确差异

- 未加载原站 Meta Pixel 或统计请求。自有像素由后台设置，未配置时关闭。
- 保留倒计时重置规则，修复结束时引用未定义变量 `d` 的错误。
- 打开落地页 3 秒后显示一次优惠弹窗，关闭按钮加大；不拦截浏览器返回。
- 产品区「立即五折訂購」跳转购买页并保留广告参数。浏览进度超过可滚动距离的 30% 时显示底部优惠按钮，点击平滑滚动到产品区；到达后本次页面浏览不再显示。
- 增加页面语言、搜索框标签、弹窗键盘关闭及焦点管理，不改视觉样式。
- 原站的搜索框、手机菜单/搜索图标并未实现实际搜索或展开菜单，本项目保留其原样；社交标签原本也是订购链接，未改为真正的分享功能。
- 浏览器访问原站时部分素材偶发加载失败；本项目重试下载后全部补齐，显示原始图片，不复刻临时网络故障。

广告链接示例：`?utm_source=facebook&ad_id=你的广告ID`。参数会带入购买页和订单记录；后台支持按广告来源 ID 筛选。

## 广告事件（2026-10-14）

- PageView：每次页面加载。
- ViewContent：落地页商品区域进入视口，每次页面访问一次。
- InitiateCheckout：进入 order.html，同一标签页 30 分钟内去重；成功下单后开启新的结账流程。
- Purchase：仅 thanks.html 读取后台成功提交后保存的订单编号时上报；按像素、事件和订单编号在浏览器本地去重。保留原 Lead / TikTok SubmitForm，兼容现有留资广告。
- 固定单盒商品 nk-one-box，数量 1，金额 1389 TWD，与当前数据库价格一致；修改套餐价格时必须同步 pixels.js 和数据库。货到付款的 Purchase 代表订单受理，并非已收款。
- 无购物车，不上报 AddToCart；滚动按钮不触发结账。事件参数不包含姓名、电话。
- 浏览器像素受广告拦截、网络及浏览器存储限制影响，本地去重不代表平台确认接收，也不提供跨设备去重保证。
- 验证：node tools/check-pixels.mjs（模拟像素，不创建真实订单、不发送真实广告事件）。
