import axios from "axios";

const API_URL = "http://localhost:8080/api/user";

export const createReservation = async (reservationData) => {
  const token = localStorage.getItem("token");
  console.log("Token is",token);
  console.log("token",!token);

  const response = await axios.post(
    API_URL,
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