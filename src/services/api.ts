import axios from "axios";

let isAlertShown = false;

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !isAlertShown) { 
            isAlertShown = true;
            alert("A sua sessão expirou. Irá ser redirecionado para a página de login.");
            localStorage.removeItem("token");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default api;