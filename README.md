# 写给小瓶子的 521

一个为 2026 年 5 月 21 日准备的浪漫信封网页。页面包含暗号进入、信封开合、花瓣/压花氛围、信纸展开、照片夹页、背景音乐控制和结尾二维码暗号。

## 本地预览

```bash
npm install
npm run dev
```

当前开发地址通常是 `http://127.0.0.1:5173/`。如果端口被占用，Vite 会自动换到下一个端口。

## 替换内容

主要内容都在 [src/giftConfig.ts](/Users/peng/Desktop/5.21/src/giftConfig.ts)：

- `passcode`：进入暗号，现在是 `月月鸟`。
- `recipientName` / `senderName`：收信人和署名。
- `letter`：信件正文。支持 `paragraph`、`quote`、`photo` 三种段落。
- `qrMessage`：二维码里藏的暗号，现在是 `我读完啦，来领521`。
- `music.src`：背景音乐路径，默认 `/audio/romantic-piano.mp3`。

照片放到：

```text
public/photos/photo-1.jpg
public/photos/photo-2.jpg
public/photos/photo-3.jpg
```

音乐放到：

```text
public/audio/romantic-piano.mp3
```

音乐建议选 Pixabay 等可商用/可免费使用来源的温柔钢琴曲，并避开标记为 AI Generated 的素材。

## 验证

```bash
npm run lint
npm run build
```

构建通过后可以部署到 Vercel、Netlify、Cloudflare Pages 或任意静态托管服务。
