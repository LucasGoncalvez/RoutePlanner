import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/";

export const plannerApis = () => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    return {
        getRoutes: () => axios.get(`${BASE_URL}routes/`, { headers }),
        createRoute: (data) => axios.post(`${BASE_URL}routes/`, data, { headers }),
        deleteRoute: (id) => axios.delete(`${BASE_URL}routes/${id}/`, { headers }),
        
        // Nueva función para calcular ruta óptima
        calculateOptimalRoute: (data) => axios.post(`${BASE_URL}optimal-route/`, data, { headers }),
        
        // Función para guardar la ruta calculada
        saveCalculatedRoute: (data) => axios.post(`${BASE_URL}save-route/`, data, { headers })
    };
}