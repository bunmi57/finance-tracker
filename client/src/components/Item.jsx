import React, {useState} from "react";
import api from "../api/axios";


function Item(){
    const [item, setItem] = useState({
        description: "",
        category: "",
        amount: "",
        note: ""
    });

    function handleSubmit(event){
        event.preventDefault();
        //go to post request once form is submitted 
        const res = api.post("/expense", {
            description: item.description,
            category: item.category,
            amount: item.amount,
            note: item.note
        });
        console.log(res.data);
        setItem({      
            description: "",
            category: "",
            amount: "",
            note: ""
        });
    }

    function handleChange(event){
        const {name, value} = event.target;

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