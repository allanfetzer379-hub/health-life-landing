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
- 48 分钟倒计时、离开页面弹窗、弹窗关闭、导航和 CTA 跳转。
- 可编辑 HTML / CSS / JavaScript，无依赖、无需构建。

本阶段包含完整前端页面，不另建管理后台或数据库。
订购、导航、社交标签与正文链接都沿用原站的“前往订购页”行为；目的地已改为自己网站的 `./order.html`。
全部页面和素材可以离线浏览；真实订单提交仍需要联网及可用的订单后端。

## 订单接收接口状态

购买页保留原站表单校验、提交防重复、错误提示和成功后的 `thanks.html` 跳转。
接口地址沿用原站 `https://puremale.top/api/order`，集中放在 `config.js` 的 `orderEndpoint`，没有新建收单服务。

2026-10-10 检查：该接口对 GitHub Pages 来源的 OPTIONS 预检返回 204，但没有 `Access-Control-Allow-Origin` 等允许跨域响应头。因此**目前不能确认新域名可以真实收单**，浏览器会阻止缺少跨域许可的请求。
正式收单前，需要接口管理员允许来源 `https://allanfetzer379-hub.github.io`、POST 方法和 `Content-Type` 请求头，并在实际 POST 响应中同样返回允许来源的响应头；或在后续后台阶段更换为你自己的接口。

没有向原接口提交测试订单。自动检查中的成功与失败响应都是内存模拟，不代表生产接口真实受理成功。
不会把失败请求伪装成成功：只有接口返回原站脚本认可的成功响应后才跳到成功页。

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
| `config.js` | 产品名称、价格、倒计时、订购目标地址、弹窗开关 |
| `app.js` | 产品名填充、链接参数、倒计时、弹窗 |
| `order.html` / `order.css` | 原购买页结构与原始样式 |
| `order.js` | 原购买页 15 分钟倒计时、产品名称与价格填充 |
| `order-bridge.js` | 原站表单接收逻辑，接收地址可配置，广告追踪默认关闭 |
| `thanks.html` / `thanks.css` / `thanks.js` | 原成功页及站内返回链接 |
| `img/` | 原始图片与图标 |
| `order/img/` | 购买页的原图与动图 |
| `assets-manifest.json` | 素材文件大小和 SHA-256 完整性记录 |
| `preview/` | 本地版桌面与手机预览截图 |
| `VERIFICATION.md` | 复刻范围、差异及检查结果 |

`config.js` 的 `orderUrl` 已是 `./order.html`；后续后台完成后修改 `orderEndpoint` 即可切换接收地址。
如果只想关闭原站的离开弹窗，将 `exitPopup` 改成 `false`。
`passEntryParameters` 控制跳转时是否携带原站已有的来源与查询参数。

## 与原站的明确差异

- 广告追踪默认关闭，没有加载原站 Meta Pixel，也没有发送原站统计请求。
- 保留倒计时重置规则，修复结束时引用未定义变量 `d` 的错误。
- 首次后退仍展示弹窗，但关闭后再次后退可离开，避免原站无限拦截后退。
- 增加页面语言、搜索框标签、弹窗键盘关闭及焦点管理，不改视觉样式。
- 原站的搜索框、手机菜单/搜索图标并未实现实际搜索或展开菜单，本项目保留其原样；社交标签原本也是订购链接，未改为真正的分享功能。
- 浏览器访问原站时部分素材偶发加载失败；本项目重试下载后全部补齐，显示原始图片，不复刻临时网络故障。

新后台和广告追踪配置留待后续阶段。原收单接口的跨域限制见上文。
