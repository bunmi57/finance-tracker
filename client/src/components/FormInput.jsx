import React from "react";
import ReactDOM from "react-dom";
import Item from "./Item";

// Creates an input form to enter data
function FormInput(props){
 return(
    <>
        <div>
                <input 
                onChange={props.handleChange}
                type={props.type}
                name={props.name} 
                placeholder={props.placeholder}
                value={props.value}/>
        </div>  
    </>
 ) 
}

export default FormInput;