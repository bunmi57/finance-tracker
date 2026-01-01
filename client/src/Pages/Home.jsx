import {useEffect} from "react";
import React from "react";
import Header from "../components/Header";
import {Link} from "react-router-dom";
import api from "../api/axios";
import Expense from "./Expense";

function Home(){

    useEffect(() => {
        api.get("/test")
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.error(err);
            });

        },[]); //runs once when the page loads

    return (
        <div>
        <Header/>
        {/* <Link to="/login"> Log In</Link> */}
        {/* <Link to="/register"> Register </Link> */}
        <div>
            <Link to="/expense"> Expense </Link>
        </div>
        
        <div>
           <Link to="/savings"> Savings </Link>
        </div>

        <div>
           <Link to="/testgrid"> Testgrid </Link>
        </div>

        </div>
    );
}

export default Home;