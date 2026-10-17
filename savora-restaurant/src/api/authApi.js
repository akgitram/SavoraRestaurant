
import axios from "axios";
import { API_URL } from "../config";



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