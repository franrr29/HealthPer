import axios from "axios";

//creo una instancia de axios para hacer peticiones a la api
const api = axios.create({
    baseURL: "http://localhost:4000"
});


// Incluye el token en el header para autenticar la peticin
api.interceptors.request.use((config) => {

    //obtengo el token del localStorage
    const token = localStorage.getItem("token");
    
    if (token) {

        //agrego el token al header de la peticion
        config.headers.Authorization = `Bearer ${token}`;

    }
    return config;
});
export default api;