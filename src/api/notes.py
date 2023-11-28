from common import *

import json

class NoteManager:
    DEFAULT_CONTENT = json.dumps([
        {
            "text": "",
            "indentation": 0
        }
    ])

    def __get_note(user_id, note_id):
        query = "SELECT * FROM Notes WHERE NoteID=%s AND UserID=%s"
        params = (note_id, user_id)
        result = db.execute_query(query, params, False)

        return result
    

    def __get_notes_by_user(user_id):
        query = "SELECT * FROM Notes WHERE UserID=%s"
        params = (user_id,)
        result = db.execute_query(query, params)

        return result
    

    def __create_note(user_id):
        query = "INSERT INTO Notes (UserID, NoteTitle, NoteContent) VALUES (%s, %s, %s)"
        params = (user_id, "Untitled Note", NoteManager.DEFAULT_CONTENT)
        result = db.execute_and_commit(query, params)

        return result
    

    def __update_note(user_id, note_id, note_title, note_content):
        query = "UPDATE Notes SET NoteTitle=%s, NoteContent=%s WHERE NoteID=%s AND UserID=%s"
        params = (note_title, json.dumps(note_content), note_id, user_id)
        result = db.execute_and_commit(query, params)

        return result
    

    def __delete_note(user_id, note_id):
        query = "DELETE FROM Notes WHERE UserID=%s AND NoteID=%s"
        params = (user_id, note_id)
        result = db.execute_and_commit(query, params)

        return result
    

    def __rename_note(user_id, note_id, note_title):
        query = "UPDATE Notes SET NoteTitle=%s WHERE UserID=%s AND NoteID=%s"
        params = (note_title, user_id, note_id)
        result = db.execute_and_commit(query, params)

        return result
    

    @app.route("/api/notes/all", methods=["GET"])
    @jwt_required()
    def get_notes_by_user():
        user_id = get_jwt_identity()

        notes = NoteManager.__get_notes_by_user(user_id)

        result = []

        for note in notes:
            note_title = note["NoteTitle"]
            note_id = note["NoteID"]

            result.append({
                "note_title": note_title,
                "note_id": note_id,
            })

        return jsonify(result), 200
    

    @app.route("/api/notes/one", methods=["POST"])
    @jwt_required()
    def get_note():
        user_id = get_jwt_identity()

        data = request.get_json()
        note_id = data.get("note_id", None)

        is_bad_request = check_missing_data(note_id,)
        if is_bad_request:
            return is_bad_request
        
        note = NoteManager.__get_note(user_id, note_id)

        if not note:
            return jsonify(msg="Note does not exist"), 404
        
        return jsonify(
            note_title=note["NoteTitle"],
            note_content=json.loads(note["NoteContent"]),
        ), 200
    

    @app.route("/api/notes", methods=["POST"])
    @jwt_required()
    def create_note():
        user_id = get_jwt_identity()

        success = NoteManager.__create_note(user_id)
        note_id = db.execute_query("SELECT LAST_INSERT_ID()", fetch_all=False)["LAST_INSERT_ID()"]

        if success:
            return jsonify(note_id=note_id), 200
        else:
            return jsonify(msg="Something went wrong"), 500
        

    @app.route("/api/notes", methods=["PUT"])
    @jwt_required()
    def update_note():
        user_id = get_jwt_identity()

        data = request.get_json()
        note_id = data.get("note_id", None)
        note_title = data.get("note_title", None)
        note_content = data.get("note_content", None)

        is_bad_request = check_missing_data(note_id, note_title, note_content)
        if is_bad_request:
            return is_bad_request
        
        is_success = NoteManager.__update_note(user_id, note_id, note_title, note_content)

        if is_success:
            return jsonify(msg="Note updated successfully"), 200
        else:
            return jsonify(msg="Something went wrong."), 500
        

    @app.route("/api/notes", methods=["DELETE"])
    @jwt_required()
    def delete_note():
        user_id = get_jwt_identity()

        data = request.get_json()
        note_id = data.get("note_id", None)

        is_bad_request = check_missing_data(note_id,)
        if is_bad_request:
            return is_bad_request
        
        is_success = NoteManager.__delete_note(user_id, note_id)
        if is_success:
            return jsonify(msg="Note deleted successfully"), 200
        else:
            return jsonify(msg="Something went wrong."), 500
        

    @app.route("/api/notes/rename", methods=["POST"])
    @jwt_required()
    def rename_note():
        user_id = get_jwt_identity()

        data = request.get_json()
        note_id = data.get("note_id", None)
        note_title = data.get("note_title", None)

        is_bad_request = check_missing_data(user_id, note_id, note_title)
        if is_bad_request:
            return is_bad_request
        
        is_success = NoteManager.__rename_note(user_id, note_id, note_title)
        if is_success:
            return jsonify(msg="Note renamed successfully"), 200
        else:
            return jsonify(msg="Something went wrong."), 500
        