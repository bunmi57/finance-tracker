import React, {useState} from "react";
import incomes from "../incomes"; //for testing 
import FormInput from "../components/FormInput";
/* functions */
import { formatDateForInput } from "../utils/formatDateForInput"; 
import { getTodayDate } from "../utils/getTodayDate";
/* React Material UI */
import SendIcon from '@mui/icons-material/Send';

/*
To do List
1. create a form for a new entry 
2. Create a table 
3. Add Create functionality 
4. Add Read functionality 
5. Add Update functionality 
5. Add Delete functionality 


*/

function Income(){
//Create state to store income
const [income, setIncome] = useState([]);

//Error state, stores backend validation or server error messages
const [error, setError] = useState("");

//State to store form input values for a single income
const [item, setItem] = useState({
    description: "",
    category: "",
    amount: "",
    date:"",
    note: ""
});
   

/**************************************** Handle new income item ********************************************************** */

function handleNewItemChange(event){
    setError("");
    const {name, value} = event.target;

    setItem(prevItem => ({
        ...prevItem,
        [name]:value
    }));
}

/**************************************** Handle change ********************************************************** */


//updates state as the user types into the form inputs
function handleChange(event){
    setError("");
    const {name, value} = event.target;

    // Update the specific expense in the array
    setIncome(prevIncome =>({
            ...prevIncome,
            [name]: value 
         }));
}
return(
    <>
        <div className="income" >

            {/* Table to show Income transaction */}
            <form>
                <table className="table">
                    {/* Table heading */}
                    <thead className = "thead-light">
                        <tr>
                            <th>For testing only</th> 
                            <th>Income Sources</th>
                            <th>Amount</th>
                            <th>Note</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                         
                        {incomes.map(inc =>
                            <tr key={inc.id}>
                                {/* for test only */}
                                <td>{inc.id}</td> 

                                <td>
                                   <FormInput
                                            title="Description"              // Label shown above the input
                                            handleChange={handleChange()}  // pass the id       // Updates state when user types
                                            type="text"                      // Text input
                                            name="description"               // Matches item.description in state
                                            placeholder="Enter description"  // Hint text inside input
                                            value={inc.description}         // Controlled input value        
                                    />
                               
                                </td>
                                
                                <td>
                                    <FormInput
                                            title="Category"
                                            handleChange={handleChange()}  // pass the id       // Updates state when user types
                                            type="text"
                                            name="category"
                                            placeholder="Enter category"
                                            value={inc.category}         
                                    />
                                </td>

                                <td>    
                                    <FormInput
                                            title="Amount"
                                            handleChange={handleChange()}  // pass the id       // Updates state when user types
                                            type="number"
                                            name="amount"
                                            placeholder="Enter number"
                                            value={inc.amount}         
                                    />
                                </td>
                                
                                <td>
                                    <FormInput
                                            title="Note"
                                            handleChange={handleChange()}  // pass the id       // Updates state when user types
                                            type="text"
                                            name="note"
                                            placeholder="Enter note"
                                            value={inc.note}         
                                    />
                                </td>
                                <td>
                                    <input 
                                        onChange={handleChange()}                                      
                                        type="date"
                                        name="date_transaction"
                                        value={formatDateForInput(inc.date_transaction)} //formatDateForInput is a function
                                        min="2018-01-01"    //Earliest selectable date
                                        max={getTodayDate()} //Prevents selecting future dates
                                    />  
                                </td>
                            </tr>
                        )}


                        {/* Add input forms to enter a new income */}
                        
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
                                    max={getTodayDate} //Prevents selecting future dates
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
export default Income;