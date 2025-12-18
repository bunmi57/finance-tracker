import {useEffect} from "react";
import React from "react";
import Header from "../components/Header";
import {Link} from "react-router-dom";
import api from "../api/axios";

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

        </div>
    );
}

export default Home;