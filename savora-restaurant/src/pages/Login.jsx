
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const loginData = {
      email: email.trim().toLowerCase(),
      password,
    };

    try {
      setLoading(true);

      const response = await loginUser(loginData);

      console.log("Login response:", response);

      // Validate the response before saving the session.
      if (!response?.token ||  !response.email) {
        console.error("Missing token or user ID:", response);
        alert("Login response is missing the token or user ID.");
        return;
      }

      const user = {
        id: response.id ?? response.email,
        name: response.name,
        email: response.email,
        role: response.role,
      };

      // Save user and token first.
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(user));

      // Notify CartContext to load this account's cart.
      window.dispatchEvent(new Event("user-changed"));

      // Navigate according to the role returned by the backend.
      if (response.role === "ADMIN") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/userdashboard", { replace: true });
      }
    } catch (error) {
      console.error("Login failed:", error);

      const status = error?.response?.status;

      if (status === 401) {
        alert("Invalid email or password.");
      } else if (status === 403) {
        alert("Login forbidden. Please check Spring Security.");
      } else if (status === 400) {
        alert("Please enter valid login details.");
      } else if (error?.request) {
        alert("Backend server is not responding.");
      } else {
        alert("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111111] px-5 text-white">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#181818] md:grid-cols-2">

        {/* IMAGE */}
        <div className="relative hidden min-h-[650px] md:block">
          <img
            src="/images/restaurant.jpeg"
            alt="Savora Restaurant"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/50" />

          <div className="absolute bottom-12 left-10">
            <h1 className="font-serif text-5xl font-bold">
              Welcome to
              <span className="block text-[#F5B942]">
                Savora
              </span>
            </h1>

            <p className="mt-4 text-gray-300">
              Good food brings people together.
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="p-8 md:p-12">
          <Link
            to="/"
            className="text-2xl font-bold text-[#F5B942]"
          >
            SAVORA
          </Link>

          <div className="mt-12">
            <h2 className="font-serif text-4xl font-bold">
              Welcome Back
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Login to your account
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-[#F5B942]"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <div className="mb-2 flex justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs text-[#F5B942] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-[#F5B942]"
                />
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#F5B942] py-3 font-semibold text-black transition hover:bg-[#e5aa35] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#F5B942] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
