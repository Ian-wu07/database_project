from flask import Flask, render_template, jsonify, request, redirect, url_for, session
import mysql.connector
from flask_session import Session
import os
import shutil
from datetime import timedelta

app = Flask(__name__)

# 設置密鑰和 Session 配置
app.secret_key = '123'
app.config['SESSION_TYPE'] = 'filesystem'  # 使用文件系統來存儲 session
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=1)
app.config['SESSION_FILE_DIR'] = './flask_session/'
# 初始化 Session
Session(app)
def clear_session_folder():
    folder = app.config['SESSION_FILE_DIR']
    if os.path.exists(folder):
        shutil.rmtree(folder)
    os.makedirs(folder)

# 在應用啟動時清除 session 文件夾
clear_session_folder()

# 設置 MySQL 資料庫連接參數
db_config = {
    'user': 'team9',
    'password': '2v7)5Qil1qD@ItqI',
    'host': '140.122.184.129',
    'port': '3310',
    'database': 'team9'
}

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/home')
def home():
        return render_template('home.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/resume')
def resume():
        return render_template('resume.html')

@app.route('/api_check_login', methods=['GET'])
def api_check_login():
    print('session',session)
    if 'user_id' in session:
        return jsonify({'success': True, 'message': 'Already logged in'})
    else:
        return jsonify({'success': False, 'message': 'Not logged in'})
    
@app.route('/api_login', methods=['POST'])
def api_login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT User_ID FROM user WHERE User_Name = %s AND User_Password = %s", (username, password))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            session['user_id'] = user['User_ID']
            return jsonify({'message': 'Login successful'})
        else:
            return jsonify({'error': 'User not found or Password incorrect'}), 401
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

@app.route('/api_logout', methods=['POST'])
def api_logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logout successful'})

@app.route('/api_save_favorite', methods=['POST'])
def api_save_favorite():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        data = request.get_json()
        list_id = session['user_id']
        delete_jobs = data.get('delete', [])
        insert_jobs = data.get('insert', [])
        
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        if delete_jobs:
            for job_id in delete_jobs:
                cursor.execute("DELETE FROM List WHERE List_ID = %s AND Job_ID = %s",(list_id, job_id))
        if insert_jobs:
            for job_id in insert_jobs:
                cursor.execute("INSERT INTO List (List_ID, Job_ID) VALUES (%s, %s, %s)", 
                       (list_id, job_id))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Favorite list saved successfully'}), 200
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    
@app.route('/api_submit_resume', methods=['POST'])
def api_submit_resume():
    if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.get_json()
        resume_id = session['user_id']
        sex = data.get('sex')
        education = data.get('education')
        phone = data.get('phone')
        identify_id = data.get('identify_id')
        birth = data.get('birth')
        experience1 = data.get('experience1')
        experience2 = data.get('experience2')
        experience3 = data.get('experience3')
        introduction = data.get('introduction')

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE Resume
            SET 
                Sex = %s,
                Education = %s,
                Phone = %s,
                Identify_ID = %s,
                Birth = %s,
                Experience_1 = %s,
                Experience_2 = %s,
                Experience_3 = %s,
                Introduction = %s
            WHERE 
                Resume_ID = %s;
        """,
        (sex, education, phone, identify_id, birth, experience1, experience2, experience3, introduction, resume_id))
        
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Resume submitted successfully'})
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    
@app.route('/api_register', methods=['POST'])
def api_register():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO user ( Name, Email, Password) VALUES (%s, %s, %s)", 
                       (name, email, password))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Registered successfully'})
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

@app.route('/api_get_jobs', methods=['GET'])
def api_get_jobs():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute = ("""
            SELECT 
                Job.Job_title,
                Job.Salary,
                Job.Content,
                Job.Job_Address,
                Job.Payment,
                Job.Paydate,
                Job.Quantity,
                Job.Contact,
                Job.Phone,
                Category_about_Job.Category_content AS Category,
                Working_Hours_about_Job.Working_Hours_content AS Working_Hours,
                Job.Job_State
            FROM 
                Job 
            LEFT JOIN 
                Working_Hours_about_Job ON Job.Working_Hours_Num = Working_Hours_about_Job.Serial_Number 
            LEFT JOIN 
                Category_about_Job ON Job.Category_Num = Category_about_Job.Serial_Number;
        """)
        results = cursor.fetchall()
        cursor.close()
        conn.close()

        jobs = []
        for row in results:
            job = {
                'Job_title': row[0],
                'Salary': row[1],
                'Content': row[2],
                'Address': row[3],
                'Payment': row[4],
                'Paydate': row[5],
                'Quantity': row[6],
                'Contact': row[7],
                'Phone': row[8],
                'Category': row[9],
                'Hours': row[10],
                'Job_State': row[11]
            }
            jobs.append(job)

        return jsonify(jobs)
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    
@app.route('/api_get_resume', methods=['GET'])
def api_get_resume():
    if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401

    try:      
        user_id = session['user_id']
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT 
                User_Name,
                Email,
                Sex,
                Education,
                Phone,
                Identify_ID,
                Birth,
                Experience_1,
                Experience_2,
                Experience_3,
                Introduction
            FROM
                Resume INNER JOIN User ON Resume_ID = %s;
            """,(user_id))
        results = cursor.fetchone()
        cursor.close()
        conn.close()

        resume_info = []
        for row in results:
            info = {
                'User_Name': row[0],
                'Email': row[1],
                'Sex': row[2],
                'Education': row[3],
                'Phone': row[4],
                'Identify_ID': row[5],
                'Birth': row[6],
                'Experience_1': row[7],
                'Experience_2': row[8],
                'Experience_3': row[9],
                'Introduction': row[10]
            }
            resume_info.append(info)
        if resume_info:
            return jsonify(resume_info)
        else:
            return jsonify({'error': 'resume not found'}), 404
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

if __name__ == '__main__':
    app.run(debug=True)
