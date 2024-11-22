# CRM Web

## 專案說明

CRM 系統使用者手冊

1. 系統概述
   本 CRM (客戶關係管理) 系統是一個基於 Web 的應用程式，主要用於管理客戶資料、銷售數據和業務分析。系統採用 Vue.js 框架開發，提供直觀的使用者介面和完整的資料管理功能。
   主要功能模組：
   - 儀表板（Dashboard）: 系統首頁，顯示重要統計數據
   - 銷售資料管理 : 查看和管理銷售相關數據
   - 客戶資料管理 : 查看和管理客戶相關數據
   - 業務資料管理 (TBD) : 查看和管理業務相關數據

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

```sh
<!-- 設定資料庫連線 -->
const sqlConfig = {
user: process.env.DB_USER || 'root',
password: process.env.DB_PASSWORD || 'root',
server: process.env.DB_SERVER || '127.0.0.1',
port: parseInt(process.env.DB_PORT) || 1433,
database: process.env.DB_NAME || 'WWCRM',
options: {
trustServerCertificate: true,
encrypt: false
}
}
```
