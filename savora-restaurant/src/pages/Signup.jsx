import { useState } from "react";
import { signupUser } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check password
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Data going to backend
    const signupData = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    };

    console.log("SIGNUP DATA:", signupData);

    try {
      const response = await signupUser(signupData);

      console.log("User created:", response);

      alert("Signup successful!");

      navigate("/mail");

    } catch (error) {
      console.log("Signup failed:", error);

      console.log("Status:", error?.response?.status);
      console.log("Data:", error?.response?.data);
      console.log("Message:", error?.message);

      if (error?.response?.status === 409) {
        alert("Email already exists");
      } else if (error?.response?.status === 400) {
        alert("Please enter valid details");
      } else if (error?.response?.status === 403) {
        alert("Request forbidden. Check backend security.");
      } else if (error?.request) {
        alert("Backend server is not responding");
      } else {
        alert("Signup failed");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111111] px-5 py-10 text-white">

      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#181818] p-8 md:p-12">

        {/* Logo */}
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

            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-[#F5B942]"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-[#F5B942]"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-[#F5B942]"
            />

            {/* Confirm Password */}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-[#F5B942]"
            />

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#F5B942] py-3 font-semibold text-black transition hover:bg-[#e5aa35] active:scale-[0.98]"
            >
              Sign Up
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