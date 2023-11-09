from database import DatabaseManager

class UserSettings:
    def __init__(self, db: DatabaseManager):
        self.db = db

    def get_info(self, user_id):
        query = "SELECT * FROM user_settings WHERE user_id = %s"
        result = self.db.execute_query(query, (user_id,))
        
        if result:
            user_info = result[0] 
            return {
                'user_id': user_info['user_id'],
                'total_energy': user_info['total_energy'],
                'work_time': user_info['work_time'],
                'break_time': user_info['break_time']
            }
        else:
            return None

    def update_settings(self, user_id,  new_total_energy, new_work_time, new_break_time):
        query = "UPDATE users SET total_energy = %s, work_time = %s, break_time = %s WHERE user_id = %s"
        self.db.execute_and_commit(query, (user_id, new_total_energy, new_work_time, new_break_time))
        return True