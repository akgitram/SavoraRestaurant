
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Reset token is missing from the link.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/auth/reset-password",
        {
          token,
          newPassword: password,
        }
      );

      setMessage(
        response.data?.message || "Password reset successfully."
      );

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-8 shadow-xl"
      >
        <h1 className="mb-2 text-3xl font-bold text-white">
          Reset Password
        </h1>

        <p className="mb-6 text-gray-400">
          Enter your new password below.
        </p>

        {message && (
          <p className="mb-4 rounded-lg bg-green-900/40 p-3 text-green-300">
            {message}
          </p>
        )}

        {error && (
          <p className="mb-4 rounded-lg bg-red-900/40 p-3 text-red-300">
            {error}
          </p>
        )}

        <label className="mb-2 block text-sm text-gray-300">
          New Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          autoComplete="new-password"
          required
          minLength={8}
          className="mb-5 w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-orange-500"
        />

        <label className="mb-2 block text-sm text-gray-300">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          autoComplete="new-password"
          required
          minLength={8}
          className="mb-6 w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-orange-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}