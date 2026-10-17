
import { useEffect, useState } from "react";
import { signupUser } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Countdown while the signup request is pending
  useEffect(() => {
    if (!isSending) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isSending]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSending) return;

    setErrorMessage("");

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const signupData = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    };

    setSecondsLeft(300);
    setIsSending(true);

    try {
      const response = await signupUser(signupData);

      console.log("Signup and OTP request successful:", response);

      // Navigate as soon as the backend reports success
      navigate("/mail", {
        state: { email: signupData.email },
      });
    } catch (error) {
      console.error("Signup failed:", error);
      console.log("Status:", error?.response?.status);
      console.log("Data:", error?.response?.data);

      if (error?.response?.status === 409) {
        setErrorMessage("Email already exists.");
      } else if (error?.response?.status === 400) {
        setErrorMessage("Please enter valid details.");
      } else if (error?.response?.status === 401) {
        setErrorMessage(
          "OTP email service authorization failed. Please try again later."
        );
      } else if (error?.response?.status === 403) {
        setErrorMessage(
          "Signup is forbidden. Please try again later."
        );
      } else if (error?.request) {
        setErrorMessage(
          "Server is taking too long to respond. Please try again."
        );
      } else {
        setErrorMessage("Signup failed. Please try again.");
      }
    } finally {
      setIsSending(false);
    }
  };

  const minutes = String(
    Math.floor(secondsLeft / 60)
  ).padStart(2, "0");

  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111111] px-5 py-10 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#181818] p-8 md:p-12">

        <Link
          to="/"
          className="text-2xl font-bold text-[#F5B942]"
        >
          SAVORA
        </Link>

        <div className="mt-10">
          <h1 className="font-serif text-4xl font-bold">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Join us for a delicious experience.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={isSending}
              className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-[#F5B942] disabled:opacity-50"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={isSending}
              className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-[#F5B942] disabled:opacity-50"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              disabled={isSending}
              className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-[#F5B942] disabled:opacity-50"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              disabled={isSending}
              className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-[#F5B942] disabled:opacity-50"
            />

            {isSending && (
              <div className="rounded-xl border border-white/10 bg-[#111111] p-5 text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-[#F5B942]" />

                <p className="font-semibold text-[#F5B942]">
                  Sending verification OTP...
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {minutes}:{seconds}
                </p>

                <p className="mt-2 text-sm text-gray-400">
                  Please wait while we process your signup.
                  You will be redirected when the request succeeds.
                </p>
              </div>
            )}

            {errorMessage && (
              <p
                role="alert"
                className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400"
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSending}
              className="w-full rounded-lg bg-[#F5B942] py-3 font-semibold text-black transition hover:bg-[#e5aa35] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSending ? "Sending OTP..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#F5B942] hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;