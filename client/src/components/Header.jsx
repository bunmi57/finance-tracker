import React from "react";
import Navbar from "./Navbar";
import Navbarupdate from "./Navbarupdate";



function Header(){
    return (
        //Header can store logos, Navbar, Searchbar
        // <header>Finace Tracker</header>
        <>
        <header>
            {/* <Navbar /> */}
            <Navbarupdate/>
        </header> 
        </>
    );
}

export default Header;