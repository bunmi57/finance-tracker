import React, {useState, useEffect} from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import FormInput from "./FormInput";
import transactions from "../transactions"; //for testing 
import Test from "./Test";
/**************************************** Full-Stack Mental Cheat Sheet  ********************************************************** */
/*
    Full-Stack Mental Cheat Sheet 
    Frontend
    useState → stores data for UI
    useEffect → runs code on page load / changes
    axios → talks to backend
    navigate → changes pages (frontend only)

    Rules
    Frontend & backend do NOT share memory
    Every request MUST get a response
    Data fetching belongs in useEffect
    UI updates when state updates

    Flow
    React → Axios → Express → DB
    DB → Express → Axios → React state → UI
*/

/**************************************** Function Item (component) ********************************************************** */
function Item(){
    //React router hook used to change pages(routes)
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

    //Create state to store expenses
    const [expenses, setExpenses] = useState([]);

    //Error state, stores backend validation or server error messages
    const [error, setError] = useState("");

    /**************************************** Time line of what happens ********************************************************** */

    /*
        Timeline of what happens
        React renders Item component
        Component appears on screen
        useEffect runs
        fetchExpenses() is called
        GET request sent to backend
        Backend responds
        Data logged (or stored in state)
     */

    /**************************************** useEffect: fetch data on initial render ********************************************************** */

    //Trigger GET request when the component first loads
    useEffect(() => {

        //Async function to fetch expenses from the backend
        const fetchExpenses = async() => {
        try{
            //Send GET request to /expense endpoint 
            const response = await api.get("/expense");
            //Log the data returned from the backend
            console.log("here");
            // console.log(response.data.user_expenses);
            //Get all expenses of user including id,category, amount,date and time in json
            const userExpenses = response.data.user_expenses; 
            console.log(userExpenses);

            //Update the expense state with expense data obtained from the database
            setExpenses(userExpenses);
        }catch(err){
            //Log any network or server errors
            console.error(err);
        }
        };

        //Call the function to fetch expenses
        fetchExpenses();

        //Empty dependency array [] means this runs once 
    }, []);

    /**************************************** Handle submit for when submit is clicked ********************************************************** */

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
            console.log("res: ",res);
            console.log("res.data: ", res.data);
            console.log("res.data.expense: ", res.data.expense);

            //Immediately update table
            setExpenses(prev => [...prev, res.data.expense]);

            //Reset form fields after sucessful submission
            setItem({      
                description: "",
                category: "",
                amount: "",
                date:"",
                note: ""
            });

            //Reset Error
            setError("");

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

    /**************************************** Handle change for input entry ********************************************************** */

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

    /**************************************** TODO Reminder ********************************************************** */

    /* 
        TODO
       -  Handle no date input 
     */

    /**************************************** What to return on screen  ********************************************************** */
    /*
    Rendering rule:
    This component re-renders whenever state (expenses, item, error) changes.
    JSX below is re-evaluated on every re-render.
    */

    return (
        <>
            
        <div className="expense" >
            
            <h1>Expense</h1>


            {/* Table to show expense transaction */}
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

                        {/*  
              
                        Render existing expense entries
                        We loop over the "expenses" state array and render one table row by expenses
                        When "setExpenses" is called (e.g after submitting a new expense,
                        React re-renders this component, re-evaluates this JSX
                        and the new expense automatically appears in the table
                        
                        */}
                         
                        {expenses.map(expense =>
                            <tr key={expense.id}>
                                <td>{expense.description}</td>
                                <td>{expense.category}</td>
                                <td>{expense.amount}</td>
                                <td>{expense.note}</td>
                                <td>{expense.date_transaction}</td>
                            </tr>
                        )}


                        {/* Add forms for new expense to be entered */}
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

                        {/* error handling */}
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

    
        </div>

        </>
        
    );

}

export default Item;