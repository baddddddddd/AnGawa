from datetime import datetime, timedelta

class TaskScheduler:
    def __init__(self):
        self.tasks = []
        self.scheduled_tasks = []

    def add_task(self, task_id, priority, duration, energy_required):
        self.tasks.append({
            "task_id": task_id,
            "priority": priority,
            "duration": duration,
            "energy_required": energy_required
        })

    def schedule_tasks(self, total_energy, work_intervals):
        self.tasks.sort(key=lambda x: x["priority"])

        current_energy = total_energy
        intervals = []

        for work_interval in work_intervals:
            start_time, end_time = work_interval.split('-')
            start_time = datetime.strptime(start_time, "%H:%M:%S")
            end_time = datetime.strptime(end_time, "%H:%M:%S")

            current_scheduled_time = start_time
            unscheduled_tasks = self.tasks.copy()

            for task in unscheduled_tasks:
                task_duration = task["duration"]
                task_energy_required = task["energy_required"]

                if task_energy_required <= current_energy and current_scheduled_time <= end_time:
                    task_end_time = current_scheduled_time + timedelta(minutes=task_duration)

                    if task_end_time <= end_time:
                        intervals.append({
                            "task_id": task["task_id"],
                            "start_time": current_scheduled_time,
                            "end_time": task_end_time
                        })
                        current_energy -= task_energy_required
                        current_scheduled_time = task_end_time
                        self.tasks.remove(task)
                    else:
                        print(f"Task {task['task_id']} skipped in this interval due to insufficient time.")
                        continue
                else:
                    continue

        return intervals