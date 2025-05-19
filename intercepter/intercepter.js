import axios from "axios";
/* import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.NODE_ENV)
console.log(process.env.DEV_API_URL) */

const api = axios.create({
    baseURL: 'https://e-commerce-api-ts.onrender.com',
    withCredentials: true
});

api.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error);
    }    
);

export default api