# 目錄
- [網站](#網站)
- [本機架設](#本機架設)
- [更新紀錄](#更新紀錄)
- [如何新增東西](#如何新增東西)
- [目錄結構](#目錄結構)
--------------------------------
--------------------------------
## 網站
- 目前預設cookie保留1小時，超過後需要重登

### Render: https://database-project-djw5.onrender.com
- 主要網站，順暢度較好
- 如果太久沒人使用，後面第1個人進入會需要等待約1分鐘

### Vercel: https://database-project-six.vercel.app/
- 次要預備網站，較為卡頓，會有丟失cookie的問題，可能需要多次重整網頁

--------------------------------
--------------------------------
## 本機架設

#### 這是一個搭配( HTML + JS + CSS )、Python(Flask)、MySQL的專案

1. 運行 `pip install -r requirements.txt`
2. `config.py` 調整 MySQL 的設定
3. 運行 `python app.py` 即可架設在本機 localhost
4. 在 cmd 上按下 Flask 給的網址就能看到網站

--------------------------------
--------------------------------
## 更新紀錄 (共開發48小時 + 整理js 2小時)

### 6/11 1:15pm 更新
- 整理js (部分api function化、顯示修正)

### 6/10 3:03am 更新
- <span style="color: blue; font-weight: bold; font-size:20px;">伺服器成功架設！！</span> 🎉🎉
- 修正一些bug (Resume的Name沒有更新到資料庫等等...)
- 加入輸入規則、提醒

-------------------
### 6/9 6:57am 更新
- 全部功能都已完成 (搜尋工作依然是前端處理)
- 名子一樣尚未檢查
- 對網頁美觀有甚麼看法歡迎提出
- 尚未部署伺服器

-------------------
### 6/7 9:16pm 更新
- api全部修正完畢，除了搜尋工作還沒修改
- 將後端分類module化，詳情請看 [目錄結構](#目錄結構)

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
    - 在 `app.py` 文件中新增渲染網頁
    - 在 `routes` 目錄下新增 API 來處理資料庫交互

4. SQL 資料庫：
    - 在 `sql/` 目錄下寫測試資料

#### 新增東西流程

1. 想好功能和網頁後，在 `templates/` 目錄下新增相應的 HTML 文件
2. 在 `static/` 目錄下新增相應的 JavaScript 和 CSS 文件
3. 在 `app.py` 和 `routes` 中新增渲染網頁和所需的 API，具體可以參考現有的實現或向 GPT 提問

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
    - requirements.txt  &emsp;(需要的套件版本)
    - vercel.json &emsp;&emsp;(架設vercel需要的設定檔)
    - .gitignore &emsp;&emsp;&emsp;(不讓git上去的檔案)



