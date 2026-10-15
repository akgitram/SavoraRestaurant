import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  Users,
  Phone,
  Mail,
  ArrowLeft,
  LogOut,
  Plus,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/api/user";

function MyReservations() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  console.log("user",user);
  const token = localStorage.getItem("token");
  console.log("token",token);

  // ==============================
  // FETCH USER RESERVATIONS
  // ==============================
  const fetchReservations = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("MY RESERVATIONS:", response.data);

      setReservations(response.data);

    } catch (error) {
      console.error(
        "Error fetching reservations:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
      }

      if (error.response?.status === 403) {
        console.error("User is not authorized to view reservations.");
      }

    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOAD RESERVATIONS
  // ==============================
  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
      return;
    }

    fetchReservations();
  }, []);

  // ==============================
  // CANCEL RESERVATION
  // ==============================
  const cancelReservation = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      await axios.put(
        `${API_URL}/${id}/status`,
        null,
        {
          params: {
            status: "CANCELLED",
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Reservation cancelled successfully.");

      fetchReservations();

    } catch (error) {
      console.error(
        "Cancel error:",
        error.response?.data || error
      );

      alert("Unable to cancel reservation.");
    }
  };

  // ==============================
  // LOGOUT
  // ==============================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ==============================
  // STATUS STYLE
  // ==============================
  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      case "COMPLETED":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f1e4] text-black">

      {/* ==============================
          HEADER
      ============================== */}
      <header className="bg-[#111111] px-5 py-4 text-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between">

          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer"
          >
            <h1 className="text-2xl font-bold">
              SAVORA
            </h1>

            <p className="text-xs text-[#F5B942]">
              CUSTOMER PANEL
            </p>
          </div>

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-400 transition hover:bg-white/10"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </header>

      {/* ==============================
          MAIN
      ============================== */}
      <main className="mx-auto max-w-7xl p-5 md:p-10">

        {/* ==============================
            PAGE HEADER
        ============================== */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>

            <button
              onClick={() => navigate("/dashboard")}
              className="mb-4 flex items-center gap-2 text-sm text-gray-500 transition hover:text-black"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold">
              My Reservations
            </h1>

            <p className="mt-1 text-gray-500">
              View and manage your restaurant reservations.
            </p>

          </div>

          {/* ADD RESERVATION */}
          <button
            onClick={() => navigate("/reservation")}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#F5B942] px-5 py-3 font-semibold text-black transition hover:bg-[#e4a92f]"
          >
            <Plus size={19} />
            Add Reservation
          </button>

        </div>

        {/* ==============================
            RESERVATION COUNT
        ============================== */}
        <div className="mt-8">

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8f1e4]">
                <CalendarDays
                  size={24}
                  className="text-[#b17a00]"
                />
              </div>

              <div>
                <p className="text-2xl font-bold">
                  {reservations.length}
                </p>

                <p className="text-sm text-gray-500">
                  Total Reservations
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* ==============================
            RESERVATION LIST
        ============================== */}
        <div className="mt-8">

          {loading ? (

            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

              <p className="text-gray-500">
                Loading reservations...
              </p>

            </div>

          ) : reservations.length === 0 ? (

            /* NO RESERVATION */
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

              <CalendarDays
                size={55}
                className="mx-auto text-gray-300"
              />

              <h2 className="mt-5 text-xl font-bold">
                No Reservations Yet
              </h2>

              <p className="mt-2 text-gray-500">
                You haven't made any restaurant reservations.
              </p>

              <button
                onClick={() => navigate("/reservation")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F5B942] px-5 py-3 font-semibold text-black transition hover:bg-[#e4a92f]"
              >
                <Plus size={18} />
                Add Reservation
              </button>

            </div>

          ) : (

            /* RESERVATION CARDS */
            <div className="grid gap-5">

              {reservations.map((reservation) => (

                <div
                  key={reservation.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >

                  {/* CARD HEADER */}
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                    <div>

                      <p className="text-xs text-gray-400">
                        Reservation #{reservation.id}
                      </p>

                      <h2 className="mt-1 text-xl font-bold">
                        Table Reservation
                      </h2>

                    </div>

                    <span
                      className={`w-fit rounded-full px-4 py-2 text-xs font-semibold ${getStatusStyle(
                        reservation.status
                      )}`}
                    >
                      {reservation.status}
                    </span>

                  </div>

                  {/* DETAILS */}
                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    {/* DATE */}
                    <div className="flex items-center gap-3">

                      <CalendarDays
                        size={20}
                        className="text-[#b17a00]"
                      />

                      <div>

                        <p className="text-xs text-gray-400">
                          Date
                        </p>

                        <p className="font-medium">
                          {reservation.reservationDate}
                        </p>

                      </div>

                    </div>

                    {/* TIME */}
                    <div className="flex items-center gap-3">

                      <Clock
                        size={20}
                        className="text-[#b17a00]"
                      />

                      <div>

                        <p className="text-xs text-gray-400">
                          Time
                        </p>

                        <p className="font-medium">
                          {reservation.reservationTime}
                        </p>

                      </div>

                    </div>

                    {/* GUESTS */}
                    <div className="flex items-center gap-3">

                      <Users
                        size={20}
                        className="text-[#b17a00]"
                      />

                      <div>

                        <p className="text-xs text-gray-400">
                          Guests
                        </p>

                        <p className="font-medium">
                          {reservation.guests}
                        </p>

                      </div>

                    </div>

                    {/* PHONE */}
                    <div className="flex items-center gap-3">

                      <Phone
                        size={20}
                        className="text-[#b17a00]"
                      />

                      <div>

                        <p className="text-xs text-gray-400">
                          Phone
                        </p>

                        <p className="font-medium">
                          {reservation.phone}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* EMAIL */}
                  <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">

                    <Mail size={17} />

                    {reservation.email}

                  </div>

                  {/* SPECIAL REQUEST */}
                  {reservation.specialRequest && (

                    <div className="mt-5 rounded-xl bg-[#f8f1e4] p-4">

                      <p className="text-xs font-semibold text-gray-500">
                        SPECIAL REQUEST
                      </p>

                      <p className="mt-1 text-sm">
                        {reservation.specialRequest}
                      </p>

                    </div>

                  )}

                  {/* CANCEL */}
                  {reservation.status !== "CANCELLED" &&
                    reservation.status !== "COMPLETED" && (

                      <div className="mt-5 border-t border-gray-100 pt-5">

                        <button
                          onClick={() =>
                            cancelReservation(reservation.id)
                          }
                          className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
                        >
                          <XCircle size={17} />
                          Cancel Reservation
                        </button>

                      </div>

                    )}

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default MyReservations;