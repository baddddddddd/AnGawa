from database import Database
import bcrypt

class UserController:
    def __init__(self, db):
        self.db = db

    def authenticate_user(self, username, password):
        query = "SELECT * FROM users WHERE username = %s"
        user = self.db.execute_query(query, (username,))
        if user and bcrypt.checkpw(password.encode('utf-8'), user[0]['password'].encode('utf-8')):
            return user[0]
        else:
            return None

    def register_user(self, username, email, password):
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        query = "INSERT INTO users (username, email, password) VALUES (%s,%s, %s)"
        self.db.execute_and_commit(query, (username, email, hashed_password))