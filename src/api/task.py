import sys
from common import *
sys.path.append("\core")
from core.scheduler_beta import TaskScheduler

class TaskAPI:
    
    def __get_user_with_id(id):
        query = "SELECT * FROM Tasks WHERE UserId=%s"
        params = (id,)

        result = db.execute_query(query, params, False)
        return result
    
    def energy_consumption(task_id):
        query = "SELECT duration, fatiguing_level FROM tasks WHERE task_id = %s"
        result = db.execute_query(query, (task_id,))
        if result and result[0]["Duration"] is not None and result[0]["FatiguingLevel"] is not None:
            duration = result[0]["Duration"]
            fatiguing_level = result[0]["FatiguingLevel"]
            return duration * fatiguing_level
        else:
            return 0
        
    # Create task
    @app.route("/api/task", methods=["POST"])
    @jwt_required()
    def create_task():
        user_id = get_jwt_identity()
        data = request.get_json()

        task_name = data.get("task_name", None)
        description = data.get("description", None)
        deadline = data.get("deadline", None)
        duration = data.get("duration", None)
        fatiguing_level = data.get("fatiguing_level", None)

        result = check_missing_data(task_name,description,deadline,duration,fatiguing_level)
        if result is not None:
            return result
        
        query = "SELECT MAX(Priority) FROM Tasks WHERE UserId = %s"
        params = (user_id,)
        result_set = db.execute_query(query, params)

        if result_set and result_set[0]("MAX(Prioirty)") is not None:
            max_priority = result_set[0]["MAX(Prioirty)"]
        else:
            max_priority = 0
        priority = max_priority + 1 if max_priority is not None else 1

        query = "INSERT into Tasks (TaskName, Description, Deadline, Duration, Priority, FatiguingLevel, UserId) VALUES (%s, %s, %s, %s, %s, %s,%s)"
        params = (task_name, description, deadline, duration, priority, fatiguing_level, user_id)
        db.execute_and_commit(query,params)

        return jsonify(msg="Task was succesfully created"),200



    # Get task details
    @app.route("/api/task", methods=["GET"])
    @jwt_required()
    def get_task():
        user_id = get_jwt_identity()

        user = TaskAPI.__get_user_with_id(user_id)

        return jsonify(
            task_name = user["TaskName"],
            description = user["Description"],
            deadline = user["Deadline"],
            duration = user["Duration"],
            fatiguing_level = user["FatiguingLevel"]
        ), 200


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

        user = TaskAPI.__get_user_with_id(user_id)
        if user is None:
            return jsonify(msg="Account does not exist"), 401
        
        task_id = request.json.get("TaskId")
        if user is None:
            return jsonify(msg="Task does not exist"), 401
        
        query = "DELETE FROM Tasks WHERE TaskId = %s and UserId = %s"
        params = (task_id, user_id)

        db.execute_and_commit(query, params)

        return jsonify(msg="Account was successfully deleted"), 20
            
    # Generate schedule
    @app.route("/api/task/generate", methods=["GET"])
    @jwt_required()
    def generate_schedule():
        user_id = get_jwt_identity()

        query = "SELECT * FROM Tasks WHERE UserId = %s"
        tasks = db.execute_query(query, (user_id,))

        """
        query = "SELECT TotalEnergy FROM UserSettings WHERE UserID = %s"
        total_energy = db.execute_query(query, (user_id,))[0]["TotalEnergy"]
        """

        total_energy = 300
        work_intervals = ["08:00:00-12:00:00", "13:00:00-17:00:00", "20:00:00-00:00:00"]
        scheduler = TaskScheduler()
        scheduled_tasks = scheduler.schedule_tasks(total_energy, work_intervals)
        
        if scheduled_tasks is not None:
            return jsonify({"scheduled_tasks": scheduled_tasks}), 200
        else:
            return jsonify(msg="Tasks are empty"), 401

