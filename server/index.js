import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended:true }));

//Basic route 
app.get("/", (req,res) =>{
    res.send("Server is running!");
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