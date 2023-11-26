from common import *

from quiz_generator import QuizGenerator
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

        quiz_generator = QuizGenerator()
        result = []
        for bullet in note_content:
            doc = quiz_generator.nlp(bullet["text"])
            items = quiz_generator.to_fill_in_the_blanks(doc)
            result += [item.to_json() for item in items]
        
        return jsonify(items=result), 200

    