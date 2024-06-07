# 目錄
- [更新紀錄](#更新紀錄)
- [如何新增東西](#如何新增東西)
- [目錄結構](#目錄結構)
--------------------------------
--------------------------------
## 更新紀錄

### 6/7 9:16pm 更新
- api全部修正完畢，除了搜尋工作還沒修改
- 將後端分類module化，詳情請看 __目錄結構__

#### 疑問：
1. resume的欄位是全部都可以改嗎，還是有些是唯讀
2. 註冊有需要甚麼限制嗎，還是開放同名且可同密碼
----------------------
### 6/7 5:00am 更新
- 添加驗證使用者是否有login才使用主頁功能

#### 提醒 by 吳銘恩
- 記得我要拿資料庫的指令
-----------------------
### 6/5 10:11pm 更新
- 添加resume網頁
- 工作搜尋功能
- 一部分最愛清單功能

#### 有待討論項目：
1. 那些資料欄的id是我們後臺去給予的嗎
2. user登入分求職者跟管理員是要用甚麼去做分別
3. list的多個工作怎麼存
4. 各個資料表怎麼去做連結

----------------
### 6/5 5:05am 更新

- 建構出了前後端以及資料庫的連接架構
-----------------------------------------
-----------------------------------------
### 如何新增東西

1. JavaScript 和 CSS：
    - 在 `static/` 目錄下寫 JavaScript 和 CSS

2. HTML：
    - 在 `templates/` 目錄下寫 HTML 模板

3. Python Flask：
    - 在 `app.py` 文件中新增渲染網頁和 API 來處理資料庫交互

4. SQL 資料庫：
    - 在 `sql/` 目錄下寫測試資料

#### 新增東西流程

1. 想好功能和網頁後，在 `templates/` 目錄下新增相應的 HTML 文件
2. 在 `static/` 目錄下新增相應的 JavaScript 和 CSS 文件
3. 在 `app.py` 文件中新增渲染網頁和所需的 API，具體可以參考現有的實現或向 GPT 提問

--------------------------------------
--------------------------------------

### 目錄結構
- final/
    - templates/    &emsp;&emsp;(存放html)
        - index.html
    - static/       &emsp;&emsp;&emsp;&emsp;(存放js和css)
        - script.js
    - sql/          
        - data.sql  &emsp;(存放SQL表、trigger、function)
        - DDL.sql   &emsp;(存放SQL數據)
    - routes/
        - \_\_init__.py     &emsp;&emsp;(module化需要的輔助py)
        - get_routes.py     &emsp;(GET的api)
        - post_routes.py    &emsp;(POST的api)
    - app.py        &emsp;&emsp;&emsp;&emsp;(主程式)
    - config.py     &emsp;&emsp;&emsp;(database設定)



