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
        <div className="home">
        <Header/>
        {/* <Link to="/login"> Log In</Link> */}
        {/* <Link to="/register"> Register </Link> */}
        {/* <div>
            <Link to="/expense"> Expense </Link>
        </div> */}
        
        {/* <div>
           <Link to="/savings"> Savings </Link>
        </div> */}

        {/* <div>
           <Link to="/testgrid"> Testgrid </Link>
        </div> */}

        {/* Bootstrap Hero */}
            <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 hero text-center">
                <h1 className="display-4 fw-bold ">
                         Finance Tracker
                </h1>

                <div className="col-lg-6 mx-auto">
                    <p className="lead mb-4">
                        Welcome to your finance tracker, where you can keep track of your expenses,savings and debt.
                        A tool to help you budget your money better, made for customers in Canada.
                    </p>

                    <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
                        <button className="btn btn-outline-secondary  btn-lg px-4 me-sm-3">
                                <Link to="/expense"> Expenses </Link>
                        </button>
                        <button className="btn btn-outline-secondary btn-lg px-4">            
                                <Link to="/savings"> Savings </Link>
                        </button>
                    </div>
                </div>
            </div>

            {/* <div className="overflow-hidden" style={{ maxHeight: "30vh" }}>
                <div className="container px-5">
                    <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSo9HJ7t1DMJRhxyAN4dXl3-NvKaaMgwGGRBnOxF9lna1ELBlZ_qu3ogM&s"
                    className="img-fluid border rounded-3 shadow-lg mb-4"
                    alt="Moving van"
                    width="700"
                    height="500"
                    loading="lazy"
                    />
                </div>
            </div> */}

        </div>
    );
}

export default Home;