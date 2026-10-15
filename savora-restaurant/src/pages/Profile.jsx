
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [user, setUser] = useState({
    name: savedUser.name || "",
    email: savedUser.email || "",
    phone: savedUser.phone || "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "user",
      JSON.stringify({ ...savedUser, ...user })
    );

    setMessage("Profile updated successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const initials = user.name
    ? user.name.trim().charAt(0).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-[#111111] px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-gray-400 transition hover:text-amber-400"
        >
          ← Back
        </button>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
            SAVORA
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-2 text-gray-400">
            Manage your personal information and account settings.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          {/* Profile card */}
          <div className="h-fit rounded-2xl border border-white/10 bg-[#1b1b1b] p-6 text-center shadow-xl">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-amber-400 bg-amber-400/10 text-3xl font-bold text-amber-400">
              {initials}
            </div>

            <h2 className="mt-4 text-xl font-semibold">
              {user.name || "Your Name"}
            </h2>

            <p className="mt-1 break-all text-sm text-gray-400">
              {user.email || "your@email.com"}
            </p>

            <div className="mt-6 border-t border-white/10 pt-5 text-left">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Account
              </p>
              <p className="text-sm text-gray-300">Personal Information</p>
              <p className="mt-2 text-sm text-gray-300">Account Settings</p>
            </div>

            <button
              onClick={handleLogout}
              className="mt-6 w-full rounded-lg border border-red-500/40 px-4 py-3 font-medium text-red-400 transition hover:bg-red-500 hover:text-white"
            >
              Logout
            </button>
          </div>

          {/* Edit profile form */}
          <div className="rounded-2xl border border-white/10 bg-[#1b1b1b] p-6 shadow-xl sm:p-8">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <p className="mt-1 text-sm text-gray-400">
              Update your profile details below.
            </p>

            {message && (
              <div
                role="status"
                className="mt-5 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400"
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSave} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-amber-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-amber-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-amber-400 px-5 py-3 font-semibold text-black transition hover:bg-amber-300 sm:w-auto"
              >
                Save Changes
              </button>
            </form>

            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="font-semibold">Security</h3>
              <p className="mt-2 text-sm text-gray-400">
                Keep your account secure by using a strong password.
              </p>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="mt-4 rounded-lg border border-white/20 px-4 py-2 text-sm transition hover:border-amber-400 hover:text-amber-400"
              >
                Change Password →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
