## Rock, Paper, Scissors

#### Requirements
- node.js
- npm
- mysql

#### Running the application
##### 1) Create the database:
Create a database in MySQL for the application, you can name it `rps_db`.
##### 2) Configure the database in the server
In the `server` folder, create an `.env` file by copying the `.env.example`:
```
cd server
cp .env.example .env
```
Edit the `.env` file by specifying the database connection parameters, e.g:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=rps_db
DB_USER=[username]
DB_PASS=[password]
```
#### 3) Install and run the application
From the root folder:
```
cd client
npm install && npm run build
cd ../server
npm install && npm run start
```
The app should now be running at port `3000` by default.
