import React, {useState} from "react";
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
3. Add Create functionality 
4. Add Read functionality 
5. Add Update functionality 
5. Add Delete functionality 
*/

/*
Tuesday 
2. Add Create functionality
    when user clicks on submit, add entry to database
    Add error checking capability
3. Add new income - backend 
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