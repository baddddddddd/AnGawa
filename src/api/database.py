import mysql.connector


class DatabaseManager:
    def __init__(self, host, port, user, password, database):
        self.connection = mysql.connector.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database
        )

        self.cursor = self.connection.cursor(dictionary=True)


    def execute_query(self, query, params=None, fetch_all=True):
        try:
            if params:
                self.cursor.execute(query, params)
            else:
                self.cursor.execute(query)
            
            return self.cursor.fetchall() if fetch_all else self.cursor.fetchone()
        
        except Exception as e:
            print(f"Caught an exception: {type(e).__name__}: {str(e)}")
            return None


    def execute_and_commit(self, query, params=None):
        try:
            if params:
                self.cursor.execute(query, params)
            else:
                self.cursor.execute(query)

            self.connection.commit()

            return True

        except Exception as e:
            print(f"Caught an exception: {type(e).__name__}: {str(e)}")
            return False
        