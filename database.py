import mysql.connector

class Database:
    def __init__(self, host,port, user, password, database):
        self.connection = mysql.connector.connect(
            host = "oop-finalproj-oop-finalproj.a.aivencloud.com",
            port = 21710,
            user = "avnadmin",
            password = "AVNS_RW4kKiKDcQaagrUQoHc",
            database = "angawa_db"
        )
        self.cursor = self.connection.cursor(dictionary=True)

    def execute_query(self, query, params=None):
        if params:
            self.cursor.execute(query, params)
        else:
            self.cursor.execute(query)
        return self.cursor.fetchall()

    def execute_and_commit(self, query, params=None):
        if params:
            self.cursor.execute(query, params)
        else:
            self.cursor.execute(query)
        self.connection.commit()