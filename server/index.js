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

/*
    Transactions table

    CREATE TABLE transactions (
	id SERIAL PRIMARY KEY,
	user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	amount NUMERIC(10,2) NOT NULL,
	type_transaction transaction_type NOT NULL, (income,expense,saving,debt)
	category TEXT,
	date_transaction DATE ,
	note TEXT
);
 */



// //Test transaction table
    // const result = await db.query(
    //     "INSERT INTO transactions (user_id,amount,type_transaction,category,date_transaction,note) VALUES ($1, $2,$3,$4,$5,$6) RETURNING *hgp. " ,[1, 400, "income","housing","2025-10-14", "cloth items"]);
    // console.log("Transaction table");
    // console.log(result.rows);




//Test route 
app.get("/test",(req,res) => {
    res.json({message:"CORS is working"});
});

//Basic route 
app.get("/", async (req,res) =>{
    res.send("Server is running!");
});






/*
 implement /register route - to save a user to DB

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

// Register route 
app.post("/register", async (req,res) => {
    //Get the user email and password from input form 
    const email = req.body.username;
    const password = req.body.password;
    console.log(email);
    console.log(password);

   
    try {
        //Check if user already exists in the database
        const findUser = await db.query("SELECT * FROM users WHERE email = $1 ", [email]);
        // console.log(findUser);

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
                    // console.log("here");
                    // console.log(result);
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
    // console.log("username:", username);
    // console.log("password:", password);
    res.send("You are logged in!");
});

/*
    Create route for new transaction for specific user (implement POST /transactions)
    - Use email logged in to get id of user 
    - create a frontend table for expenses with columns Description, category, amount and notes
    - read data from req.body 
    - get the user id to identify logged in user 
    - Insert the entered data into the DB of the specific user 
    - link create/add button in frontend to add info to transaction table 

*/
//Expense route - to handle creating a new expense
app.post("/expense", async (req,res) => {

    //Extract expense details from the request body 
    const description = req.body.description;
    const category = req.body.category;
    const amount = req.body.amount;
    const note = req.body.note;

    //Log the recived data for debugging 
    console.log(description);
    console.log(category);
    console.log(amount);
    console.log(note);

    //For testing, define the user's email maually 
    //Later, this should be obtained from the qunthenticated session
    // const email = process.env.TEST_EMAIL;
    const email = "email34@gmail.com";

    try {
        //Query the database to get the user ID associated with the email
        const result = await db.query("SELECT id FROM users WHERE email = $1 ",[email]);
        if (result.rows.length > 0) { 
            //if user exists, get the user ID 
            const user_id = result.rows[0].id;
            console.log(user_id);
            //TODO: you can now user user_id to associate the new expense with the user
        }else{ 
            //user does not exist,respond with 404
            //Frontend should handle this and redirect the user to register 
            return res.status(404).json({
                message:"User not found"
            });//Important: return to prevent further execution
        }

    }catch (err){
        //Log any database errors for debugginv
        console.log(err);
    }


});

//Start server
app.listen(port, () =>{
    console.log(`Server running on port ${port}`)
});