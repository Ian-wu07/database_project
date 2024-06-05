from flask import Flask, render_template, jsonify, request, redirect, url_for
import mysql.connector

app = Flask(__name__)

# 設置 MySQL 資料庫連接參數
db_config = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'team21'
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

@app.route('/api_save_favorite', methods=['POST'])
def api_save_favorite():
    try:
        data = request.json
        list_id = data.get('List_ID')
        list_title = ''
        favorite_jobs = data.get('Job_ID')
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM List WHERE List_ID = %s", (list_id,))
        cursor.execute("INSERT INTO List (List_ID, List_title, Job_ID) VALUES (%s, %s, %s)", 
                       (list_id, list_title, favorite_jobs))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Favorite list saved successfully'}), 200
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    
@app.route('/api_submit_resume', methods=['POST'])
def api_submit_resume():
    try:
        data = request.get_json()
        resume_id = data.get('resume_id')
        name = data.get('name')
        sex = data.get('sex')
        education = data.get('education')
        phone = data.get('phone')
        identify_id = data.get('identify_id')
        birth = data.get('birth')
        email = data.get('email')
        experience = data.get('experience')
        introduction = data.get('introduction')

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO Resume (Resume_ID, Name, Sex, Education, Phone, Identify_ID, Birth, Email, Experience, Introduction) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                       (resume_id, name, sex, education, phone, identify_id, birth, email, experience, introduction))
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
        user_id = data.get('user_id')
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        phone = data.get('phone')
        
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO user (User_ID, Name, Email, Password, Phone) VALUES (%s, %s, %s, %s, %s)", (user_id, name, email, password, phone))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Registered successfully'})
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

@app.route('/api_login', methods=['POST'])
def api_login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT USER_ID FROM user WHERE Name = %s AND Password = %s", (username, password))
        results = cursor.fetchall()
        cursor.close()
        conn.close()

        if len(results) > 0:
            return jsonify({'message': 'Login successful'})
        else:
            return jsonify({'error': 'user not found or password incorrect'}), 401
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    
@app.route('/api_get_jobs', methods=['GET'])
def api_get_jobs():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Job")
        results = cursor.fetchall()
        cursor.close()
        conn.close()

        jobs = []
        for row in results:
            job = {
                'Job_ID': row[0],
                'Job_title': row[1],
                'Salary': row[2],
                'Content': row[3],
                'Address': row[4],
                'Payment': row[5],
                'Paydate': row[6],
                'Quantity': row[7],
                'Contact': row[8],
                'Phone': row[9],
                'Category': row[10],
                'Hours': row[11]
            }
            jobs.append(job)

        return jsonify(jobs)
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

@app.route('/api_get_user_info', methods=['GET'])
def api_get_user_info():
    try:
        user_id = request.args.get('user_id')
        
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT Name, Email, Phone FROM user WHERE User_ID = %s", (user_id,))
        user_info = cursor.fetchone()
        cursor.close()
        conn.close()

        if user_info:
            return jsonify(user_info)
        else:
            return jsonify({'error': 'User not found'}), 404
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    


if __name__ == '__main__':
    app.run(debug=True)
