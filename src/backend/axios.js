import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;

// Axios instance. The timeout turns a backend that never answers into an
// error the page can show, where it would otherwise load forever.
const backend = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 30000,
});

export default backend;
