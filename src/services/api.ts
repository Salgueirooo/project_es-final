import axios from "axios";
import { useNavigate } from "react-router-dom";

let isAlertShown = false;

// Criar instância do Axios com a baseURL da API
const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
    (response) => response, // Retorna a resposta normalmente
    (error) => {
        if (error.response?.status === 401 && !isAlertShown) { 
            isAlertShown = true;
            alert("A sua sessão expirou. Você será redirecionado para a página de login.");
            localStorage.removeItem("token");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default api;