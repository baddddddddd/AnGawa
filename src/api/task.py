from common import *


class TaskAPI:
    # Create task
    @app.route("/api/task", methods=["POST"])
    @jwt_required()
    def create_task():
        pass


    # Get task details
    @app.route("/api/task", methods=["PUT"])
    @jwt_required()
    def get_task():
        user_id = get_jwt_identity()


    # Update task
    @app.route("/api/task", methods=["PUT"])
    @jwt_required()
    def update_task():
        user_id = get_jwt_identity()


    # Delete task
    @app.route("/api/task", methods=["DELETE"])
    @jwt_required()
    def delete_task():
        user_id = get_jwt_identity()


    # Generate schedule
    @app.route("/api/task/generate", methods=["GET"])
    @jwt_required()
    def generate_schedule():
        user_id = get_jwt_identity()
