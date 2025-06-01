import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/";

export const plannerApis = () => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    return {
        getRoutes: () => axios.get(`${BASE_URL}routes/`, { headers }),
        createRoute: (data) => axios.post(`${BASE_URL}routes/`, data, { headers }),
        deleteRoute: (id) => axios.delete(`${BASE_URL}routes/${id}/`, { headers }),
    };
}