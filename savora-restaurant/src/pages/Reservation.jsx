import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createReservation } from "../api/reservationApi";

function Reservation() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    reservationDate: "",
    reservationTime: "",
    guests: 2,
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    // CHECK LOGIN
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login before making a reservation.");
      return;
    }

    // BASIC VALIDATION
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.reservationDate ||
      !form.reservationTime ||
      !form.guests
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const reservationData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        reservationDate: form.reservationDate,
        reservationTime: form.reservationTime,
        guests: Number(form.guests),
        message: form.message,
      };

      console.log("RESERVATION DATA:", reservationData);

      const response = await createReservation(reservationData);

      console.log("RESERVATION RESPONSE:", response);

      setSuccess("Your reservation has been submitted successfully!");

      // CLEAR FORM
      setForm({
        name: "",
        email: "",
        phone: "",
        reservationDate: "",
        reservationTime: "",
        guests: 2,
        message: "",
      });
    } catch (error) {
      console.error("RESERVATION ERROR:", error);

      if (error.response?.status === 401) {
        setError("Your login session has expired. Please login again.");
      } else if (error.response?.status === 403) {
        setError("You are not allowed to make a reservation.");
      } else {
        setError(
          error.response?.data?.message || "Failed to create reservation.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <Navbar />

      <main className="px-5 pb-20 pt-32">
        <div className="mx-auto max-w-4xl">
          {/* HEADER */}
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[4px] text-[#F5B942]">
              Reservations
            </p>

            <h1 className="mt-3 font-serif text-5xl font-bold">
              Book Your Table
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              Reserve your table at SAVORA and enjoy an unforgettable dining
              experience.
            </p>
          </div>

          {/* FORM */}
          <div className="rounded-3xl border border-white/10 bg-[#181818] p-6 shadow-2xl md:p-10">
            {/* SUCCESS */}
            {success && (
              <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">
                {success}
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* NAME + EMAIL */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-[#F5B942]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Email *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-[#F5B942]"
                  />
                </div>
              </div>

              {/* PHONE + GUESTS */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Phone *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-[#F5B942]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Number of Guests *
                  </label>

                  <select
                    name="guests"
                    value={form.guests}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none focus:border-[#F5B942]"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5 Guests</option>
                    <option value="6">6 Guests</option>
                    <option value="7">7 Guests</option>
                    <option value="8">8 Guests</option>
                    <option value="9">9 Guests</option>
                    <option value="10">10 Guests</option>
                  </select>
                </div>
              </div>

              {/* DATE + TIME */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Date *
                  </label>

                  <input
                    type="date"
                    name="reservationDate"
                    value={form.reservationDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none focus:border-[#F5B942]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Time *
                  </label>

                  <input
                    type="time"
                    name="reservationTime"
                    value={form.reservationTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none focus:border-[#F5B942]"
                  />
                </div>
              </div>

              {/* SPECIAL REQUEST */}
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Special Request
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Window table, birthday celebration, etc."
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-[#F5B942]"
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#F5B942] py-4 font-semibold text-black transition hover:bg-[#ffd36b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Booking..." : "Reserve My Table"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Reservation;
