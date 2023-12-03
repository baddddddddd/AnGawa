from common import *

import bcrypt
import json


class AccountManager:
    def __get_user_with_email(email):
        query = "SELECT * FROM Users WHERE Email=%s"
        params = (email,)

        result = db.execute_query(query, params, False)
        return result
    

    def __get_user_with_id(id):
        query = "SELECT * FROM Users WHERE UserId=%s"
        params = (id,)

        result = db.execute_query(query, params, False)
        return result
    

    @app.route("/api/refresh", methods=["POST"])
    @jwt_required(refresh=True)
    def refresh_token():
        user_id = get_jwt_identity()
        new_token = create_access_token(identity=user_id)
        return jsonify(access_token=new_token), 200


    @app.route("/api/login", methods=["POST"])
    def verify_login():
        data = request.get_json()

        email = data.get("email", None)
        pw_hash = data.get("pw_hash", None)

        result = check_missing_data(email, pw_hash)
        if result is not None:
            return result
        
        query = "SELECT * FROM Users WHERE Email=%s"
        params = (email,)
        
        user = db.execute_query(query, params, False)
        
        if user is None:
            return jsonify(msg="Account does not exist"), 401
        
        # TK, lacks security, should be done on client-side
        # Hash the inputted password to check against the correct password
        expected_pw_hash = user["HashedPw"].encode("ascii")

        if not bcrypt.checkpw(pw_hash.encode("utf-8"), expected_pw_hash):
            return jsonify(msg="Invalid email or password"), 401
        
        user_id = user["UserId"]
        access_token = create_access_token(identity=user_id)
        refresh_token = create_refresh_token(identity=user_id)
        return jsonify(access_token=access_token, refresh_token=refresh_token), 200


    @app.route("/api/register", methods=["POST"])
    def create_account():
        data = request.get_json()

        first_name = data.get("first_name", None)
        middle_name = data.get("middle_name", None)
        last_name = data.get("last_name", None)
        name_ext = data.get("name_ext", None)
        birthdate = data.get("birthdate", None)
        gender = data.get("gender", None)
        email = data.get("email", None)
        pw_hash = data.get("pw_hash", None)

        result = check_missing_data(first_name, middle_name, last_name, name_ext, birthdate, gender, email, pw_hash)
        if result is not None:
            return result
        
        if AccountManager.__get_user_with_email(email):
            return jsonify(msg="Email address is already registered to an account."), 401

        # TK, lacks security, should be done on client-side
        # Generate a salt and a hash to encrypt passwords before storing to the database
        salt = bcrypt.gensalt()
        pw_hash = bcrypt.hashpw(pw_hash.encode('utf-8'), salt)

        # Insert new account into Users table
        query = "INSERT INTO Users (FirstName, MiddleName, LastName, NameExt, Birthdate, Gender, Email, HashedPw) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        params = (first_name, middle_name, last_name, name_ext, birthdate, gender, email, pw_hash)
        db.execute_and_commit(query, params)

        user = AccountManager.__get_user_with_email(email)
        user_id = user["UserId"]

        # Insert new account's default settings to UserSettings table
        query = "INSERT INTO UserSettings (UserId, TotalEnergy, WorkTime) VALUES (%s, %s, %s)"

        default_worktime = [
            "9:00:00-12:00:00",
            "13:00:00-18:00:00",
            "19:00:00-21:00:00",
        ]

        params = (user_id, 500, json.dumps(default_worktime))
        db.execute_and_commit(query, params)

        access_token = create_access_token(identity=user_id)
        refresh_token = create_refresh_token(identity=user_id)
        return jsonify(access_token=access_token, refresh_token=refresh_token), 200


    @app.route("/api/account", methods=["GET"])
    @jwt_required()
    def get_account():
        user_id = get_jwt_identity()

        user = AccountManager.__get_user_with_id(user_id)

        return jsonify(
            first_name=user["FirstName"],
            middle_name=user["MiddleName"],
            last_name=user["LastName"],
            name_ext=user["NameExt"],
            birthdate=user["Birthdate"],
            gender=user["Gender"],
            email=user["Email"]
        ), 200
    

    @app.route("/api/account", methods=["DELETE"])
    @jwt_required() 
    def delete_account():
        user_id = get_jwt_identity()

        user = AccountManager.__get_user_with_id(user_id)
        if user is None:
            return jsonify(msg="Account does not exist"), 401
        

        query = "DELETE FROM users WHERE UserId=%s"
        params = (user_id,)

        db.execute_and_commit(query, params)

        return jsonify(msg="Account was successfully deleted"), 200
        

    @app.route("/api/account", methods=["PUT"])
    @jwt_required()
    def update_account():
        pass

        # TK, to overhaul
        # user_id = get_jwt_identity()
        # data = request.get_json()
# 
        # if user_id is None:
        #     return jsonify({"error": "Missing user_id parameter"}), 400
# 
        # user_info = cursor.get_info(user_id)
# 
        # if user_info is None:
        #     return jsonify({"error": "User not found"}), 404
# 
        # updated_info = {
        #     "new_first_name": data.get("new_first_name", user_info["first_name"]),
        #     "new_middle_name": data.get("new_middle_name", user_info["middle_name"]),
        #     "new_last_name": data.get("new_last_name", user_info["last_name"]),
        #     "new_name_ext": data.get("new_name_ext", user_info["name_ext"]),
        #     "new_birthdate": data.get("new_birthdate", user_info["birthdate"]),
        #     "new_gender": data.get("new_gender", user_info["gender"]),
        #     "new_hashed_pw": data.get("new_hashed_pw", user_info["hashed_pw"])
        # }
        # 
        # updated_info = {k: v for k, v in updated_info.items() if v is not None}
# 
        # success = cursor.update_user(
        #     user_id,
        #     updated_info["new_first_name"],
        #     updated_info["new_middle_name"],
        #     updated_info["new_last_name"],
        #     updated_info["new_name_ext"],
        #     updated_info["new_birthdate"],
        #     updated_info["new_gender"],
        #     updated_info["new_hashed_pw"]
        # )
        # 
        # if success:
        #     return jsonify({"message": "User updated successfully"}), 200
        # else:
        #     return jsonify({"error": "User could not be updated"}), 500


    def __get_account_settings(user_id):
        query = "SELECT * FROM UserSettings WHERE UserId=%s"
        params = (user_id,)

        result = db.execute_query(query, params, False)
        return result
    

    @app.route("/api/account/settings", methods=["GET"])
    @jwt_required()
    def get_account_settings():
        user_id = get_jwt_identity()

        user_settings = AccountManager.__get_account_settings(user_id)

        return jsonify(
            total_energy=user_settings["TotalEnergy"],
            work_time=user_settings["WorkTime"],
        ), 200


    def __update_account_settings(user_id, total_energy, work_time):
        query = "UPDATE UserSettings SET TotalEnergy=%s, WorkTime=%s WHERE UserId=%s"
        params = (total_energy, work_time, user_id)
        db.execute_and_commit(query, params)


    @app.route("/api/account/settings", methods=["PUT"])
    @jwt_required()
    def update_account_settings():
        user_id = get_jwt_identity()

        data = request.get_json()
        total_energy = data.get("total_energy", None)
        work_time = data.get("work_time", None)

        result = check_missing_data(total_energy, work_time)
        if result is not None:
            return result
        
        AccountManager.__update_account_settings(user_id, total_energy, work_time)

        return jsonify(msg="Account settings successfully updated"), 200
