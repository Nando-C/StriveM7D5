import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;

// Axios instance
const backend = axios.create({ baseURL, withCredentials: false });

export default backend;
