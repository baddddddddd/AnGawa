from flask import Flask, jsonify, request
from database import Database
from users import UserController

app = Flask(__name__)

db = Database(
    host="127.0.0.1",
    user="root",
    password="pass",
    database="angawa_db"
)

cursor = UserController(db)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = cursor.authenticate_user(username, password)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    cursor.register_user(username, password)

if __name__ == '__main__':
    app.run(debug=True)