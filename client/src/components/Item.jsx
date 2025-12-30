import React, {useState} from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import FormInput from "./FormInput";



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
            
        <div className="expense" >
            
            <h1>Expense</h1>

            {/* 
            Enter data to table 
            Display data in database
            Add new entries to table when user clicks + */}
        
            <form onSubmit={handleSubmit}>
                <table>
                    {/* Table heading */}
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Note</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* rows will go here */}
                        <tr>
                            <td>Rent</td>
                            <td>Housing</td>
                            <td>1000</td>
                            <td> January rent</td>
                            <td>2025-01-01</td>
                        </tr>
                        <tr>
                            <td>Uber</td>
                            <td>Transportation</td>
                            <td>50</td>
                            <td> Uber fee</td>
                            <td>2025-02-15</td>
                        </tr>

                        <tr>
                            <td>               
                                <FormInput
                                    title="Description"              // Label shown above the input
                                    handleChange={handleChange}       // Updates state when user types
                                    type="text"                      // Text input
                                    name="description"               // Matches item.description in state
                                    placeholder="Enter description"  // Hint text inside input
                                    value={item.description}         // Controlled input value        
                                />
                            </td>

                            <td>                
                                <FormInput
                                    title="Category"
                                    handleChange={handleChange}
                                    type="text"
                                    name="category"
                                    placeholder="Enter category"
                                    value={item.category}         
                                />
                            </td>

                            <td>               
                                <FormInput
                                    title="Amount"
                                    handleChange={handleChange}
                                    type="number"
                                    name="amount"
                                    placeholder="Enter number"
                                    value={item.amount}         
                                />
                            </td>

                            <td>               
                                <FormInput
                                    title="Note"
                                    handleChange={handleChange}
                                    type="text"
                                    name="note"
                                    placeholder="Enter note"
                                    value={item.note}         
                                />
                            </td>


                            <td>               
                                <input 
                                    onChange={handleChange}
                                    type="date"
                                    name="date"
                                    value={item.date}
                                    min="2018-01-01"    //Earliest selectable date
                                    max={todayDate} //Prevents selecting future dates
                                />  
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {/* Show error message  */}
                                {error && (<p style={{color: "red", marginBottom: "10px"}} > {error} </p>)}
                                
                                <button type="submit" > Submit </button>
                            </td>
                        </tr>

                    </tbody>

                </table>
            </form>

            {/* //To visualise list 
            let users = [
                {id: 1, user_id: 1, amount:400, type_transaction:"expense", category:"transportation",date_transaction:"2025-10-11", note:"makeup items"},
                {id: 2, user_id: 2, amount:300, type_transaction:"income", category:"income",date_transaction:"2025-10-15", note:"Salary"},

            ]; 
            users.map((user)=>{
                user.amount
                })

                key={contact.id}
            
            */}

            



    
        </div>

        </>
        
    );

}

export default Item;