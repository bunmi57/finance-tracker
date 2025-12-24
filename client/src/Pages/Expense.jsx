import React from "react";
import Item from "../components/Item";

function Expense(){
//CRUD
/*
 Create new expense 
 Read expenses 
 Update expenses 
 Delete expenses 


 Features
 - drop down of categories (Housing, transportation, personal &family care, entertainmengt & leisure, healthcare,insurance, sebt , savings,investment,gifts & donation, miscellaneous )
 - form to enter description 
 - Enter amount (only accept text)

 frontend 
 - user adds expense
 - user selects category 
 - user can add (+)
 - after adding user can update ()
 - user can delete 

 Backend 
 - add to database 

 let expenseItems = [
    {id: 1, description:Makeup, category:personal care, amount: 20, notes: Bought lipstick},
    {id: 2, description:Rent, category: Housing, amount: 500, notes:    paid rent,

 
 ]
 */
    return (
        <>    
           <div>
            <Item />
           </div>      
        
        </>

    );

}


export default Expense;