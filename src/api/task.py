from common import *
from core.task_scheduler import TaskScheduler
import json

class TaskAPI:
    def __get_user_with_id(id):
        query = "SELECT * FROM Users WHERE UserId=%s"
        params = (id,)

        result = db.execute_query(query, params, False)
        return result
     

    def __get_task_with_id(id):
        query = "SELECT * FROM Tasks WHERE UserId=%s ORDER BY Priority ASC"
        params = (id,)

        result = db.execute_query(query, params)

        return result
    

    def __get_productivity_score(id):
        query = "SELECT COUNT(*) FROM Tasks WHERE UserId=%s AND Status=%s"
        params = (id, "completed")
        completed = db.execute_query(query, params, False)["COUNT(*)"]

        query = "SELECT COUNT(*) FROM Tasks WHERE UserId=%s"
        params = (id,)
        total = db.execute_query(query, params, False)["COUNT(*)"]

        if total == 0:
            return 0

        score = (completed / total) * 0.6 + 0.6
        return score * 100


    def energy_consumption(task_id):
        query = "SELECT Duration, FatiguingLevel FROM Tasks WHERE TaskId = %s"
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

        task_id = data.get("task_id", None)
        task_name = data.get("task_name", None)
        description = data.get("description", None)
        deadline = data.get("deadline", None)
        duration = data.get("duration", None)
        fatiguing_level = data.get("fatiguing_level", None)

        result = check_missing_data(task_id, task_name, description, deadline, duration, fatiguing_level)
        if result is not None:
            return result
        
        query = "SELECT MAX(Priority) FROM Tasks WHERE UserId = %s"
        params = (user_id,)
        result_set = db.execute_query(query, params)

        if result_set and result_set[0]["MAX(Priority)"] is not None:
            max_priority = result_set[0]["MAX(Priority)"]
        else:
            max_priority = 0
        priority = max_priority + 1 if max_priority is not None else 1

        
        query = "INSERT into Tasks (TaskId, TaskName, Description, Deadline, Duration, Priority, FatiguingLevel, UserId, Status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s)"
        params = (task_id, task_name, description, deadline, duration, priority, fatiguing_level, user_id, "pending")
        db.execute_and_commit(query, params)

        return jsonify(msg="Task was succesfully created"), 200



    # Get task details
    @app.route("/api/task", methods=["GET"])
    @jwt_required()
    def get_task():
        user_id = get_jwt_identity()

        tasks = TaskAPI.__get_task_with_id(user_id)

        result = []
        for task in tasks:
            result.append({
                "task_id": task["TaskId"],
                "task_name": task["TaskName"],
                "description": task["Description"],
                "deadline": task["Deadline"],
                "duration": task["Duration"],
                "fatiguing_level": task["FatiguingLevel"],
                "status": task["Status"],
            })

        return jsonify(tasks=result), 200
        # return jsonify(
        #     task_name = task["TaskName"],
        #     description = task["Description"],
        #     deadline = task["Deadline"],
        #     duration = task["Duration"],
        #     fatiguing_level = task["FatiguingLevel"]
        # ), 200


    # Update task
    @app.route("/api/task", methods=["PUT"])
    @jwt_required()
    def update_task():
        user_id = get_jwt_identity()
        data = request.get_json()

        tasks = data.get("tasks", None)
        for priority, task in enumerate(tasks):
            task_id = task.get("task_id", None)
            task_name = task.get("task_name", None)
            description = task.get("description", None)
            deadline = task.get("deadline", None)
            duration = task.get("duration", None)
            fatiguing_level = task.get("fatiguing_level", None)
            status = task.get("status", None)

            result = check_missing_data(task_id, task_name, description, deadline, duration, fatiguing_level, status)
            if result is not None:
                return result

            query = " UPDATE Tasks SET TaskName=%s, Description=%s, Deadline=%s, Duration=%s, FatiguingLevel=%s, Status=%s, Priority=%s WHERE TaskId=%s AND UserId=%s"
            params = (task_name, description, deadline, duration, fatiguing_level, status, priority, task_id, user_id)
            db.execute_and_commit(query, params)

        return jsonify(msg="Task was successfully updated"), 200


    # Delete task
    @app.route("/api/task", methods=["DELETE"])
    @jwt_required()
    def delete_task():
        user_id = get_jwt_identity()
        
        task_id = request.json.get("TaskId")
        
        query = "DELETE FROM Tasks WHERE TaskId = %s and UserId = %s"
        params = (task_id, user_id)

        db.execute_and_commit(query, params)

        return jsonify(msg="Task was successfully deleted"), 200


    # Generate schedule
    @app.route("/api/task/generate", methods=["GET"])
    @jwt_required()
    def generate_schedule():
        user_id = get_jwt_identity()
        scheduler = TaskScheduler()

        query = "SELECT * FROM Tasks WHERE UserId = %s"
        tasks = db.execute_query(query, (user_id,))

        for task in tasks:
            status = task["Status"]
            if status == "completed":
                continue

            task_id = task["TaskId"]
            priority = task["Priority"]
            duration = task["Duration"]
            energy_required = TaskAPI.energy_consumption(task_id)
            scheduler.add_task(task_id, priority, duration, energy_required)
        
        query = "SELECT TotalEnergy, WorkTime  FROM UserSettings WHERE UserID = %s"
        result = db.execute_query(query, (user_id,))
        total_energy = result[0]["TotalEnergy"]
        work_intervals = json.loads(result[0]["WorkTime"])

        scheduled_tasks = scheduler.schedule_tasks(total_energy, work_intervals)

        if scheduled_tasks is not None:
            return jsonify({"scheduled_tasks": scheduled_tasks}), 200
        else:
            return jsonify(msg="Tasks are empty"), 401


    @app.route("/api/score", methods=["GET"])
    @jwt_required()
    def compute_productivity():
        user_id = get_jwt_identity()

        score = TaskAPI.__get_productivity_score(user_id)

        return jsonify(score=score), 200
        