import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import env from "dotenv";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended:true }));
env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

// const name = "testUser2";
// const email = "testEmail2@gmail.com";
// const password_hash = "sghcTYSVEJ637"

// const testDb = db.query(
//     "INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3)",[name, email,password_hash]
// );
// console.log(testDb);
   

//Basic route 
app.get("/", async (req,res) =>{
    res.send("Server is running!");
});

//implement /register route
/*
 Get the user email and password from request
 Check if user already exists in the database
    If yes, send message: "User already exists, log in"
    If No, insert new user into database
        check any error in adding data to database
            if database error, send error message
            if success, send success message 
*/

app.post("/register", (req,res) => {
    const email = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    console.log("Register route working!")

});


//login route
app.get("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log("username:", username);
    console.log("password:", password);
    res.send("You are logged in!");
});

//Start server
app.listen(port, () =>{
    console.log(`Server running on port ${port}`)
});