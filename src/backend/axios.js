import axios from "axios";

const baseURL = process.env.REACT_APP_BACKEND_URL;

// Axios instance
const backend = axios.create({ baseURL, withCredentials: false });

export default backend;
