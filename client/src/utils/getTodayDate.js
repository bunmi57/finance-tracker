//Function gets today's date
export function getTodayDate(){
    //Get today's date 
    const currentDate = new Date();

    //Convert today's date to (YYY-MM-DD) format 
    const todayDate = currentDate.toISOString().slice(0, 10);

    return todayDate;
}