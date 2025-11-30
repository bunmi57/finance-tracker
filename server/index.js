import express from "express";

const app = express();
const port = 3000;

//Basic route 
app.get("/", (req,res) =>{
    res.send("Server is running!");
});


//Start server
app.listen(port, () =>{
    console.log(`Server running on port ${port}`)
});