import React from "react";

//For testing 
const transactions = [
        {
            id: 1, 
            user_id: 1, 
            description:"Uber",
            amount:400, 
            type_transaction:"expense", 
            category:"transportation",
            date_transaction:"2025-03-11", 
            note:"makeup items"
        },

        {
            id: 2, 
            user_id: 2, 
            description:"First paycheque",
            amount:300, 
            type_transaction:"income", 
            category:"income",
            date_transaction:"2025-10-15", 
            note:"Salary"
        },

        {
            id: 3, 
            user_id: 1, 
            amount:200, 
            description:"Electricity bill",
            type_transaction:"expense", 
            category:"housing",
            date_transaction:"2025-05-31", 
            note:"Electricity"
        },

        {
            id:4,
            user_id:1,
            amount:4000,
            description:"Student loan",
            type_transaction:"debt",
            category:"personal",
            date_transaction:"2024-04-09",
            note:"final installment"
        }
    ];

export default transactions;
