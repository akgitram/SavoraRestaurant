
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    location.state?.email || ""
  );
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/user/verify-otp",
        { email, otp }
      );

      setMessage(
        response.data.message || "Email verified successfully!"
      );

      navigate("/login");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Invalid or expired OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111111] px-4 text-white">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1b1b] p-8 shadow-xl"
      >
        <p className="text-sm font-bold tracking-[0.3em] text-amber-400">
          SAVORA
        </p>

        <h1 className="mt-4 text-3xl font-bold">
          Verify your email
        </h1>

        <p className="mt-3 text-sm text-gray-400">
          Enter the six-digit verification code sent to your email.
        </p>

        <label className="mt-6 block text-sm text-gray-300">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#111111] p-3 outline-none focus:border-amber-400"
        />

        <label className="mt-5 block text-sm text-gray-300">
          6-digit OTP
        </label>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          pattern="[0-9]{6}"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="Enter OTP"
          required
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#111111] p-3 tracking-[0.5em] outline-none focus:border-amber-400"
        />

        {message && (
          <p role="status" className="mt-4 text-sm text-amber-400">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="mt-6 w-full rounded-lg bg-amber-400 py-3 font-semibold text-black hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>
    </div>
  );
}
