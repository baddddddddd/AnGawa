from common import *

from quiz_gen import *
from notes import NoteManager

import json

class QuizAPI:
    @app.route("/api/flashcards", methods=["POST"])
    @jwt_required()
    def generate_flashcards():
        user_id = get_jwt_identity()

        data = request.get_json()
        note_id = data.get("note_id", None)

        is_bad_request = check_missing_data(note_id,)
        if is_bad_request:
            return is_bad_request
        
        note = NoteManager._NoteManager__get_note(user_id, note_id)
        note_content = json.loads(note["NoteContent"])

        result = []
        for bullet in note_content:
            generator = FillInTheBlanksQuestion(bullet["text"])
            items = generator.generate_question()
            result += [item.to_json() for item in items]
        
        return jsonify(items=result), 200
    

    @app.route("/api/generate/matching", methods=["POST"])
    @jwt_required()
    def generate_matching_type():
        user_id = get_jwt_identity()

        data = request.get_json()
        note_id = data.get("note_id", None)

        is_bad_request = check_missing_data(note_id,)
        if is_bad_request:
            return is_bad_request
        
        note = NoteManager._NoteManager__get_note(user_id, note_id)
        note_content = json.loads(note["NoteContent"])

        bullets = [bullet["text"] for bullet in note_content]

        generator = MatchingTypeQuestion(bullets)
        result = generator.generate_question()

        questions = [question.to_json() for question in result["questions"]]
        choices = result["choices"]

        return jsonify(questions=questions, choices=choices), 200
    