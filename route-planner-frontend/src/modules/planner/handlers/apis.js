import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/";

export const plannerApis = () => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    return {
        calculateOptimalRoute: async (data) => {
            const response = await axios.post(`${BASE_URL}optimal-route/`, data, { headers })
            return response.data
        },
        saveCalculatedRoute: (data) => axios.post(`${BASE_URL}save-route/`, data, { headers })
    };
}