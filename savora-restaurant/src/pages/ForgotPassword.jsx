
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/forgot-password`, {
        email: email.trim().toLowerCase(),
      });

      setMessage(
        "If an account exists for this email, you will receive password reset instructions."
      );
    } catch (err) {
      console.error("FORGOT PASSWORD ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111111] px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1a1a] p-8 shadow-2xl sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-wide text-[#F5B942]">
            SAVORA
          </h1>

          <p className="mt-5 text-3xl font-semibold">
            Forgot Password?
          </p>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            Enter your registered email address and we will send you
            instructions to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-[#F5B942]"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="text-sm leading-6 text-green-400">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#F5B942] py-3 font-semibold text-black transition hover:bg-[#dca333] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Instructions"}
          </button>
        </form>

        <div className="mt-7 text-center">
          <Link
            to="/login"
            className="text-sm text-[#F5B942] transition hover:text-yellow-300"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}