import axios from "axios";

const API_URL = "http://localhost:8080/auth/user";

export const signupUser = async (userdata) => {
    const response = await axios.post(
        `${API_URL}/signup`,
        userdata
    );

    return response.data;
};

export const loginUser = async (userdata) => {
    const response = await axios.post(
        `${API_URL}/login`,
        userdata
    );

    return response.data;
};