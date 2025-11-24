<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 極致切圖：靈動網格大師

這是一款專為視覺設計師與行銷團隊打造的網頁工具，能將單張素材快速切割成多張精準拼圖，並提供進階的顏色去除與批次下載功能，讓社群排版、互動拼貼與響應式網格設計一次完成。

查看 AI Studio 範例： https://ai.studio/apps/drive/1GpyVc5bO_Xu8Y8PPKhmVTBgNE3qc7NJm

## 功能亮點
- 可上傳 JPG/PNG/WEBP，並自訂列數、欄數與上下左右 padding，立即預覽切割網格。
- 內建顏色去除工具，輸入目標色碼與容差即可清除背景色，再回復原圖或重新切割。
- 切割後自動生成小圖集，支援單張下載或一次打包全部切片。
- 使用平滑暗色系 UI 與即時滾動提示，桌機與行動裝置皆易於操作。

## 技術堆疊
- React + TypeScript + Vite 建構前端介面。
- Tailwind 風格化設計與 lucide-react 圖示。
- 自訂 `splitImage` 與 `removeColorFromImage` 工具處理影像。

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Deploy with GitHub CI/CD

1. 建立 `main` 分支並推送程式碼到 GitHub。
2. 到 repo 的 **Settings → Pages**，將 **Source** 設定為 **GitHub Actions**。
3. 每次推送到 `main`（或在 Actions 分頁手動觸發 workflow）時，`.github/workflows/deploy.yml` 會：
   - 安裝 Node.js 20 並執行 `npm ci`
   - 透過 `npm run build` 產生 `dist` 靜態檔案
   - 上傳 `dist` artifact 並部署到 GitHub Pages
4. 部署完成後，deploy job 會輸出公開網址；你也可以在 **Settings → Pages** 看到最終網址。
