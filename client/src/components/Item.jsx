import React, {useState} from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";


function Item(){
    //React rouet to navigate between pages
    const navigate = useNavigate();

    //State to stor form input values for a single expense
    const [item, setItem] = useState({
        description: "",
        category: "",
        amount: "",
        note: ""
    });

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
                note: item.note
            });

            //Log successful response
            console.log(res.data);

            //Reset form fields after sucessful submission
            setItem({      
                description: "",
                category: "",
                amount: "",
                note: ""
            });
        }catch(err){ 
            //If backend returns 404, user does not exist, redirect to register page
            if (err.response?.status === 404){
                navigate("/register");
            }else{
                //Log any unexpected or server-related errors
                console.error(err);
            }
        }

    }

    //updates state as the user types into the form inputs
    function handleChange(event){
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
            
        <div className="item">
                <h1>Expense</h1>
           
            {/* change to one form */}
            {/* <form onSubmit={handleSubmit}>
            <input name="description" ... />
            <input name="category" ... />
            <input name="amount" ... />
            <input name="note" ... />
            <button type="submit">+</button>
            </form> */}


            {/* Description */}
            <form onSubmit={handleSubmit} method="POST">
                <label>Description</label>
                <input 
                onChange={handleChange}
                type="text"
                name="description" 
                placeholder="Enter description"
                value={item.description}/>
                <button type="submit" > + </button>
            </form>

            {/* Category  */}
            <form onSubmit={handleSubmit} method="POST">
                <label>Category</label>
                <input 
                onChange={handleChange}
                type="text"
                name="category" 
                placeholder="Enter category"
                value={item.category}/>
                <button type="submit" > + </button>
            </form>

            {/* Amount  */}
            <form onSubmit={handleSubmit} method="POST">
                <label>Amount</label>
                <input 
                onChange={handleChange}
                type="text"
                name="amount" 
                placeholder="Enter amount"
                value={item.amount}/>
                <button type="submit" > + </button>
            </form>

            {/* Notes  */}
            <form onSubmit={handleSubmit} method="POST">
                <label>Note</label>
                <input 
                onChange={handleChange}
                type="text"
                name="note" 
                placeholder="Enter note"
                value={item.note}/>
                <button type="submit" > + </button>
            </form>

        </div>


        </>
        
    );

}


export default Item;