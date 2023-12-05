<div align="center">
  <a href="https://raw.githubusercontent.com/baddddddddd/bourgeoisie/main/images/logo1_anim.gif">
    <img src="src/web/assets/Logo.svg" alt="Logo" width="240" height="240">
  </a>
  <br>
  <a href="https://raw.githubusercontent.com/baddddddddd/bourgeoisie/main/images/logo1_anim.gif">
    <img src="src/web/assets/Name.svg" alt="Logo" width="500">
  </a>
  <h3 align="center">
    📋 Become productive by being lazy. 🦥
  </h3>
  <p align="center">
    <b>CS-2102</b> <br>
    <a href="https://github.com/baddddddddd">Jocson, Vladimir</a> <br>
    <a href="https://github.com/jomaaanguit">Manguit, Iemerie Jom</a> <br>
    <a href="https://github.com/DeogenesMaranan">Maranan, Deogenes Gregorio</a> <br>
    <a href="https://github.com/controlplusn">Medina, Carle Francis</a> <br>
    <a href="https://github.com/Exuille">Penuliar, Alexander Guile</a>
  </p>
  <br>
</div>

<hr class="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700">

# Running AnGawa locally on your machine
* Running the web app requires running the API server and the web server

  
## Running the API Server
**Important!**

* Before proceeding, make sure you have the .env file that contains the credentials for connecting to AnGawa database hosted online. If you do not have it, contact the developers for the file.
* Alternatively, you can create your own MySQL database, and create the database using the [database schema](https://raw.githubusercontent.com/baddddddddd/AnGawa/main/src/api/db_schema.sql) that we provided and save the database user credentials in a .env file in [src\api](https://github.com/baddddddddd/AnGawa/blob/main/src/api) folder

### Windows

1. Clone the repository in your machine
```sh
git clone https://github.com/baddddddddd/AnGawa.git
cd AnGawa
```
2. Navigate to the API folder
```sh
cd .\src\api
```
3. Download all the dependencies (we recommend using a virtual environment before proceeding to this step)
```sh
pip install -r requirements.txt
```
4. Run the server (make sure nothing is using port 5000 before proceeding)
```sh
flask run --host=0.0.0.0 --port=5000
```

## Running the Web Server
* You can run the web server using VS Code extensions such as Live Server
* Alternatively, you can simply open the HTML files to open the web app
