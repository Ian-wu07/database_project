from flask import Flask, render_template, jsonify, request
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
    return render_template('login.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/register')
def register():
    return render_template('register.html')

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
    
@app.route('/api_get_jobs')
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

if __name__ == '__main__':
    app.run(debug=True)
