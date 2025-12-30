import React from "react";
import ReactDOM from "react-dom";
import Item from "./Item";

function FormInput(props){
 return(
    <>
        <div>
            {/* Description  */}
            <label>{props.title}</label>
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