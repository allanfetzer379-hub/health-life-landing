# 落地页本地前端项目

基于用户提供的原站公开 HTML、CSS 与素材制作，采集日期：2026-10-10。
原站：http://l9-2b46b06788.207-148-127-110.sslip.io/

## 本次包含

- 原站文章、导航、图片、评论、产品区、底部按钮与弹窗。
- 原始样式及 479 / 640 / 700 / 767 / 1019px 响应式规则。
- 全部 34 个原始图片、头像、SVG 图标，资源无需从原站加载。
- 48 分钟倒计时、离开页面弹窗、弹窗关闭、导航和 CTA 跳转。
- 可编辑 HTML / CSS / JavaScript，无依赖、无需构建。

本阶段仅包含落地页，不包含订单页、管理后台、数据库或表单收集。
订购、导航、社交标签与正文链接都沿用原站的“前往订购页”行为；当前目的地是原站的外部 `order.html`。
浏览落地页本身可以离线运行；点击这些外链需要联网。

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
| `img/` | 原始图片与图标 |
| `assets-manifest.json` | 素材文件大小和 SHA-256 完整性记录 |
| `preview/` | 本地版桌面与手机预览截图 |
| `VERIFICATION.md` | 复刻范围、差异及检查结果 |

后续订单页完成后，将 `config.js` 的 `orderUrl` 改成 `./order.html`。
如果只想关闭原站的离开弹窗，将 `exitPopup` 改成 `false`。
`passEntryParameters` 控制跳转时是否携带原站已有的来源与查询参数。

## 与原站的明确差异

- 广告追踪默认移除，没有加载原站 Meta Pixel，也没有发送原站统计请求。
- 保留倒计时重置规则，修复结束时引用未定义变量 `d` 的错误。
- 首次后退仍展示弹窗，但关闭后再次后退可离开，避免原站无限拦截后退。
- 增加页面语言、搜索框标签、弹窗键盘关闭及焦点管理，不改视觉样式。
- 原站的搜索框、手机菜单/搜索图标并未实现实际搜索或展开菜单，本项目保留其原样；社交标签原本也是订购链接，未改为真正的分享功能。
- 浏览器访问原站时部分素材偶发加载失败；本项目重试下载后全部补齐，显示原始图片，不复刻临时网络故障。

后台、订单处理与广告追踪配置留待后续阶段。此项目未替你发布到 GitHub。
