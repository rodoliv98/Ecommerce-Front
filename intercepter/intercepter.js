import axios from "axios";
/* import 'dotenv/config';
process.env.NODE_ENV === 'production' ? process.env.PROD_URL : process.env.DEV_URL
console.log(process.env.NODE_ENV) */

const api = axios.create({
    baseURL: 'http://localhost:3000',
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