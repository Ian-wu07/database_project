## 更新紀錄

### 6/5 5:05am 更新

- 添加了前後端以及資料庫的連接架構

### 如何新增東西

1. JavaScript 和 CSS：
    - 在 `static/` 目錄下寫 JavaScript 和 CSS

2. HTML：
    - 在 `templates/` 目錄下寫 HTML 模板

3. Python Flask：
    - 在 `app.py` 文件中新增渲染網頁和 API 來處理資料庫交互

4. SQL 資料庫：
    - 在 `sql/` 目錄下寫測試資料

### 目錄結構
- final/
  - templates/
    - index.html
  - static/
    - script.js
  - sql/
    - data.sql
  - app.py

### 新增東西流程

1. 想好功能和網頁後，在 `templates/` 目錄下新增相應的 HTML 文件
2. 在 `static/` 目錄下新增相應的 JavaScript 和 CSS 文件
3. 在 `app.py` 文件中新增渲染網頁和所需的 API，具體可以參考現有的實現或向 GPT 提問

by 吳銘恩

