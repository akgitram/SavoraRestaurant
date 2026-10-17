import axios from "axios";
import { API_URL } from "../config";
const API_URLS = `${API_URL}/api/user`;

export const createReservation = async (reservationData) => {
  const token = localStorage.getItem("token");
  console.log("Token is",token);
  console.log("token",!token);

  const response = await axios.post(
    API_URLS,
    reservationData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};