import React, {useState} from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";



function Item(){
    //React route to navigate between pages
    const navigate = useNavigate();

    //Get today's date 
    const currentDate = new Date();

    //Convert today's date to (YYY-MM-DD) format 
    const todayDate = currentDate.toISOString().slice(0, 10);


    //State to store form input values for a single expense
    const [item, setItem] = useState({
        description: "",
        category: "",
        amount: "",
        date:"",
        note: ""
    });

    //Error state, stores backend validation or server error messages
    const [error, setError] = useState("");


    //Handles form submission and sends expense data to the backend
    async function handleSubmit(event){
        //prevents the default browser form submission(page reload)
        event.preventDefault();

        //Send expense data to the backend API
        try{
            const res = await api.post("/expense", {
                description: item.description,
                category: item.category,
                amount: item.amount,
                date:item.date,
                note: item.note
            });

            //Log successful response
            // console.log(res.data);

            //Reset form fields after sucessful submission
            setItem({      
                description: "",
                category: "",
                amount: "",
                date:"",
                note: ""
            });

        }catch(err){ 
            //If backend returns 404, user does not exist, redirect to register page
            if (err.response?.status === 404){
                navigate("/register");
            }
            //Uses optional chaining(?) to prevent crashes if response or data is undefined
            else if (err.response?.data?.message){
                //Backend validation error (e.g invalid amount)
                setError(err.response.data.message)
            }else{
                //Log any unexpected or server-related errors
                console.log(err);
                setError("Something went wrong.Please try again.")
            }

        }

    }

    //updates state as the user types into the form inputs
    function handleChange(event){
        setError("");
        const {name, value} = event.target;

        //preserve existing state while updating the changed field
        setItem(prevValue => {
            return{
                ...prevValue,
                [name]:value
            };
        });
    }



    return (
        <>
            
        <div >
            
            <h1>Expense</h1>

            <form onSubmit={handleSubmit} >
                <div>
                    {/* Description  */}
                    <label>Description</label>
                    <input 
                    onChange={handleChange}
                    type="text"
                    name="description" 
                    placeholder="Enter description"
                    value={item.description}/>
                </div>

                <div>
                    {/* Category  */}
                    <label>Category</label>
                    <input 
                    onChange={handleChange}
                    type="text"
                    name="category" 
                    placeholder="Enter category"
                    value={item.category}/>
                </div>

                <div>
                    {/* Amount  */}
                    <label>Amount</label>
                    <input 
                    onChange={handleChange}
                    type="number"
                    name="amount" 
                    placeholder="Enter amount"
                    value={item.amount}/>
                </div>
      
                <div> 
                    {/* Notes  */}
                    <label>Note</label>
                    <input 
                    onChange={handleChange}
                    type="text"
                    name="note" 
                    placeholder="Enter note"
                    value={item.note}/>       
                </div>

                <div> 
                    {/* Date  */}
                    <label>Date</label>
                    <input 
                    onChange={handleChange}
                    type="date"
                    name="date"
                    value={item.date}
                    min="2018-01-01"
                    max={todayDate} />    
                </div>

                {/* Show error message  */}
                {error && (<p style={{color: "red", marginBottom: "10px"}} > {error} </p>)}
                
                <div>   
                    <button type="submit" > Submit </button>
                </div>

            </form>

        </div>

        </>
        
    );

}

export default Item;