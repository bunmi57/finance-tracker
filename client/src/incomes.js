// For testing only

import React from "react";

//For testing 
/*
Category: salary, freelance, bonus,investment, dividend, gift, refund,other
 */
const incomes = [
        {
            id: 1, 
            user_id: 1, 
            description:"Jan Paycheck",
            amount:4000, 
            type_transaction:"Income", 
            category:"salary",
            date_transaction:"2026-01-01", 
            note:"paycheck1 2026"
        },

        {
            id: 2, 
            user_id: 1, 
            description:"Dividend payout",
            amount:1000, 
            type_transaction:"Income", 
            category:"Dividend",
            date_transaction:"2026-01-11", 
            note:"Amazon dividend"
        }

    ];

export default incomes;
