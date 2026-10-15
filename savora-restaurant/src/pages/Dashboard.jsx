import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [card, setCard] = useState({
    totalOrders: 0,
    totalReservations: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:8080/api/admin/dashboard/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCard({
          totalOrders: response.data.totalOrders ?? 0,
          totalReservations: response.data.totalReservations ?? 0,
          totalUsers: response.data.totalUsers ?? 0,
          totalRevenue: response.data.totalRevenue ?? 0,
        });
      } catch (err) {
        console.error("Dashboard stats error:", err);

        if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
        } else if (err.response?.status === 403) {
          setError("Access denied. Please log in with an admin account.");
        } else {
          setError("Unable to load dashboard statistics.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const stats = [
    {
      title: "Total Users",
      value: card.totalUsers,
      icon: "👥",
      color: "bg-blue-500/10",
    },
    {
      title: "Total Orders",
      value: card.totalOrders,
      icon: "🛒",
      color: "bg-green-500/10",
    },
    {
      title: "Total Reservations",
      value: card.totalReservations,
      icon: "📅",
      color: "bg-purple-500/10",
    },
    {
      title: "Total Revenue",
      value: `₹${Number(card.totalRevenue).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })}`,
      icon: "💰",
      color: "bg-yellow-500/10",
    },
  ];

  const quickActions = [
    {
      title: "Manage Menu",
      description: "Add, edit or remove dishes.",
      icon: "🍽️",
      path: "/dashboard/menu",
    },
    {
      title: "View Orders",
      description: "View and manage customer orders.",
      icon: "🛒",
      path: "/admin/orders",
    },
    {
      title: "Reservations",
      description: "Manage table reservations.",
      icon: "📅",
      path: "/adminreservation",
    },
    {
      title: "Manage Users",
      description: "View registered customers.",
      icon: "👥",
      path: "/adminusers",
    },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-[#181818] transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 px-6 py-6">
            <h1 className="text-2xl font-bold tracking-wide text-[#F5B942]">
              SAVORA
            </h1>
            <p className="mt-1 text-xs uppercase tracking-widest text-gray-500">
              Admin Panel
            </p>
          </div>

          <nav className="flex-1 px-4 py-6">
            <p className="mb-3 px-3 text-xs uppercase tracking-widest text-gray-500">
              Management
            </p>

            <button
              onClick={() => navigate("/dashboard/menu")}
              className="mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-300 transition hover:bg-white/5 hover:text-[#F5B942]"
            >
              🍽️ Menu Management
            </button>

            <button
              onClick={() => navigate("/admin/orders")}
              className="mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-300 transition hover:bg-white/5 hover:text-[#F5B942]"
            >
              🛒 Orders
            </button>

            <button
              onClick={() => navigate("/adminreservation")}
              className="mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-300 transition hover:bg-white/5 hover:text-[#F5B942]"
            >
              📅 Reservations
            </button>

            <button
              onClick={() => navigate("/adminusers")}
              className="mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-300 transition hover:bg-white/5 hover:text-[#F5B942]"
            >
              👥 Users
            </button>

            <button
              onClick={() => navigate("/admin/review")}
              className="mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-300 transition hover:bg-white/5 hover:text-[#F5B942]"
            >
              ⭐ Reviews
            </button>
            <button
              onClick={() => navigate("/my-orders")}
              className="mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-300 transition hover:bg-white/5 hover:text-[#F5B942]"
            >
               📅 My Orders
            </button>
            <button
              onClick={() => navigate("/admin/gellery")}
              className="mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-300 transition hover:bg-white/5 hover:text-[#F5B942]"
            >
              🌐  My Gellery
            </button>

            <button
              onClick={() => navigate("/admin/category")}
              className="mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-300 transition hover:bg-white/5 hover:text-[#F5B942]"
            >
               📅 My Categories
            </button>

            <p className="mb-3 mt-8 px-3 text-xs uppercase tracking-widest text-gray-500">
              Website
            </p>

            <button
              onClick={() => navigate("/")}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-300 transition hover:bg-white/5 hover:text-[#F5B942]"
            >
              🌐 View Website
            </button>
          </nav>

          {/* Admin profile */}
          <div className="border-t border-white/10 p-4">
            <div className="mb-3 flex items-center gap-3 rounded-lg bg-[#111111] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5B942] font-bold text-black">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {user?.name || "Admin"}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {user?.email || "admin@savora.com"}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-red-400 transition hover:bg-red-500/10"
            >
              ↪ Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:ml-64">
        {/* Navbar */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-white/10 bg-[#111111]/95 px-5 backdrop-blur md:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg border border-white/10 px-3 py-2 text-xl md:hidden"
            aria-label="Open sidebar"
          >
            ☰
          </button>

          <div className="hidden md:block">
            <p className="text-sm text-gray-500">Admin Dashboard</p>
            <h2 className="text-xl font-semibold">
              Welcome back, {user?.name || "Admin"} 👋 <span onClick={()=>navigate("/addadmin")}
              className="mx-2 font-bold border-1 py-0.5 px-1.5 cursor-pointer hover:bg-white hover:text-black">+</span>
            </h2>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-[#F5B942] hover:text-[#F5B942]"
          >
           <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111] font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
          </button>
          
        </header>

        <main className="p-5 md:p-8">
          {/* Mobile heading */}
          <div className="mb-8 md:hidden">
            <p className="text-sm text-gray-500">Admin Dashboard</p>
            <h2 className="mt-1 text-2xl font-semibold">
              Welcome back, {user?.name || "Admin"} 👋 <span onClick={()=>navigate("/addadmin")}
              className="mx-2 font-bold border-1 py-0.5 px-1.5 cursor-pointer hover:bg-white hover:text-black">+</span>
            </h2>
          </div>

          {/* Overview */}
          <section>
            <div className="mb-5">
              <h2 className="text-2xl font-bold">Overview</h2>
              <p className="mt-1 text-sm text-gray-500">
                Here's what's happening with your restaurant.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-white/10 bg-[#181818] p-5 transition hover:-translate-y-1 hover:border-[#F5B942]/40"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        {stat.title}
                      </p>

                      <h3 className="mt-2 text-2xl font-bold">
                        {loading ? "Loading..." : stat.value}
                      </h3>
                    </div>

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} text-2xl`}
                    >
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="mt-10">
            <h2 className="mb-5 text-2xl font-bold">Quick Actions</h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  onClick={() => navigate(action.path)}
                  className="rounded-2xl border border-white/10 bg-[#181818] p-5 text-left transition hover:border-[#F5B942] hover:bg-[#1d1d1d]"
                >
                  <span className="text-3xl">{action.icon}</span>

                  <h3 className="mt-4 font-semibold">
                    {action.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {action.description}
                  </p>
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;