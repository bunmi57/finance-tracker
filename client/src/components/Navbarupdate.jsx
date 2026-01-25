import React from "react";
import {Link} from "react-router-dom";
import PaymentsIcon from '@mui/icons-material/Payments';

function Navbarupdate(){
    return (
        <div className="container">
            <div>
                <PaymentsIcon className="logo" fontSize="large"/>
            </div>
            {/* <div className="brand">
                <p>Finance Tracker</p>
            </div> */}

            {/* <div className="navitem">
                <p>Budget</p>
            </div> */}

            {/* <div className="navitem">
                <p>Pricing</p>
            </div> */}

            <div className="navitem login">
                <Link className="nav-link" to="/login">Log in</Link>
            </div>

            <div className="navitem register">
                <Link className="nav-link" to="/register">Register</Link>
            </div>
          
        </div>
    );
}


export default Navbarupdate;