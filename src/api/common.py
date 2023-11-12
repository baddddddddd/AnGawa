from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, create_refresh_token, get_jwt_identity

from database import DatabaseManager

import datetime
import os

from dotenv import load_dotenv
load_dotenv()

# Set up Flask app
app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = datetime.timedelta(days=30)
jwt = JWTManager(app)
CORS(app)

db = DatabaseManager(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)


def check_missing_data(*required_data):
    for data in required_data:
        if data is None:
            return jsonify(msg="Bad Request"), 400
        
    return None
