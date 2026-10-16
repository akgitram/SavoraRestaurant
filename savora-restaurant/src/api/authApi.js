
import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8080";

const AUTH_URL = `${API_URL}/auth/user`;

export const signupUser = async (userdata) => {
    const response = await axios.post(
        `${AUTH_URL}/signup`,
        userdata
    );
    return response.data;
};

export const loginUser = async (userdata) => {
    const response = await axios.post(
        `${AUTH_URL}/login`,
        userdata
    );
    return response.data;
};