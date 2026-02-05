import React, {useState, useEffect} from "react";
import api from "../api/axios";
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
4. Add Read functionality 
5. Add Update functionality 
5. Add Delete functionality 
*/

/*
Today 
Add READ functionality - display all the income data of the user 
    when form for new entry is submitted - update state to rerender page 
    check that data in DB and new data is shown 
Add drop down list for source column 
Integrate drop down with back end
Add EDIT functionality
Add DELETE functionality
Category: salary, freelance,bonus,investment,divident,gift,refund,other
*/

function Income(){
    //Create state to store income
    const [income, setIncome] = useState([]);

    //Error state, stores backend validation or server error messages
    const [error, setError] = useState("");

    //State to store form input values for a single income
    const [item, setItem] = useState({
        description: "",
        source: "",
        amount: "",
        date_income:"",
    });
    
    //Trigger GET income request when the page first loads
    useEffect(() => {

        //Async function to fetch income from the backend
        const fetchIncome = async() => {
        try{
            //Send GET request to /income endpoint 
            const response = await api.get("/income");
            //Log the data returned from the backend
            console.log("here");
            // console.log(response.data.user_expenses);
            //Get all income dtat of user including id,category, amount,date and time in json
            const userIncome = response.data.user_income; 
            console.log(userIncome);

            //Update the income state with income data obtained from the database
            setIncome(userIncome);
        }catch(err){
            //Log any network or server errors
            console.error(err);
        }
        };

        //Call the function to fetch income data
        fetchIncome();

        //Empty dependency array [] means this runs once 
    }, []);


    /**************************************** Handle new income item ********************************************************** */

    function handleNewItemChange(event){
        setError("");
        //define name and value as entries from the input form 
        const {name, value} = event.target;//name = event.target.name
        //Now set the item  

        setItem(prevItem => ({
            ...prevItem,
            [name]:value //description: paycheck
        }));
    }

    /**************************************** Handle change ********************************************************** */


    //updates state as the user types into the form inputs
    function handleChange(event){
        // console.log("name: ", event.target.name);
        // console.log("value: ", event.target.value);
        // console.log("placeholder: ", event.target.placeholder);
        // console.log("type: ", event.target.type);

        const name = event.target.name; //e,g name = description, source
        const value = event.target.value; //e,g name = description, source

        //Update the item state as input changes
        setItem(prevItem => ({
            ...prevItem,
            [name]:value})
        );


        // console.log("new entry");
        // const {name, value} = event.target;

        // setError("");

        // // Update the specific expense in the array
        // setIncome(prevIncome =>({
        //         ...prevIncome,
        //         [name]: value 
        //     }));
    }
    /**************************************** Handle submit for when submit is clicked ********************************************************** */
    async function handleIncomeSubmit(event) {
        //prevents the default browser form submission(page reload)
        event.preventDefault();
        console.log("Form submitted")

        try{
            const res = await api.post("/income", {
                description: item.description,
                source: item.source,
                amount: item.amount,
                date:item.date_income
            });
            console.log("res: ", res.data)
        }catch(err){
            console.log(err);
        }
    }



    return(
        <>
        <div className="expense">
            <form onSubmit={handleIncomeSubmit}>
                <table className="table">
                    <thead className="thead-light">
                            <tr>
                                <th>Description</th>
                                <th>Source</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                    </thead>
                    <tbody>
                        {income.map(income =>
                            <tr>
                                <td>
                                    <FormInput
                                            title="Description"              // Label shown above the input
                                            handleChange={handleChange}  // pass the id       // Updates state when user types
                                            type="text"                      // Text input
                                            name="description"               // Matches item.description in state
                                            placeholder="Enter description"  // Hint text inside input
                                            value={income.description}         // Controlled input value        
                                       />
                                </td>
                                <td>
                                    <FormInput
                                            title="Category"
                                            handleChange={handleChange}  // pass the id  
                                            type="text"
                                            name="category"
                                            placeholder="Enter category"
                                            value={income.category}         
                                    />
                                </td>
                                <td>
                                    <FormInput
                                            title="Amount"
                                            handleChange={handleChange}  // pass the id  
                                            type="number"
                                            name="amount"
                                            placeholder="Enter number"
                                            value={income.amount}         
                                     />
                                </td>
                                <td>
                                    <input 
                                            onChange={handleChange}                                      
                                            type="date"
                                            name="date_transaction"
                                            value={formatDateForInput(income.date_transaction)} //formatDateForInput is a function
                                            min="2018-01-01"    //Earliest selectable date
                                            max={getTodayDate} //Prevents selecting future dates
                                    />  
                                </td>
                            </tr>
                        )}
                        <tr>
                            <td>First paycheck</td>
                            <td>Salary</td>
                            <td>5000</td>
                            <td>2025-01-01</td>
                            <td>Edit</td>
                        </tr>
                        <tr>
                            <td>Freelance income</td>
                            <td>Freelance</td>
                            <td>1500</td>
                            <td>2026-01-22</td>
                            <td>Delete</td>
                        </tr>

                        {/* Add new form  */}
                        <tr>
                            <td>
                                <FormInput
                                    handleChange={handleChange}
                                    type="text"
                                    name="description" 
                                    placeholder="Enter description"
                                    value = {item.description} //use value that comes from state, hence keeping a single source of truth 
                                />
                            </td>
                            <td>
                                <FormInput
                                    handleChange={handleChange}
                                    type="text"
                                    name="source"
                                    placeholder="Enter source"
                                    value={item.source}
                                />
                            </td>
                            <td>
                                <FormInput
                                    handleChange={handleChange}
                                    type="number"
                                    name="amount"
                                    placeholder="Enter amount"
                                    value={item.amount}
                                />
                            </td>
                            <td>
                                <input 
                                    onChange={handleChange}                                      
                                    type="date"
                                    name="date_income"
                                    value={formatDateForInput(item.date_income)} //formatDateForInput is a function
                                    min="2018-01-01"    //Earliest selectable date
                                    max={getTodayDate()} //Prevents selecting future dates
                                />  
                            </td>
                            <td> 
                                <button type="submit" > <SendIcon /> </button>
                            </td>
                        </tr>             
                    </tbody>

                </table>
            </form>
        </div>
        </>

    )
}
export default Income;