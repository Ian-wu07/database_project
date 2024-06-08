from flask import Blueprint, jsonify, session
import mysql.connector
from config import db_config

get_routes = Blueprint('get_routes', __name__)

@get_routes.route('/api_check_login', methods=['GET'])
def api_check_login():
    try:
        if 'user_id' in session:
            print('session', session)
            return jsonify({'success': True, 'message': 'Already logged in'})
        else:
            return jsonify({'success': False, 'message': 'Not logged in'})
    except Exception as e:
        return jsonify({'error': 'An error occurred: ' + str(e)}), 500

@get_routes.route('/api_logout', methods=['GET'])
def api_logout():
    try:
        session.pop('user_id', None)
        return jsonify({'message': 'Logout successful'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@get_routes.route('/api_get_users', methods=['GET'])
def api_get_users():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM user")
        users = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify(users)
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

@get_routes.route('/api_get_jobs', methods=['GET'])
def api_get_jobs():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT 
                Job.Job_ID,
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
        jobs = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify(jobs)
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    
@get_routes.route('/api_get_favorite', methods=['GET'])
def api_get_favorite():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        list_id = session['user_id']
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT
                Job.Job_ID,
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
                Category_about_Job ON Job.Category_Num = Category_about_Job.Serial_Number
            WHERE 
                Job.Job_ID IN (
                    SELECT Job_ID 
                    FROM List 
                    WHERE List_ID = %s
                )
             """, (list_id,))
        favorite_jobs = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify(favorite_jobs)
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

@get_routes.route('/api_get_resume', methods=['GET'])
def api_get_resume():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        resume_id = session['user_id']
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
                Resume INNER JOIN User ON Resume.Resume_ID = User.User_ID
            WHERE
                Resume.Resume_ID = %s;
            """, (resume_id,))
        resume_info = cursor.fetchall()
        cursor.close()
        conn.close()

        if resume_info:
            return jsonify(resume_info)
        else:
            return jsonify({'error': 'resume not found'}), 404
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
