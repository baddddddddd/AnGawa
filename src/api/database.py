import mysql.connector
from mysql.connector import errorcode
import time

class DatabaseManager:
    def __init__(self, host, port, user, password, database):
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.database = database

        self.connect()


    def execute_query(self, query, params=None, fetch_all=True):
        try:
            if params:
                self.cursor.execute(query, params)
            else:
                self.cursor.execute(query)
            
            return self.cursor.fetchall() if fetch_all else self.cursor.fetchone()
        
        except mysql.connector.Error as err:
            if err.errno == errorcode.CR_SERVER_LOST:
                self.reconnect()
                return self.execute_query(query, params, fetch_all)
            
            else:
                print(f"Error: {err}")
                raise err
            
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

        except mysql.connector.Error as err:
            if err.errno == errorcode.CR_SERVER_LOST:
                self.reconnect()
                return self.execute_and_commit(query, params)
            
            else:
                print(f"Error: {err}")
                raise err
            
        except Exception as e:
            print(f"Caught an exception: {type(e).__name__}: {str(e)}")
            return None
        

    def connect(self):
        print("Connecting...")
        self.connection = mysql.connector.connect(
            host=self.host,
            port=self.port,
            user=self.user,
            password=self.password,
            database=self.database
        )

        self.cursor = self.connection.cursor(dictionary=True)
        print("Established connection.")

        
    def reconnect(self):
        print("Lost connection. Reconnecting...")
        self.connection.reconnect(attempts=3, delay=2)
        print("Reconnected.")
