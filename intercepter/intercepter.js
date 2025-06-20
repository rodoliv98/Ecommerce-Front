import axios from "axios";

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