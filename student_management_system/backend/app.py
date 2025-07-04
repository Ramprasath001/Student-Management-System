from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
from config import DB_CONFIG

app = Flask(__name__)
CORS(app)

# Connect to MySQL
conn = mysql.connector.connect(**DB_CONFIG)
cursor = conn.cursor(dictionary=True)

@app.route('/')
def home():
    return "Student Management System API is running!"

# REGISTER
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    email = data['email']
    password = data['password']

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
            (username, email, hashed_password.decode('utf-8'))
        )
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400

# LOGIN
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({"message": "Login successful", "user_id": user['id']}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401
@app.route('/students', methods=['POST'])
def add_student():
    data = request.json
    print("Received data:", data)  # 👈 Add this to see what frontend sends

    name = data['name']
    email = data['email']
    course = data['course']
    year = int(data['year'])  # 👈 Make sure it's int
    user_id = int(data['user_id'])  # 👈 Ensure it's also int

    try:
        cursor.execute(
            "INSERT INTO students (name, email, course, year, user_id) VALUES (%s, %s, %s, %s, %s)",
            (name, email, course, year, user_id)
        )
        conn.commit()
        return jsonify({"message": "Student added!"}), 201
    except mysql.connector.Error as err:
        print("Error adding student:", err)  # 👈 Show exact DB error
        return jsonify({"error": str(err)}), 400

@app.route('/students/<int:user_id>', methods=['GET'])
def get_students(user_id):
    cursor.execute("SELECT * FROM students WHERE user_id = %s", (user_id,))
    students = cursor.fetchall()
    return jsonify(students)

@app.route('/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    try:
        cursor.execute("DELETE FROM students WHERE id = %s", (student_id,))
        conn.commit()
        return jsonify({"message": "Student deleted"}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400

@app.route('/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    data = request.json
    name = data['name']
    email = data['email']
    course = data['course']
    year = int(data['year'])

    try:
        cursor.execute(
            "UPDATE students SET name=%s, email=%s, course=%s, year=%s WHERE id=%s",
            (name, email, course, year, student_id)
        )
        conn.commit()
        return jsonify({"message": "Student updated"}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400


if __name__ == '__main__':
    app.run(debug=True)
