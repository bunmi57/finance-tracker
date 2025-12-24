import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import env from "dotenv";
import cors from "cors";

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(cors()); // allow all origins

//Parse JSON body
app.use(express.json());

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

//Test route 
app.get("/test",(req,res) => {
    res.json({message:"CORS is working"});
});

//Basic route 
app.get("/", async (req,res) =>{
    res.send("Server is running!");
});




//implement /register route - to save a user to DB
/*
 Get the user email and password from request - done 
 Check if user already exists in the database - done
    If yes, send message: "User already exists, log in" - done
        Check password matches database
            yes: show account (for test a console log message)
            no:send error message (ask user to try again)
    If No, ask user to register - done 
        Add username and password to database - done 
        send user to login page to log in
        check any error in adding data to database
            if database error, send error message
            if success, send success message 
*/
// Simple POST route for testing
app.post("/register", async (req,res) => {
    //Get the user email and password from input form 
    const email = req.body.username;
    const password = req.body.password;
    console.log(email);
    console.log(password);

   
    try {
        //Check if user already exists in the database
        const findUser = await db.query("SELECT * FROM users WHERE email = $1 ", [email]);
        console.log(findUser);

        if (findUser.rows.length > 0){ //user exists, send user to login page 
            console.log("User exists, log in");
            res.send("You are logged in ");
        }else { // If No(user does not exist), ask user to register
            bcrypt.hash(password,saltRounds, async(err,hash) => {
                if (err) {
                    console.error("Error hashing password:", err);
                }else{ //Add email and password to database
                    const result = await db.query("INSERT INTO users (name, email,password_hash) VALUES ($1, $2, $3) RETURNING *",
                        [email,email,hash]
                    );
                    console.log("here");
                    console.log(result);
                }
            });
        }
    }catch (err){
        console.log(err);
    }
});



//login route
app.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log("username:", username);
    console.log("password:", password);
    res.send("You are logged in!");
});

//Expense route
app.post("/expense", (req,res) => {
    const description = req.body.description;
    const category = req.body.category;
    const amount = req.body.amount;
    const note = req.body.note;
    console.log(description);
    console.log(category);
    console.log(amount);
    console.log(note);
});

//Start server
app.listen(port, () =>{
    console.log(`Server running on port ${port}`)
});