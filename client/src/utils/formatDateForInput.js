  
//function formats date for input 
export function formatDateForInput(date) {
        if (!date) return "";

        const d = new Date(date);
        if (isNaN(d)) return "";

        return d.toISOString().split("T")[0];

    }