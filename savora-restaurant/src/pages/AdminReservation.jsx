import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/api/user";

function AdminReservation() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // GET TOKEN
  // =========================
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================
  // FETCH RESERVATIONS
  // =========================
  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("RESERVATIONS:", response.data);

      setReservations(response.data);
    } catch (error) {
      console.error("RESERVATION FETCH ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else if (error.response?.status === 403) {
        setError(
          "You are not authorized to view reservations."
        );
      } else {
        setError("Failed to load reservations.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus = async (id, status) => {
    try {
      const token = getToken();

      await axios.put(
        `${API_URL}/${id}/status`,
        null,
        {
          params: {
            status: status,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh list
      fetchReservations();

    } catch (error) {
      console.error(
        "STATUS UPDATE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to update reservation."
      );
    }
  };

  // =========================
  // DELETE RESERVATION
  // =========================
  const deleteReservation = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this reservation?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = getToken();

      await axios.delete(
        `${API_URL}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReservations((prev) =>
        prev.filter(
          (reservation) =>
            reservation.id !== id
        )
      );

    } catch (error) {
      console.error(
        "DELETE RESERVATION ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete reservation."
      );
    }
  };

  // =========================
  // LOAD
  // =========================
  useEffect(() => {
    fetchReservations();
  }, []);

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle = (status) => {

    switch (status) {

      case "CONFIRMED":
        return "bg-green-500/20 text-green-400";

      case "CANCELLED":
        return "bg-red-500/20 text-red-400";

      case "COMPLETED":
        return "bg-blue-500/20 text-blue-400";

      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  };

  // =========================
  // STATISTICS
  // =========================
  const pendingCount = reservations.filter(
    (item) => item.status === "PENDING"
  ).length;

  const confirmedCount = reservations.filter(
    (item) => item.status === "CONFIRMED"
  ).length;

  const cancelledCount = reservations.filter(
    (item) => item.status === "CANCELLED"
  ).length;

  return (
    <div className="min-h-screen bg-[#111111] text-white">

      {/* ================= HEADER ================= */}
      <header className="border-b border-white/10 bg-[#181818]">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <p className="text-xs uppercase tracking-[4px] text-[#F5B942]">
              SAVORA
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Reservations
            </h1>
          </div>

          <div className="flex gap-3">

            <Link
              to="/dashboard"
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-[#F5B942] hover:text-[#F5B942]"
            >
              ← Dashboard
            </Link>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
              }}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      {/* ================= CONTENT ================= */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* TITLE */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>

            <p className="text-sm uppercase tracking-[3px] text-[#F5B942]">
              Administration
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Table Reservations
            </h2>

            <p className="mt-2 text-gray-400">
              Manage customer reservations at SAVORA.
            </p>

          </div>

          <button
            onClick={fetchReservations}
            className="rounded-lg border border-[#F5B942] px-5 py-2.5 text-sm font-semibold text-[#F5B942] transition hover:bg-[#F5B942] hover:text-black"
          >
            ↻ Refresh
          </button>

        </div>

        {/* ================= STATS ================= */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-white/10 bg-[#181818] p-6">

            <p className="text-sm text-gray-400">
              Total Reservations
            </p>

            <p className="mt-2 text-3xl font-bold text-[#F5B942]">
              {reservations.length}
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-[#181818] p-6">

            <p className="text-sm text-gray-400">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-400">
              {pendingCount}
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-[#181818] p-6">

            <p className="text-sm text-gray-400">
              Confirmed
            </p>

            <p className="mt-2 text-3xl font-bold text-green-400">
              {confirmedCount}
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-[#181818] p-6">

            <p className="text-sm text-gray-400">
              Cancelled
            </p>

            <p className="mt-2 text-3xl font-bold text-red-400">
              {cancelledCount}
            </p>

          </div>

        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="rounded-2xl border border-white/10 bg-[#181818] py-20 text-center text-gray-400">
            Loading reservations...
          </div>
        )}

        {/* ================= TABLE ================= */}
        {!loading && !error && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#181818]">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1200px]">

                <thead className="border-b border-white/10 bg-[#202020]">

                  <tr>

                    <th className="px-5 py-4 text-left text-sm text-gray-400">
                      ID
                    </th>

                    <th className="px-5 py-4 text-left text-sm text-gray-400">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-sm text-gray-400">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-left text-sm text-gray-400">
                      Date
                    </th>

                    <th className="px-5 py-4 text-left text-sm text-gray-400">
                      Time
                    </th>

                    <th className="px-5 py-4 text-left text-sm text-gray-400">
                      Guests
                    </th>

                    <th className="px-5 py-4 text-left text-sm text-gray-400">
                      Request
                    </th>

                    <th className="px-5 py-4 text-left text-sm text-gray-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-sm text-gray-400">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {reservations.map((reservation) => (

                    <tr
                      key={reservation.id}
                      className="border-b border-white/5 transition hover:bg-white/5"
                    >

                      {/* ID */}
                      <td className="px-5 py-5 text-gray-400">
                        #{reservation.id}
                      </td>

                      {/* CUSTOMER */}
                      <td className="px-5 py-5">

                        <p className="font-semibold">
                          {reservation.name}
                        </p>

                      </td>

                      {/* CONTACT */}
                      <td className="px-5 py-5">

                        <p className="text-sm text-gray-300">
                          {reservation.email}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {reservation.phone}
                        </p>

                      </td>

                      {/* DATE */}
                      <td className="px-5 py-5 text-sm">
                        {reservation.reservationDate}
                      </td>

                      {/* TIME */}
                      <td className="px-5 py-5 text-sm">
                        {reservation.reservationTime}
                      </td>

                      {/* GUESTS */}
                      <td className="px-5 py-5 text-sm">
                        👥 {reservation.guests}
                      </td>

                      {/* SPECIAL REQUEST */}
                      <td className="max-w-[200px] px-5 py-5 text-sm text-gray-400">
                        {reservation.specialRequest || "—"}
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-5">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            reservation.status
                          )}`}
                        >
                          {reservation.status}
                        </span>

                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-5">

                        <div className="flex flex-wrap gap-2">

                          {/* CONFIRM */}
                          {reservation.status === "PENDING" && (
                            <button
                              onClick={() =>
                                updateStatus(
                                  reservation.id,
                                  "CONFIRMED"
                                )
                              }
                              className="rounded-lg bg-green-500/20 px-3 py-2 text-xs font-semibold text-green-400 transition hover:bg-green-500 hover:text-white"
                            >
                              Confirm
                            </button>
                          )}

                          {/* CANCEL */}
                          {reservation.status !== "CANCELLED" &&
                            reservation.status !== "COMPLETED" && (
                              <button
                                onClick={() =>
                                  updateStatus(
                                    reservation.id,
                                    "CANCELLED"
                                  )
                                }
                                className="rounded-lg bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                              >
                                Cancel
                              </button>
                            )}

                          {/* COMPLETE */}
                          {reservation.status === "CONFIRMED" && (
                            <button
                              onClick={() =>
                                updateStatus(
                                  reservation.id,
                                  "COMPLETED"
                                )
                              }
                              className="rounded-lg bg-blue-500/20 px-3 py-2 text-xs font-semibold text-blue-400 transition hover:bg-blue-500 hover:text-white"
                            >
                              Complete
                            </button>
                          )}

                          {/* DELETE */}
                          <button
                            onClick={() =>
                              deleteReservation(
                                reservation.id
                              )
                            }
                            className="rounded-lg bg-gray-500/20 px-3 py-2 text-xs font-semibold text-gray-400 transition hover:bg-gray-500 hover:text-white"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* EMPTY */}
            {reservations.length === 0 && (
              <div className="py-20 text-center">

                <p className="text-5xl">
                  📅
                </p>

                <h3 className="mt-4 text-xl font-semibold">
                  No reservations
                </h3>

                <p className="mt-2 text-gray-500">
                  Customer reservations will appear here.
                </p>

              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
}

export default AdminReservation;