
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  User,
  CalendarDays,
  ShoppingBag,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080";

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function getArray(response) {
  const data = response.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.reservations)) return data.reservations;

  return [];
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getOrderItems(order) {
  const items = order.items || order.orderItems || [];

  if (!Array.isArray(items) || items.length === 0) {
    return order.itemName || order.name || "Food order";
  }

  return items
    .map((item) => {
      const name =
        item.menuItem?.name ||
        item.menuItemName ||
        item.itemName ||
        item.name ||
        "Food item";

      const quantity = item.quantity || 1;

      return `${name} × ${quantity}`;
    })
    .join(", ");
}

function getStatusClass(status) {
  const normalized = String(status || "").toUpperCase();

  if (
    normalized.includes("DELIVERED") ||
    normalized.includes("CONFIRMED") ||
    normalized.includes("PAID") ||
    normalized.includes("COMPLETED")
  ) {
    return "bg-green-100 text-green-700";
  }

  if (
    normalized.includes("CANCELLED") ||
    normalized.includes("FAILED") ||
    normalized.includes("REJECTED")
  ) {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

function Userdashboard() {
  const navigate = useNavigate();
  const user = readUser();

  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [reservationsError, setReservationsError] = useState("");

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setOrdersError("");
    setReservationsError("");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const orderRequest = axios.get(
      `${API_URL}/api/orders/my`,
      config
    );

    const reservationRequest = axios.get(
      `${API_URL}/api/user/my`,
      config
    );

    const [orderResult, reservationResult] = await Promise.allSettled([
      orderRequest,
      reservationRequest,
    ]);

    if (orderResult.status === "fulfilled") {
      setOrders(getArray(orderResult.value));
    } else {
      setOrders([]);
      setOrdersError(
        "Unable to load orders. Check your orders API endpoint."
      );
      console.error("Orders API error:", orderResult.reason);
    }

    if (reservationResult.status === "fulfilled") {
      setReservations(getArray(reservationResult.value));
    } else {
      setReservations([]);
      setReservationsError(
        "Unable to load reservations. Check your reservations API endpoint."
      );
      console.error(
        "Reservations API error:",
        reservationResult.reason
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("user-changed"));
    navigate("/login");
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      title: "Dashboard",
      path: "/userdashboard",
    },
    {
      icon: User,
      title: "My Profile",
      path: "/profile",
    },
    {
      icon: CalendarDays,
      title: "My Reservations",
      path: "/myreservation",
    },
    {
      icon: ShoppingBag,
      title: "My Orders",
      path: "/my-orders",
    },
  ];

  const upcomingReservations = reservations.filter((reservation) => {
    const status = String(reservation.status || "").toUpperCase();

    return (
      !status.includes("CANCELLED") &&
      !status.includes("REJECTED") &&
      (!reservation.reservationDate ||
        new Date(reservation.reservationDate) >= new Date(
          new Date().setHours(0, 0, 0, 0)
        ))
    );
  });

  const recentOrders = [...orders]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.orderDate || 0).getTime();
      const dateB = new Date(b.createdAt || b.orderDate || 0).getTime();

      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f8f1e4] text-black">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 bg-[#111111] p-6 text-white lg:block">
          <h1
            onClick={() => navigate("/")}
            className="cursor-pointer text-2xl font-bold"
          >
            SAVORA
          </h1>

          <p className="mt-1 text-xs text-[#F5B942]">
            CUSTOMER PANEL
          </p>

          <nav className="mt-12 space-y-2">
            {menuItems.map(({ icon: Icon, title, path }) => {
              const active = path === "/userdashboard";

              return (
                <button
                  key={title}
                  onClick={() => navigate(path)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition ${
                    active
                      ? "bg-[#F5B942] text-black"
                      : "text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {title}
                </button>
              );
            })}

            <button
              onClick={logout}
              className="mt-8 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1 p-5 md:p-10">
          <div className="mx-auto max-w-7xl">
            {/* HEADER */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  Customer Dashboard
                </p>

                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Welcome, {user?.name || "User"}!
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your profile, reservations and orders.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchDashboardData}
                  disabled={loading}
                  title="Refresh dashboard"
                  className="rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw
                    size={18}
                    className={loading ? "animate-spin" : ""}
                  />
                </button>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111111] font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </div>
            </div>

            {/* MOBILE NAVIGATION */}
            <div className="mt-6 grid grid-cols-2 gap-2 lg:hidden">
              {menuItems.map(({ icon: Icon, title, path }) => (
                <button
                  key={title}
                  onClick={() => navigate(path)}
                  className="flex items-center gap-2 rounded-lg bg-[#111111] p-3 text-sm text-white"
                >
                  <Icon size={17} />
                  {title}
                </button>
              ))}

              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>

            {/* STATISTICS */}
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <ShoppingBag className="text-[#b17a00]" size={25} />
                <p className="mt-4 text-3xl font-bold">
                  {loading ? "—" : orders.length}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Total Orders
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <CalendarDays className="text-[#b17a00]" size={25} />
                <p className="mt-4 text-3xl font-bold">
                  {loading ? "—" : reservations.length}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Total Reservations
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <User className="text-[#b17a00]" size={25} />
                <p className="mt-4 text-2xl font-bold">
                  {user ? "Active" : "Guest"}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Account Status
                </p>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="mt-8">
              <h2 className="text-xl font-bold">Quick Actions</h2>

              <div className="mt-4 grid gap-5 sm:grid-cols-3">
                <button
                  onClick={() => navigate("/profile")}
                  className="rounded-2xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <User size={28} className="text-[#b17a00]" />
                  <h3 className="mt-4 font-semibold">My Profile</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    View and manage your account
                  </p>
                </button>

                <button
                  onClick={() => navigate("/myreservation")}
                  className="rounded-2xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <CalendarDays
                    size={28}
                    className="text-[#b17a00]"
                  />
                  <h3 className="mt-4 font-semibold">
                    My Reservations
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    View your table reservations
                  </p>
                </button>

                <button
                  onClick={() => navigate("/my-orders")}
                  className="rounded-2xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <ShoppingBag
                    size={28}
                    className="text-[#b17a00]"
                  />
                  <h3 className="mt-4 font-semibold">My Orders</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    View your food orders
                  </p>
                </button>
              </div>
            </div>

            {/* RECENT ORDERS */}
            <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold">My Recent Orders</h2>

                <button
                  onClick={() => navigate("/my-orders")}
                  className="text-sm text-[#b17a00] hover:underline"
                >
                  View All
                </button>
              </div>

              {ordersError && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {ordersError}
                </div>
              )}

              {loading ? (
                <p className="py-8 text-center text-gray-500">
                  Loading orders...
                </p>
              ) : recentOrders.length === 0 ? (
                <div className="py-8 text-center">
                  <ShoppingBag
                    size={35}
                    className="mx-auto text-gray-300"
                  />
                  <p className="mt-3 font-medium">No orders yet</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Your real orders will appear here.
                  </p>
                  <button
                    onClick={() => navigate("/menu")}
                    className="mt-4 rounded-lg bg-[#111111] px-5 py-2 text-sm text-white"
                  >
                    Explore Menu
                  </button>
                </div>
              ) : (
                <div className="mt-5 divide-y divide-gray-100">
                  {recentOrders.map((order, index) => {
                    const status = order.orderStatus || order.status || "Pending";

                    return (
                      <div
                        key={order.id ?? order.orderId ?? index}
                        className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
                      >
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f8f1e4]">
                            <ShoppingBag
                              size={22}
                              className="text-[#b17a00]"
                            />
                          </div>

                          <div className="min-w-0">
                            <h3 className="break-words font-semibold">
                              {getOrderItems(order)}
                            </h3>
                            <p className="mt-1 text-xs text-gray-500">
                              Order #{order.id ?? order.orderId ?? "—"}
                              {" • "}
                              {formatDate(
                                order.createdAt ||
                                  order.orderDate ||
                                  order.date
                              )}
                            </p>

                            {order.totalAmount != null && (
                              <p className="mt-1 text-sm font-medium">
                                ₹{Number(order.totalAmount).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>

                        <span
                          className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs ${getStatusClass(status)}`}
                        >
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* UPCOMING RESERVATIONS */}
            <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold">
                  Upcoming Reservations
                </h2>

                <button
                  onClick={() => navigate("/myreservation")}
                  className="text-sm text-[#b17a00] hover:underline"
                >
                  View All
                </button>
              </div>

              {reservationsError && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {reservationsError}
                </div>
              )}

              {loading ? (
                <p className="py-8 text-center text-gray-500">
                  Loading reservations...
                </p>
              ) : upcomingReservations.length === 0 ? (
                <div className="py-8 text-center">
                  <CalendarDays
                    size={35}
                    className="mx-auto text-gray-300"
                  />
                  <p className="mt-3 font-medium">
                    No upcoming reservations
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Your upcoming table reservations will appear here.
                  </p>
                  <button
                    onClick={() => navigate("/reservation")}
                    className="mt-4 rounded-lg bg-[#111111] px-5 py-2 text-sm text-white"
                  >
                    Reserve a Table
                  </button>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {upcomingReservations.slice(0, 3).map((reservation, index) => {
                    const date =
                      reservation.reservationDate ||
                      reservation.date ||
                      reservation.bookingDate;

                    const time =
                      reservation.reservationTime ||
                      reservation.time ||
                      reservation.bookingTime;

                    const guests =
                      reservation.numberOfGuests ??
                      reservation.guestCount ??
                      reservation.guests;

                    const status =
                      reservation.status || "Pending";

                    return (
                      <div
                        key={reservation.id ?? reservation.reservationId ?? index}
                        className="flex flex-col justify-between gap-3 border-b border-gray-100 pb-4 last:border-0 sm:flex-row sm:items-center"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#f8f1e4]">
                            <CalendarDays
                              size={24}
                              className="text-[#b17a00]"
                            />
                          </div>

                          <div>
                            <h3 className="font-semibold">
                              Reservation #{reservation.id ?? reservation.reservationId ?? "—"}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {formatDate(date)}
                              {time ? ` • ${time}` : ""}
                            </p>
                            {guests != null && (
                              <p className="mt-1 text-sm text-gray-500">
                                Guests: {guests}
                              </p>
                            )}
                          </div>
                        </div>

                        <span
                          className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs ${getStatusClass(status)}`}
                        >
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Userdashboard;