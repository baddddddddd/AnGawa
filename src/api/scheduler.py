from common import *

from account import AccountManager


class Task_Scheduler:
    def __init__(self, db: DatabaseManager):
        self.heap = []  # This is your priority queue
        self.db = db

    def push(self, priority, item):
        self.heap.append((priority, item))
        self._heapify_up(len(self.heap) - 1)

    def pop(self):
        if len(self.heap) == 0:
            return None
        if len(self.heap) == 1:
            return self.heap.pop()[1]
        root = self.heap[0]
        self.heap[0] = self.heap.pop()
        self._heapify_down(0)
        return root[1]

    def peek(self):
        if len(self.heap) == 0:
            return None
        return self.heap[0][1]

    def _heapify_up(self, index):
        while index > 0:
            parent_index = (index - 1) // 2
            if self.heap[parent_index][0] > self.heap[index][0]:
                self.heap[parent_index], self.heap[index] = self.heap[index], self.heap[parent_index]
                index = parent_index
            else:
                break

    def _heapify_down(self, index):
        while (2 * index) + 1 < len(self.heap):
            left_child_index = (2 * index) + 1
            right_child_index = (2 * index) + 2 if (2 * index) + 2 < len(self.heap) else None

            min_child_index = left_child_index

            if right_child_index is not None and self.heap[right_child_index][0] < self.heap[left_child_index][0]:
                min_child_index = right_child_index

            if self.heap[index][0] > self.heap[min_child_index][0]:
                self.heap[index], self.heap[min_child_index] = self.heap[min_child_index], self.heap[index]
                index = min_child_index
            else:
                break
    
    
    def create_tasks(self, task_name, description, deadline, duration, priority):
        query = "INSERT into tasks (task_name, description, deadline, duration, priority) VALUES (%s, %s, %s, %s, %s)"
        self.db.execute_and_commit(query, (task_name, description, deadline, duration, priority))
        return True
    
    def add_task(self, priority, task):
        self.push(priority, task)

    def get_schedule(self):
        return [task for _, task in self.heap]
    
    def schedule_tasks(self):
        tasks = self.db.execute_query("SELECT * FROM tasks")
 
        for task in tasks:
            task_id = task['task_id']
            task_name = task['task_name']
            description = task['description']
            deadline = task['deadline']
            duration = task['duration']
            priority = task['priority']

            self.push(priority, (task_id, task_name, description, deadline, duration, priority))

    def get_schedule(self):
        return [task for _, task in self.heap]

class Task:
    def __init__(self, task_name, description, deadline, duration, priority):
        self.task_name = task_name
        self.description = description
        self.deadline = deadline
        self.duration = duration
        self.priority = priority


scheduler = Task_Scheduler(db)

@app.route('/api/create_task', methods=['POST'])
@jwt_required()
def create_task():
    data = request.get_json()
    task_name = data.get('task_name')
    description = data.get('description')
    deadline = data.get('deadline')
    duration = data.get('duration')
    priority = data.get('priority')

    if not all([task_name, description, deadline, duration, priority]):
        return jsonify({'error': 'All fields are required'}), 400

    created = scheduler.create_tasks(task_name, description, deadline, duration, priority)

    if created:
        return jsonify({'message': 'Task created successfully'}), 200
    else:
        return jsonify({'error': 'Task creation failed'}), 500

@app.route('/get_next_task', methods=['GET'])
def get_next_task():
    next_task = scheduler.get_task()

    if next_task:
        return jsonify({'task': next_task}), 200
    else:
        return jsonify({'message': 'No tasks available'}), 200

@app.route('/schedule_tasks', methods=['GET'])
def schedule_tasks():
    user_id = get_jwt_identity()

    scheduler.schedule_tasks(user_id)
    schedule = scheduler.get_schedule()  

    if schedule:
        return jsonify({'schedule': schedule}), 200
    else:
        return jsonify({'message': 'No tasks available'}), 200


@app.route('/api/user_settings', methods=['PUT'])
@jwt_required()
def update_energy():
    user_id = get_jwt_identity()
    data = request.get_json()

    if user_id is None:
        return jsonify({'error': 'Missing user_id parameter'}), 400

    user_info = AccountManager.__get_account_settings(user_id)

    if user_info is None:
        return jsonify({'error': 'User not found'}), 404

    updated_info = {
        'new_total_energy': data.get('new_total_energy', user_info['TotalEnergy']),
        'new_work_time': data.get('new_work_time', user_info['WorkTime']),
        'new_break_time': data.get('new_break_time', user_info['BreakTime']),
    }
    
    updated_info = {k: v for k, v in updated_info.items() if v is not None}

    success = AccountManager.__update_account_settings(
        user_id,
        updated_info['new_total_energy'],
        updated_info['new_work_time'],
        updated_info['new_break_time'],
    )
    
    if success:
        return jsonify({'message': 'User updated successfully'}), 200
    else:
        return jsonify({'error': 'User could not be updated'}), 500

