import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "production"
    ? `${import.meta.env.VITE_SERVER_URI}/api`
    : "http://localhost:5000/api",
    withCredentials:true,
})