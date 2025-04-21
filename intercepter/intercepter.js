import axios from "axios";

const api = axios.create({
    baseURL: 'https://e-commerce-api-akwz.onrender.com'
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('loginToken');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    (error) => {
        return Promise.reject(error);
    }    
);

export default api