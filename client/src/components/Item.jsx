import React, {useState, useEffect} from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import FormInput from "./FormInput";
import transactions from "../transactions"; //for testing 
import Test from "./Test";
/* React Material UI */
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import SendIcon from '@mui/icons-material/Send';

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

    //state to track whether the expense item is currently in edit mode 
    //false -> show Edit button 
    //true  ->  hide Edit button and allow editing 
    const [editingId, setEditingId] = useState(null);

    //Create state to store expenses
    const [expenses, setExpenses] = useState([]);

    //Error state, stores backend validation or server error messages
    const [error, setError] = useState("");

    /**************************************** Format Date for input function ********************************************************** */


    function formatDateForInput(date) {
        if (!date) return "";

        const d = new Date(date);
        if (isNaN(d)) return "";

        return d.toISOString().split("T")[0];

    }


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
                        
            //Update the expense state with expense data inserted into the database, as "expenses" state changes the JSX is rerendered
            setExpenses(prev => [
                ...prev, 
                res.data.expense
            ]);

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
    function handleChange(event, id){
        setError("");
        const {name, value} = event.target;

        // Update the specific expense in the array
        setExpenses(prevExpenses =>
            prevExpenses.map(exp =>
                exp.id === id
                    ? { ...exp, [name]: value } // update only the changed field
                    : exp
            )
        );
    }
    /**************************************** TODO Reminder ********************************************************** */

    /* 
        TODO
       -  Handle no date input
       - Add undo delete 
     */


    /**************************************** Handle edit ********************************************************** */

    function handleEdit(id){
        //when the edit button is clicked, set isEditing to true to hide the Edit button
        setEditingId(id);
        console.log("Edit button clicked")
    }

    /**************************************** Handle done: when edit is done ********************************************************** */

    //Handles Done submission for Update and sends expense data to the backend
    async function handleDone(id){
        //exit edit mode
        setEditingId(null); 

        //Log for testing
        console.log("Id clicked: ", id);

        //Get the updated expense
        /*in the expenses array, find exp where exp is an element 
        so find the exp.id which is equal to the passed in id
            exp =   id:4,
                    user_id:1,
                    amount:4000,
                    description:"Student loan",
                    type_transaction:"debt",
                    category:"personal",
                    date_transaction:"2024-04-09",
                    note:"final installment"
         */
        
        const updatedExpense = expenses.find(exp => exp.id === id)
        if (!updatedExpense) return;
        console.log("Updated Expense: ", updatedExpense);

        // Send updated data to the backend API
        try{
            const res = await api.put(`/expense/${id}`, {
                description: updatedExpense.description,
                category: updatedExpense.category,
                amount: updatedExpense.amount,
                note: updatedExpense.note,
                date: updatedExpense.date_transaction
            });
            console.log("Update success:", res);
        
        }catch(err){ 
            //If backend returns 404
            if (err.response?.status === 404){
                console.log("Error 404")
            }else{
                //Log any unexpected or server-related errors
                console.log(err);
                setError("Something went wrong.Please try again.")
            }

        }

    }

    /**************************************** Handle delete ********************************************************** */

    async function handleDelete(id){
        //Log for testing 
        console.log("Delete id: ", id)

        // Send id to be deleted to the backend API
        try{
            const res = await api.delete(`/expense/${id}`);

            //Log result received from backed
            console.log("Delete res:", res);
            console.log("Delete res.data:", res.data);
            
            //update state to remove the deleted expense from "expenses" state
            setExpenses(prevExpenses =>
                prevExpenses.filter(exp => exp.id !== id)
            );

        }catch(err){ 
            //Log error
            console.log(err);
        }
    }

    /**************************************** Handle new item ********************************************************** */

    function handleNewItemChange(event){
        setError("");
        const {name, value} = event.target;

        setItem(prevItem => ({
            ...prevItem,
            [name]:value
        }));
    }
    /**************************************** What to return on screen  ********************************************************** */
    /*
    Rendering rule:
    This component re-renders whenever state (expenses, item, error) changes.
    JSX below is re-evaluated on every re-render.
    */
    return (
        <>
            
        <div className="expense" >
            
            {/* <h1>Expense</h1> */}


            {/* Table to show expense transaction */}
            <form onSubmit={handleSubmit}>
                <table className="table">
                    {/* Table heading */}
                    <thead className = "thead-light">
                        <tr>
                            {/* <th>For testing only</th> */}
                            <th>Description</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Note</th>
                            <th>Date</th>
                            <th>Actions</th>
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
                                {/* for test only */}
                                {/* <td>{expense.id}</td>  */}


                                {/* 
                                editingId - the id of the line being edit (when edit button has been clicked)
                                expense.id - current Id
                                When the editingId is not equal to the current id show the expense.descriptiom
                                When the editingId is equal to the current id show the input form 
                                if Edit button is clicked, change this to an input form but retain the current value  */}

                                <td>
                                    {editingId !== expense.id 
                                        ? expense.description  //normal text when not editing 
                                        : <FormInput
                                            title="Description"              // Label shown above the input
                                            handleChange={(e) => handleChange(e, expense.id)}  // pass the id       // Updates state when user types
                                            type="text"                      // Text input
                                            name="description"               // Matches item.description in state
                                            placeholder="Enter description"  // Hint text inside input
                                            value={expense.description}         // Controlled input value        
                                       />
                                   } 
                                </td>
                                
                                <td>
                                    {editingId !== expense.id 
                                        ? expense.category  //normal text when not editing 
                                        : <FormInput
                                            title="Category"
                                            handleChange={(e) => handleChange(e, expense.id, expense.description)}  // pass the id  
                                            type="text"
                                            name="category"
                                            placeholder="Enter category"
                                            value={expense.category}         
                                        />
                                   } 
                                </td>

                                <td>    
                                    {editingId !== expense.id 
                                        ? expense.amount  //normal text when not editing 
                                        : <FormInput
                                            title="Amount"
                                            handleChange={(e) => handleChange(e, expense.id)}  // pass the id  
                                            type="number"
                                            name="amount"
                                            placeholder="Enter number"
                                            value={expense.amount}         
                                        />
                                   } 
                                </td>
                                
                                <td>
                                    {editingId !== expense.id 
                                        ? expense.note  //normal text when not editing 
                                        : <FormInput
                                            title="Note"
                                            handleChange={(e) => handleChange(e, expense.id)}  // pass the id  
                                            type="text"
                                            name="note"
                                            placeholder="Enter note"
                                            value={expense.note}         
                                        />
                                   } 

                                </td>
                                <td>
                                    {editingId !== expense.id 
                                        ? expense.date_transaction //normal text when not editing 
                                        :  <input 
                                                onChange={(e) => handleChange(e, expense.id)}                                      
                                                type="date"
                                                name="date_transaction"
                                                value={formatDateForInput(expense.date_transaction)} //formatDateForInput is a function
                                                min="2018-01-01"    //Earliest selectable date
                                                max={todayDate} //Prevents selecting future dates
                                            />  
                                    } 
                                </td>
                                <td>
                                    <div>
                                        {/* Show Edit button only if this row is NOT being edited
                                         render the editing button only if editingID is not equal to current id */}
                                      
                                        {(editingId !== expense.id) && ( 
                                                <button 
                                                    type="button" 
                                                    name="edit" 
                                                    onClick={() => handleEdit(expense.id)} 
                                                    > 
                                                    
                                                    <EditIcon/> 
                                                </button>
                                        )}
                                        {/* Show Done button only if this row IS being edited
                                          show the Done button only when editing button is clicked */}
                                        {(editingId === expense.id) &&(
                                                <button 
                                                    type="button" 
                                                    name="done" 
                                                    onClick={(e)=> handleDone(expense.id)} //exit edit mode
                                                    > 
                                                    <DoneIcon/>
                                                </button>
                                        )}
                                      <button 
                                             type="button" 
                                             name="delete"
                                             onClick={() => handleDelete(expense.id)} 
                                             > 
                                             
                                             <DeleteIcon/> 
                                     </button>
                                    </div>                             
                                </td>
                            </tr>
                        )}


                        {/* Add input forms to enter a new expense */}
                        <tr>
                            <td>               
                                <FormInput
                                    title="Description"              // Label shown above the input
                                    handleChange={handleNewItemChange}       // Updates state when user types
                                    type="text"                      // Text input
                                    name="description"               // Matches item.description in state
                                    placeholder="Enter description"  // Hint text inside input
                                    value={item.description}         // Controlled input value        
                                />
                            </td>

                            <td>                
                                <FormInput
                                    title="Category"
                                    handleChange={handleNewItemChange}
                                    type="text"
                                    name="category"
                                    placeholder="Enter category"
                                    value={item.category}         
                                />
                            </td>

                            <td>               
                                <FormInput
                                    title="Amount"
                                    handleChange={handleNewItemChange}
                                    type="number"
                                    name="amount"
                                    placeholder="Enter number"
                                    value={item.amount}         
                                />
                            </td>

                            <td>               
                                <FormInput
                                    title="Note"
                                    handleChange={handleNewItemChange}
                                    type="text"
                                    name="note"
                                    placeholder="Enter note"
                                    value={item.note}         
                                />
                            </td>


                            <td>               
                                <input 
                                    onChange={handleNewItemChange}
                                    type="date"
                                    name="date"
                                    value={item.date}
                                    min="2018-01-01"    //Earliest selectable date
                                    max={todayDate} //Prevents selecting future dates
                                />  
                            </td>

                            {/* error handling */}
                        
                            <td>
                                {/* Show error message  */}
                                {error && (<p style={{color: "red", marginBottom: "10px"}} > {error} </p>)}
                                
                                <button type="submit" > <SendIcon /> </button>
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