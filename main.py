from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from database import Database
from users import UserController

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'lmaolmao' 
jwt = JWTManager(app)

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
    if user:
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    cursor.register_user(username, password)
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

if __name__ == '__main__':
    app.run(debug=True)