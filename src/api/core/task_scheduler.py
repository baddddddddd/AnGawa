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

            scheduled_end_time = start_time 

            for task in self.tasks:
                if task.get("scheduled_duration", 0) < task.get("duration", 0):
                    task_start_time = max(scheduled_end_time, task.get("start_time", scheduled_end_time))
                    task_end_time = min(end_time, task_start_time + timedelta(minutes=task["duration"]))

                    if task_start_time < task_end_time and task["energy_required"] <= current_energy:
                  
                        remaining_duration = max(0, task["duration"] - task.get("scheduled_duration", 0))
                        used_duration = min(remaining_duration, (task_end_time - task_start_time).seconds / 60)

                        intervals.append({
                            "task_id": task["task_id"],
                            "start_time": task_start_time,
                            "end_time": task_start_time + timedelta(minutes=used_duration)
                        })

                        current_energy -= task["energy_required"]
                        task["scheduled_duration"] = task.get("scheduled_duration", 0) + used_duration


                        scheduled_end_time = task_start_time + timedelta(minutes=used_duration)

            intervals.sort(key=lambda x: x["start_time"])

        return intervals
