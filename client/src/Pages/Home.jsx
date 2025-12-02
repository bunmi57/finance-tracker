import React from "react";
import Header from "../components/Header";
import {Link} from "react-router-dom";

function Home(){

    return (
        <>
        <Header/>
        <Link to="/login"> Log In</Link>
        <Link to="/register"> Register </Link>
        </>
    );
}

export default Home;