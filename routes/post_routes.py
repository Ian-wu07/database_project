from flask import Blueprint, jsonify, request, session
import mysql.connector
from config import db_config

post_routes = Blueprint('post_routes', __name__)

@post_routes.route('/api_login', methods=['POST'])
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

@post_routes.route('/api_register', methods=['POST'])
def api_register():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO User (User_Name, Email, User_Password) VALUES (%s, %s, %s)", (name, email, password))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Registered successfully'})
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

@post_routes.route('/api_save_favorite', methods=['POST'])
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
                cursor.execute("DELETE FROM List WHERE List_ID = %s AND Job_ID = %s", (list_id, job_id))
        if insert_jobs:
            for job_id in insert_jobs:
                cursor.execute("INSERT INTO List (List_ID, Job_ID) VALUES (%s, %s)", (list_id, job_id))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Favorite list saved successfully'}), 200
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

@post_routes.route('/api_submit_resume', methods=['POST'])
def api_submit_resume():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.get_json()
        resume_id = session['user_id']
        sex = data.get('Sex')
        education = data.get('Education')
        phone = data.get('Phone')
        identify_id = data.get('Identify_ID')
        birth = data.get('Birth')
        experience1 = data.get('Experience_1')
        experience2 = data.get('Experience_2')
        experience3 = data.get('Experience_3')
        introduction = data.get('Introduction')

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
        """, (sex, education, phone, identify_id, birth, experience1, experience2, experience3, introduction, resume_id))
        
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Resume submitted successfully'})
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500


