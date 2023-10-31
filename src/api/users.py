from database import Database
import bcrypt

class UserController:
    def __init__(self, db):
        self.db = db

    def authenticate_user(self, email, hashed_pw):
        query = "SELECT * FROM users WHERE email = %s"
        user = self.db.execute_query(query, (email,))
        if bcrypt.checkpw(hashed_pw.encode('utf-8'), user[0]['hashed_pw'].encode('utf-8')):
             return user[0]['user_id']
        else:
            return None

    def register_user(self,first_name, middle_name, last_name, name_ext, birthdate, gender, email, hashed_pw):
        hashed_password = bcrypt.hashpw(hashed_pw.encode('utf-8'), bcrypt.gensalt())
        query = "INSERT INTO users (first_name, middle_name, last_name, name_ext, birthdate, gender, email, hashed_pw) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)"
        try:
            self.db.execute_and_commit(query, (first_name, middle_name, last_name, name_ext, birthdate, gender, email, hashed_password))
            return True
        except Exception as e:
            print(f"Error registerin user: {e}")
            return False
    
    def delete_user(self, user_id):
        query = "DELETE FROM users WHERE user_id = %s"
        try:
            self.db.execute_and_commit(query, (user_id,))
            return True
        except Exception as e:
            print(f"Error deleting user: {e}")
            return False

    def get_info(self, user_id):
        query = "SELECT * FROM users WHERE user_id = %s"
        result = self.db.execute_query(query, (user_id,))
        
        if result:
            user_info = result[0]  # Access the first element of the result
            return {
                'user_id': user_info['user_id'],
                'pfp': user_info['pfp'],
                'first_name': user_info['first_name'],
                'middle_name': user_info['middle_name'],
                'last_name': user_info['last_name'],
                'name_ext': user_info['name_ext'],
                'birthdate': str(user_info['birthdate']),  # Convert to string for JSON serialization
                'gender': user_info['gender'],
                'email': user_info['email'],
                'hashed_pw':user_info['hashed_pw']
            }
        else:
            return None
     

    def update_user(self, user_id,  new_first_name, new_middle_name, new_last_name, new_name_ext, new_birthdate, new_gender, new_hashed_pw):
        new_hashed_password = bcrypt.hashpw(new_hashed_pw.encode('utf-8'), bcrypt.gensalt())
        query = "UPDATE users SET , first_name = %s, middle_name = %s, last_name = %s, name_ext = %s, birthdate = %s, gender = %s, hashed_pw = %s WHERE user_id = %s"
        self.db.execute_and_commit(query, ( new_first_name,new_middle_name, new_last_name, new_name_ext, new_birthdate, new_gender, new_hashed_password, user_id))
        return True
    
    def email_taken(self, email):
        query = "SELECT * FROM users WHERE email = %s"
        found = self.db.execute_query(query, (email,))
        return found
    
        

        


