from database import DatabaseManager

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


