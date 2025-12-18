//config file for backend communication
import axios from "axios";

//api is a variable for axios instance
const api = axios.create({
    baseURL: "http://localhost:3000",
});

export default api;