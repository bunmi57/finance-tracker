import React,{useState} from "react";
import api from "../api/axios";

function Registerform(){
    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    function handleSubmit(event){
        //prevent page reload 
        event.preventDefault();

        const res = api.post("/register", {
            username: user.username,
            password: user.password
        });
        console.log(res.data);

    }

    function handleChange(event){
        // console.log(event.target.value);
        // console.log(event.target.placeholder);
        // console.log(event.target.type);
        const {name, value} = event.target;

        setUser(prevValue => {
            return {
                ...prevValue,
                [name]: value
            };
        });
       
    }

    return (
        <>
        <form onSubmit={handleSubmit} method="POST" className="form">
        <div className="mb-3">
            <label for="exampleInputEmail1" className="form-label">Email address</label>
            <input 
                onChange={handleChange}
                type="email" 
                name="username"  
                className="form-control" 
                id="exampleInputEmail1" 
                value={user.username} //comes from event.target.value which is the state of username
                placeholder="Enter your username"
                aria-describedby="emailHelp"/>
        </div>
        <div className="mb-3">
            <label for="exampleInputPassword1" className="form-label">Password</label>
            <input 
                onChange={handleChange}
                type="password" 
                name="password" 
                className="form-control" 
                id="exampleInputPassword1"
                value={user.password}/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        
        </>
  );
}

export default Registerform;