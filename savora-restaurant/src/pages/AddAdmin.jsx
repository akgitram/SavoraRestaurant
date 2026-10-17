
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const API_URLS = `${API_URL}/api/admin`;

export default function AddAdmin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setSuccess(false);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Session expired. Please log in again.");
        return;
      }

      const response = await axios.post(
        `${API_URLS}/create`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
      setMessage(
        response.data?.message ||
          "New admin created successfully!"
      );

      setForm({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error(
        "CREATE ADMIN ERROR:",
        error.response?.status,
        error.response?.data || error.message
      );

      if (!error.response) {
        setMessage(
          "Cannot connect to the backend. Check whether Spring Boot is running."
        );
      } else if (error.response.status === 401) {
        setMessage(
          "Unauthorized. Please log in again."
        );
      } else if (error.response.status === 403) {
        setMessage(
          "Access denied. Only an existing admin can create another admin."
        );
      } else if (error.response.status === 409) {
        setMessage(
          "This email is already registered."
        );
      } else {
        setMessage(
          error.response.data?.message ||
            error.response.data?.error ||
            "Failed to create admin."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-lg">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Add New Admin
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Create an administrator account.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="shrink-0 rounded-lg border border-gray-700 px-4 py-2 text-sm transition hover:bg-gray-800"
          >
            ← Dashboard
          </button>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-800 bg-[#1b1b1b] p-6 shadow-xl sm:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Admin Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter admin name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-700 bg-[#111111] p-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter admin email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-700 bg-[#111111] p-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password (minimum 8 characters)"
                value={form.password}
                onChange={handleChange}
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-700 bg-[#111111] p-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            {/* Status Message */}
            {message && (
              <div
                role="status"
                className={`rounded-lg border p-3 text-sm ${
                  success
                    ? "border-green-800 bg-green-950 text-green-300"
                    : "border-red-800 bg-red-950 text-red-300"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Admin..." : "Create Admin"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-500">
            Only authorized administrators can create admin accounts.
          </p>
        </div>
      </div>
    </div>
  );
}