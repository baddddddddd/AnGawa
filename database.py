import mysql.connector

class Database:
    def __init__(self, host, user, password, database):
        self.connection = mysql.connector.connect(
            host = "127.0.0.1",
            user = "root",
            password = "pass",
            database = "angawa_db"
        )