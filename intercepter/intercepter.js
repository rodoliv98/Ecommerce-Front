import axios from "axios";

const api = axios.create({
    baseURL: 'https://advisory-sadella-rodoliv98-bfcde16c.koyeb.app/',
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