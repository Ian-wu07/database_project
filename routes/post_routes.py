from flask import Blueprint, jsonify, request, session, redirect, url_for
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
        cursor.execute("SELECT User_ID, User_Identity FROM user WHERE User_Name = %s AND User_Password = %s", (username, password))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            print(user)
            session['user_id'] = user['User_ID']
            if user['User_Identity'] == 1:
                redirect_url = "/home"
            elif user['User_Identity'] == 0:
                redirect_url = "/manage"
            else:
                return jsonify({'error': 'Invalid user'}), 401
            response = {"redirect_to": redirect_url}
            print(response)  # 打印響應
            return jsonify({"redirect_to": redirect_url}), 200
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
        email= data.get('Email')
        experience1 = data.get('Experience_1')
        experience2 = data.get('Experience_2')
        experience3 = data.get('Experience_3')
        introduction = data.get('Introduction')

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE User
            SET 
                Email = %s
            WHERE 
                User_ID = %s;
        """, (email, resume_id))

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

@post_routes.route('/api_change_job', methods=['POST', 'PUT', 'DELETE'])
def api_change_job():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        if request.method == 'POST':
            data = request.get_json()
            if any(value is None or value == "" for value in data.values()):
                return jsonify({"error": "Some parameters are missing or empty"}), 400
            job_title = data.get('Job_title')
            salary = int(data.get('Salary'))
            content = data.get('Content')
            job_address = data.get('Job_Address')
            payment = data.get('Payment')
            paydate = data.get('Paydate')
            quantity = int(data.get('Quantity'))
            contact = data.get('Contact')
            phone = data.get('Phone')
            category = data.get('Category')
            working_hours = data.get('Working_Hours')
            job_state = int(data.get('Job_State'))

            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor()
            #取得category_num
            cursor.execute("SELECT Serial_Number FROM Category_about_Job WHERE Category_content = %s", (category,))
            category_num = cursor.fetchone()[0]

            #取得working_hours_num
            cursor.execute("SELECT Serial_Number FROM Working_Hours_about_Job WHERE Working_Hours_content = %s", (working_hours,))
            working_hours_num = cursor.fetchone()[0]

            cursor.execute("""
                INSERT INTO Job (Job_title, Salary, Content, Job_Address, Payment, Paydate, Quantity, Contact, Phone, Category_Num, Working_Hours_Num, Job_State)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (job_title, salary, content, job_address, payment, paydate, quantity, contact, phone, category_num, working_hours_num, job_state))
            conn.commit()
            cursor.close()
            conn.close()

            return jsonify({'message': 'Job submitted successfully'})

        elif request.method == 'PUT':
            data = request.get_json()
            job_id = data.get('Job_ID')
            job_title = data.get('Job_title')
            salary = data.get('Salary')
            content = data.get('Content')
            job_address = data.get('Job_Address')
            payment = data.get('Payment')
            paydate = data.get('Paydate')
            quantity = data.get('Quantity')
            contact = data.get('Contact')
            phone = data.get('Phone')
            category = data.get('Category')
            working_hours = data.get('Working_Hours')
            job_state = data.get('Job_State')

            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor()
            #取得category_num
            cursor.execute("SELECT Serial_Number FROM Category_about_Job WHERE Category_content = %s", (category,))
            category_num = cursor.fetchone()[0]

            #取得working_hours_num
            cursor.execute("SELECT Serial_Number FROM Working_Hours_about_Job WHERE Working_Hours_content = %s", (working_hours,))
            working_hours_num = cursor.fetchone()[0]

            cursor.execute("""
                UPDATE Job
                SET 
                    Job_title = %s,
                    Salary = %s,
                    Content = %s,
                    Job_Address = %s,
                    Payment = %s,
                    Paydate = %s,
                    Quantity = %s,
                    Contact = %s,
                    Phone = %s,
                    Category_Num = %s,
                    Working_Hours_Num = %s,
                    Job_State = %s
                WHERE 
                    Job_ID = %s;
            """, (job_title, salary, content, job_address, payment, paydate, quantity, contact, phone, category_num, working_hours_num, job_state, job_id))
            
            conn.commit()
            cursor.close()
            conn.close()

            return jsonify({'message': 'Job updated successfully'})

        elif request.method == 'DELETE':
            data = request.get_json()
            job_id = data.get('Job_ID')

            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor()
            cursor.execute("DELETE FROM Job WHERE Job_ID = %s", (job_id,))
            conn.commit()
            # 返回刪除之前
            # conn.rollback()
            cursor.close()
            conn.close()

            return jsonify({'message': 'Job deleted successfully'})
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    
@post_routes.route('/api_change_user', methods=['POST', 'PUT', 'DELETE'])
def api_change_user():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        if request.method == 'POST':
            data = request.get_json()
            if any(value is None or value == "" for value in data.values()):
                return jsonify({"error": "Some parameters are missing or empty"}), 400
            print(data)

            user_name = data.get('User_Name')
            email = data.get('Email')
            user_password = data.get('User_Password')
            user_identity = int(data.get('User_Identity'))

            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO User (User_Name, Email, User_Password, User_Identity)
                VALUES (%s, %s, %s, %s)
            """, (user_name, email, user_password, user_identity))
                           
            conn.commit()
            cursor.close()
            conn.close()

            return jsonify({'message': 'User submitted successfully'})

        elif request.method == 'PUT':
            data = request.get_json()
            user_id= data.get('User_ID')
            user_name = data.get('User_Name')
            email = data.get('Email')
            user_password = data.get('User_Password')
            user_identity = int(data.get('User_Identity'))

            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE User
                SET 
                    User_Name = %s,
                    Email = %s,
                    User_Password = %s,
                    User_Identity = %s
                WHERE 
                    User_ID = %s;
            """, (user_name, email, user_password, user_identity, user_id))
            conn.commit()
            cursor.close()
            conn.close()

            return jsonify({'message': 'User updated successfully'})

        elif request.method == 'DELETE':
            data = request.get_json()
            user_id = data.get('User_ID')

            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor()
            cursor.execute("DELETE FROM User WHERE User_ID = %s", (user_id,))
            conn.commit()
            # 返回刪除之前
            # conn.rollback()
            cursor.close()
            conn.close()

            return jsonify({'message': 'User deleted successfully'})
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    