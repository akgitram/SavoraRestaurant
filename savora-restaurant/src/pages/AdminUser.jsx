import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:8080/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("USERS:", response.data);

      setUsers(response.data);
    } catch (error) {
      console.error("USER FETCH ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else if (error.response?.status === 403) {
        setError("You are not authorized to view users.");
      } else {
        setError("Failed to load users.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD USERS
  // =========================
  useEffect(() => {
    fetchUsers();
  }, []);

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
              Users
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
        <div className="mb-8">

          <p className="text-sm uppercase tracking-[3px] text-[#F5B942]">
            Administration
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Registered Users
          </h2>

          <p className="mt-2 text-gray-400">
            View all users registered on SAVORA.
          </p>

        </div>

        {/* ================= STATS ================= */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-[#181818] p-6">

            <p className="text-sm text-gray-400">
              Total Users
            </p>

            <p className="mt-2 text-3xl font-bold text-[#F5B942]">
              {users.length}
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-[#181818] p-6">

            <p className="text-sm text-gray-400">
              Normal Users
            </p>

            <p className="mt-2 text-3xl font-bold">
              {
                users.filter(
                  (user) => user.role === "USER"
                ).length
              }
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-[#181818] p-6">

            <p className="text-sm text-gray-400">
              Administrators
            </p>

            <p className="mt-2 text-3xl font-bold">
              {
                users.filter(
                  (user) => user.role === "ADMIN"
                ).length
              }
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
            Loading users...
          </div>
        )}

        {/* ================= USERS TABLE ================= */}
        {!loading && !error && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#181818]">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px]">

                <thead className="border-b border-white/10 bg-[#202020]">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                      ID
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                      Name
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                      Role
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {users.map((user) => (

                    <tr
                      key={user.id}
                      className="border-b border-white/5 transition hover:bg-white/5"
                    >

                      <td className="px-6 py-4 text-gray-400">
                        #{user.id}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {user.name}
                      </td>

                      <td className="px-6 py-4 text-gray-400">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.role === "ADMIN"
                              ? "bg-[#F5B942]/20 text-[#F5B942]"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {user.role}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* NO USERS */}
            {users.length === 0 && (
              <div className="py-16 text-center text-gray-500">
                No users registered yet.
              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
}

export default AdminUsers;