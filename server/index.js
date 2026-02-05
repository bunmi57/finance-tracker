import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import env from "dotenv";
import cors from "cors";
// import transactions from "../client/src/transactions";

const app = express();
const port = 3000;
const saltRounds = 10;

/*
    Full-Stack Mental Cheat Sheet
    Backend
    Receives requests
    Validates data
    Talks to database
    MUST send a response

    Rules
    Frontend & backend do NOT share memory
    Every request MUST get a response
    Data fetching belongs in useEffect
    UI updates when state updates

    Flow
    React → Axios → Express → DB
    DB → Express → Axios → React state → UI
 */

// allow all origins
app.use(cors()); 

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
    //To visualise list 
    let users = [
        {id: 1, user_id: 1, amount:400, type_transaction:"expense", category:"transportation",date_transaction:"2025-10-11", note:"makeup items"},
        {id: 2, user_id: 2, amount:300, type_transaction:"income", category:"income",date_transaction:"2025-10-15", note:"Salary"},

    ];
 */

//Test route 
app.get("/test",(req,res) => {
    res.json({message:"CORS is working"});
});

//Basic route 
app.get("/", async (req,res) =>{
    res.send("Server is running!");
});

//test grid
app.get("/testgrid", async (req,res) =>{
    res.send("Test grid here!");
});

/*
    Dashboard route - to show transactions after user logs in

    - run function view Transaction const transaction = await viewTransaction
    - viewTransaction function (sync function viewTransction()) selects data from database "SELECT expense from transactions JOIN users ON user.id(//means users table, field id) = user_id(foreign key in the specified table in this case, transactions) WHERE user_id = $1",[currentUserId]
    - result.rows.forEach((expense)=>{ do something }) 
    - pass over data to frontend res.render("index.ejs",{ //remember, ejs is not used but the idea is to render the data extracted from the database
        countries:countries
        total: countries.length,
        color:currentUser.color. to use can call a function getCurrentUser
    }) 
    - async function getCurrentUser(){
        const result = await db.query("SELECT * FROM users");
        users = result.rows;
        return users.find((user)=> user.id == currentUserId);
    }
    - const currentUser = await getCurrentUser();
*/


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
/***************** REGISTER ******************************************************************************************** */ 

//POST Register route 
app.post("/register", async (req,res) => {
    //Get the user email and password from input form 
    const email = req.body.username;
    const password = req.body.password;
    // console.log(email);
    // console.log(password);

    try {
        //Check if user already exists in the database
        const findUser = await db.query("SELECT * FROM users WHERE email = $1 ", [email]);
        // console.log(findUser);

        if (findUser.rows.length > 0){ //user exists, send user to login page 
            // console.log("User exists, log in");
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

/***************** LOGIN ******************************************************************************************** */ 

//login route
app.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // console.log("username:", username);
    // console.log("password:", password);
    res.send("You are logged in!");
});



//Implement GET/transactions
/*
    - Get the user id
    - filter transactions by user id 
    - return only the user's transactions 
*/
/***************** READ ******************************************************************************************** */ 


// GET Expense route - to fetch expenses
app.get("/expense", async (req,res) => {
    // console.log("🔥 GET /expense HIT");
    try{

        //For testing, define the user's email manually 
        //Later, this should be obtained from the authenticated session
        const email = process.env.TEST_EMAIL;
        // console.log("email: ", email);

          //define type of transaction
          const type_transaction = "expense";

        //Query the database to get the user ID associated with the email
        const result = await db.query("SELECT id FROM users WHERE email = $1 ",[email]);
        // console.log("Expense route testing");
        // console.log(result);

        //No need to check if user exist, as expense page will only be revealed after the user logs in
        //get the user ID 
        const user_id = result.rows[0].id;
        // console.log("User id: ",user_id);

        //Filter trnsactions by user id 
        const user_transaction = await db.query("SELECT * FROM transactions WHERE user_id = $1 AND type_transaction = $2", [user_id, "expense"]);
        const expenses = user_transaction.rows; //js object with id, user_id
        // console.log(user_transaction.rows);


        const user_expenses = []

        //Send a response 
        return res.status(200).json({
            message:"GET expense route works",
            //send all the expenses of the user 
            user_expenses:expenses
        });

    }catch (err){
        console.log(err);
        return res.status(500).json({
            message:"Server error"
        });
    }

});





/*
    POST Expense route

    Create route for new transaction for specific user (implement POST /transactions)
    - Use email logged in to get id of user - done
    - create a frontend table for expenses with columns Description, category, amount and notes
    - read data from req.body  - done
    - get the user id to identify logged in user - done
    - Insert the entered data into the DB of the specific user 
    - link create/add button in frontend to add info to transaction table 

*/
/***************** CREATE ******************************************************************************************** */ 

// POST Expense route - to handle creating a new expense
app.post("/expense", async (req,res) => {

    //Extract expense details from the request body 
    const description = req.body.description;
    const category = req.body.category;
    const amount = req.body.amount;
    const date = req.body.date;
    const note = req.body.note;

    //Log the received data for debugging 
    // console.log(description);
    // console.log(category);
    // console.log(amount);
    // console.log(date);
    // console.log(note);

    //define type of transaction
    const type_transaction = "expense";

    //For testing, define the user's email maually 
    //Later, this should be obtained from the aunthenticated session
    const email = process.env.TEST_EMAIL;
    // const email = "email34@gmail.com";

    //Error handling for invalid Amount field 
    const amountNum = Number(amount);

    if ( 
         amount === undefined ||
         amount === null ||
         amount === "" ||
         isNaN(Number(amount))
        ){
        return res.status(400).json({
            message: "Amount must be a valid number"
        });
    }

    //Use parseFloat to return the first floating-point number found within a string "3.14" becomes 3.14
    const amountValue = parseFloat(amount);

    //Handle amounts less than 0 entered in input form
    if (amountValue <= 0) {
    return res.status(400).json({
        message: "Amount must be greater than zero"
    });
    }

    try {
        //Query the database to get the user ID associated with the email
        const result = await db.query("SELECT id FROM users WHERE email = $1 ",[email]);

        //If user does not exist, send status 404
        //Frontend should handle this and redirect the user to register 
        if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
        }

        //if user exists, get the user ID 
        const user_id = result.rows[0].id;
        // console.log(user_id);

        //Insert the extracted data into the transactiin table  of the specific user
        //INSERT does not return rows by default, add RETURNING * to return inseerted record
        const expense = await db.query( "INSERT INTO transactions (user_id,amount,type_transaction,category,date_transaction,note,description) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING * ",[user_id,amountValue,type_transaction,category,date,note,description]);

        return res.status(201).json({
            message: "Expense created successfully",
            expense: expense.rows[0],
        });

    }catch (err){
        //Log any database errors for debugging
        console.error(err);

        //catch specific post-gres specific error 
        if (err.code === "22P02"){
            return res.status(400).json({
                message:"Invalid numeric input"
            });
        }
        return res.status(500).json({ message: "Server error" });
    }

});
// POST Income route - to handle creating a new income
app.post("/income", async (req,res) => {

    //Extract income details from the request body 
    const description = req.body.description;
    const source = req.body.source;
    const amount = req.body.amount;
    const date = req.body.date;
   
    console.log("description: ", description);
    console.log("source: ", source);
    console.log("amount: ", amount);
    console.log("date: ", date);

    //define type of transaction
    const type_transaction = "income";

    //For testing, define the user's email maually 
    //Later, this should be obtained from the aunthenticated session
    const email = process.env.TEST_EMAIL;

    //Error handling for invalid Amount field 
    const amountNum = Number(amount);

    if ( 
         amount === undefined ||
         amount === null ||
         amount === "" ||
         isNaN(Number(amount))
        ){
        return res.status(400).json({
            message: "Amount must be a valid number"
        });
    }

    //Use parseFloat to return the first floating-point number found within a string "3.14" becomes 3.14
    const amountValue = parseFloat(amount);

    //Handle amounts less than 0 entered in input form
    if (amountValue <= 0) {
    return res.status(400).json({
        message: "Income amount must be greater than zero"
    });
    }

    try{
        //Query the database to get the user ID associated with the email
        const result = await db.query("SELECT id FROM users WHERE email = $1 ",[email]);

        //If user does not exist, send status 404
        //Frontend should handle this and redirect the user to register 
        if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
        }

        //if user exists, get the user ID 
        const user_id = result.rows[0].id;
        console.log("user id: ", user_id);

        //Insert the extracted data into the transactiin table  of the specific user
        //INSERT does not return rows by default, add RETURNING * to return inseerted record
        const income = await db.query( "INSERT INTO transactions (user_id,amount,type_transaction,category,date_transaction,description) VALUES ($1,$2,$3,$4,$5,$6) RETURNING * ",[user_id,amountValue,type_transaction,source,date,description]);

        console.log("income: ", income.rows[0]);
        return res.status(201).json({
            message: "Income added successfully",
            income: income.rows[0],
        });

    }catch(err){
        //Log any database errors for debugging
        console.error(err);

        //catch specific post-gres specific error 
        if (err.code === "22P02"){
            return res.status(400).json({
                message:"Invalid numeric input"
            });
        }
        return res.status(500).json({ message: "Server error" });
    }

});


/* UPDATE Route 
    - Ensure transaction belong to the user
    - Get the id of the item being updated
    - Get the edited value 
    - update the row in the database
    - update the expense state. (automatically renders)


    click on edit - complete
    hide edit button - complete 
    show done button - complete 
    change all cells to input form - complete 
    allow user to change data - complete 
    when user clicks done, show edit button - complete 
    send request to backend to UPDATE the database - complete
    rerender to show the new data  
    
     */

/*************** UPDATE ********************************************************************************************** */ 

//PUT route to update expense of a user
app.put('/expense/:id',async (req,res) => {
    //Get the expense id that is being updated  from the URL
    const expenseId = req.params.id; 

    //Log for testing
    // console.log("Expense id: ",expenseId );
    

    //Extract updated expense details from the request body 
    const updatedDescription = req.body.description;
    const updatedCategory = req.body.category;
    const updatedAmount = req.body.amount;
    const updatedDate = req.body.date;
    const updatedNote = req.body.note;

    //Log for testing
    // console.log("Updated Description: ", updatedDescription);
    // console.log("Updated Category: ", updatedCategory);
    // console.log("Updated Amount: ", updatedAmount);
    // console.log("Updated Date: ", updatedDate);
    // console.log("Updated Note: ", updatedNote);

    const type_transaction = "expense";
    try{
        //Update the transactions table with the updated data 
        const update = await db.query("UPDATE transactions SET type_transaction = $1, description = $2, category = $3, amount = $4, note = $5,date_transaction = $6 WHERE id =  $7 RETURNING *",
            [type_transaction,updatedDescription,updatedCategory,updatedAmount, updatedNote, updatedDate, expenseId] 
        );
        // console.log("update: ", update.rows[0])

        //send back status message 
        return res.status(201).json({
            message: "Expense updated successfully",
            updateResult: update,
        });

    }catch (err){
            //Log any database errors for debugging
            console.error(err);

            //catch  post-gres specific error 
            return res.status(500).json({ message: "Server error" });

    }

    console.log(update);

});
/* DELETE Route 
    - Ensure transaction belong to the user
    - Get the id of the item being deleted
    - delete the row in the database
    - should update the expense state. (automatically renders)


    click on delete - 
    hide delete button -  
    show undo delete button -  
    when user clicks delete, hide delete button -  
    send request to backend to DELETE the database - 
    rerender  
    
     */
/**************** DELETE ********************************************************************************************* */ 

app.delete('/expense/:id', async (req,res) => {
    //Get the expense id that is being deleted from the URL
    const deleteId = req.params.id; 

    //Log for testing
    // console.log("Delete id - backend: ",deleteId );

    try{
        const deleteExpense = await db.query("DELETE FROM transactions WHERE id = $1 RETURNING *", [deleteId]);

        if(deleteExpense.rowCount === 0){
            //No rows deleted (id not found)
            return res.status(404).json({message: "Expense not found"});
        }
        //send back status message 
        return res.status(201).json({
            message: "Deleted successfully",
            deleteExpense: deleteExpense.rows[0]
        });
    }catch(err){
        console.log("Database delete error:",err);
        return res.status(500).json({message:"Server error"});
    }
});

/***************** START SERVER ******************************************************************************************** */ 

//Start server
app.listen(port, () =>{
    console.log(`Server running on port ${port}`)
});