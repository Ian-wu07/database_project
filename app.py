from flask import Flask, render_template, redirect, url_for
from flask_session import Session
from datetime import timedelta
import os
import shutil

# Import the Blueprints
from routes import get_routes, post_routes

app = Flask(__name__)

# 設置密鑰和 Session 配置
app.secret_key = '123'
app.config['SESSION_TYPE'] = 'filesystem'  # 使用文件系統來存儲 session
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=1)
app.config['SESSION_FILE_DIR'] = './flask_session/'
# 初始化 Session
Session(app)

# 註冊藍圖
app.register_blueprint(get_routes)
app.register_blueprint(post_routes)

# 在應用啟動時清除 session 文件夾
@app.before_first_request
def before_first_request():
    folder = app.config['SESSION_FILE_DIR']
    if os.path.exists(folder):
        shutil.rmtree(folder)
    os.makedirs(folder)

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/home')
def home():
        return render_template('home.html')

@app.route('/resume')
def resume():
        return render_template('resume.html')

if __name__ == '__main__':
    app.run(debug=True)
