
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:8080/api/admin/orders";

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const normalizeStatus = (status) =>
  String(status ?? "PENDING").toUpperCase();

const getOrderId = (order) => order.id ?? order.orderId;

const formatDateTime = (value) => {
  if (!value) return "Not set";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const money = (value) => `₹${Number(value ?? 0).toFixed(2)}`;

const getErrorMessage = (err, fallback) => {
  const data = err.response?.data;

  if (typeof data === "string" && data.trim()) return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;

  if (err.response?.status === 401) {
    return "Your session has expired. Please log in again.";
  }

  if (err.response?.status === 403) {
    return "Access denied (403). Check your admin login, JWT token, and Spring Security rules.";
  }

  return fallback;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem("token");

    return token
      ? { Authorization: `Bearer ${token}` }
      : {};
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setError("");

      const response = await axios.get(API_URL, {
        headers: getHeaders(),
      });

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setOrders(data);

      setSelectedStatus((previous) => {
        const next = { ...previous };

        data.forEach((order) => {
          const id = getOrderId(order);

          if (id != null) {
            next[id] = normalizeStatus(order.status);
          }
        });

        return next;
      });
    } catch (err) {
      console.error("FETCH ADMIN ORDERS ERROR:", err);

      setError(
        getErrorMessage(
          err,
          "Unable to load orders. Check the backend and your admin login."
        )
      );
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (order) => {
    const id = getOrderId(order);
    const oldStatus = normalizeStatus(order.status);
    const newStatus = normalizeStatus(selectedStatus[id]);

    if (id == null) {
      setError("Order ID is missing.");
      return;
    }

    if (!newStatus || newStatus === oldStatus) return;

    if (oldStatus === "CANCELLED" || oldStatus === "DELIVERED") {
      setError(
        `Order #${id} is ${oldStatus.replaceAll("_", " ")} and cannot be changed.`
      );
      return;
    }

    setSavingId(String(id));
    setError("");
    setNotice("");

    try {
      // Update order status in the backend.
      const response = await axios.patch(
        `${API_URL}/${id}/status`,
        { status: newStatus },
        { headers: getHeaders() }
      );

      // Update the UI immediately.
      const updatedOrder =
        response.data && typeof response.data === "object"
          ? response.data
          : {};

      setOrders((previous) =>
        previous.map((item) =>
          String(getOrderId(item)) === String(id)
            ? {
                ...item,
                ...updatedOrder,
                status: newStatus,
              }
            : item
        )
      );

      setSelectedStatus((previous) => ({
        ...previous,
        [id]: newStatus,
      }));

      setNotice(
        `Order #${id} status updated to ${newStatus.replaceAll("_", " ")}.`
      );

      // Refresh to retrieve updated confirmation/delivery timestamps.
      try {
        const refresh = await axios.get(API_URL, {
          headers: getHeaders(),
        });

        if (Array.isArray(refresh.data)) {
          setOrders(refresh.data);

          setSelectedStatus((previous) => {
            const next = { ...previous };

            refresh.data.forEach((item) => {
              const itemId = getOrderId(item);

              if (itemId != null) {
                next[itemId] = normalizeStatus(item.status);
              }
            });

            return next;
          });
        }
      } catch (refreshErr) {
        console.error("REFRESH AFTER UPDATE ERROR:", refreshErr);

        setNotice(
          `Order #${id} was updated. The list could not refresh. Check the backend JSON serialization error.`
        );
      }
    } catch (err) {
      console.error("UPDATE ORDER STATUS ERROR:", err);

      const responseText = [
        err.response?.data?.message,
        err.response?.data?.error,
        typeof err.response?.data === "string"
          ? err.response.data
          : "",
      ]
        .filter(Boolean)
        .join(" ");

      const isSerializationError =
        responseText.includes("Could not write JSON") ||
        responseText.includes("HttpMessageNotWritableException") ||
        responseText.includes("Cannot lazily initialize collection");

      if (isSerializationError) {
        setError(
          "The server failed while creating the JSON response. The database may already have been updated. Check the database and fix lazy loading in the backend."
        );
      } else {
        setError(
          getErrorMessage(err, "Unable to update order status.")
        );
      }
    } finally {
      setSavingId(null);
    }
  };

  const statusClass = (status) => {
    switch (normalizeStatus(status)) {
      case "CONFIRMED":
        return "text-blue-400";
      case "PREPARING":
        return "text-yellow-400";
      case "OUT_FOR_DELIVERY":
        return "text-purple-400";
      case "DELIVERED":
        return "text-green-400";
      case "CANCELLED":
        return "text-red-400";
      default:
        return "text-amber-400";
    }
  };

  const countStatus = (status) =>
    orders.filter(
      (order) => normalizeStatus(order.status) === status
    ).length;

  return (
    <div className="min-h-screen bg-[#111111] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold tracking-[0.25em] text-amber-500">
              SAVORA ADMIN
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Manage Orders
            </h1>

            <p className="mt-2 text-gray-400">
              Review customer orders and update their progress.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={fetchOrders}
              disabled={loading}
              className="rounded-lg border border-gray-700 px-4 py-3 hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            <Link
              to="/dashboard"
              className="rounded-lg bg-amber-500 px-4 py-3 font-semibold text-black hover:bg-amber-400"
            >
              Admin Home
            </Link>
          </div>
        </header>

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Total", orders.length],
            ["Pending", countStatus("PENDING")],
            ["Confirmed", countStatus("CONFIRMED")],
            ["Delivered", countStatus("DELIVERED")],
          ].map(([label, count]) => (
            <div
              key={label}
              className="rounded-xl border border-gray-800 bg-[#1b1b1b] p-5"
            >
              <p className="text-sm text-gray-400">
                {label} Orders
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-400">
                {count}
              </p>
            </div>
          ))}
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-300"
          >
            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200"
          >
            {notice}
          </div>
        )}

        {loading ? (
          <p className="py-12 text-center text-gray-400">
            Loading orders...
          </p>
        ) : orders.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-[#1b1b1b] p-10 text-center text-gray-400">
            No customer orders found.
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order, index) => {
              const id = getOrderId(order);
              const status = normalizeStatus(order.status);

              const items = Array.isArray(order.orderItems)
                ? order.orderItems
                : [];

              const saving = savingId === String(id);

              const chosenStatus = normalizeStatus(
                selectedStatus[id] ?? status
              );

              const locked =
                status === "CANCELLED" ||
                status === "DELIVERED";

              return (
                <article
                  key={id ?? index}
                  className="rounded-2xl border border-gray-800 bg-[#1b1b1b] p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-800 pb-4">
                    <div>
                      <h2 className="text-xl font-bold">
                        Order #{id ?? "Unavailable"}
                      </h2>

                      <p className="mt-1 text-sm text-gray-400">
                        Placed: {formatDateTime(order.orderDate)}
                      </p>

                      <p className="mt-2 text-sm text-gray-300">
                        Customer:{" "}
                        {order.user?.name ||
                          order.user?.email ||
                          "Customer"}
                      </p>

                      {order.user?.email && (
                        <p className="text-sm text-gray-400">
                          {order.user.email}
                        </p>
                      )}
                    </div>

                    <span
                      className={`font-bold ${statusClass(status)}`}
                    >
                      {status.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="grid gap-6 py-5 md:grid-cols-2">
                    <div>
                      <h3 className="mb-3 font-semibold text-amber-400">
                        Ordered Items
                      </h3>

                      {items.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No order items were included in the API response.
                        </p>
                      ) : (
                        items.map((item, itemIndex) => (
                          <div
                            key={item.id ?? itemIndex}
                            className="flex justify-between gap-3 py-2 text-sm"
                          >
                            <span className="text-gray-300">
                              {item.menuItem?.name || "Food item"} ×{" "}
                              {item.quantity ?? 0}
                            </span>

                            <span>
                              {money(
                                item.subtotal ??
                                  Number(
                                    item.price ??
                                      item.menuItem?.price ??
                                      0
                                  ) * Number(item.quantity ?? 0)
                              )}
                            </span>
                          </div>
                        ))
                      )}

                      <div className="mt-3 border-t border-gray-800 pt-3">
                        <div className="flex justify-between gap-3 font-bold">
                          <span>Total</span>

                          <span className="text-amber-400">
                            {money(
                              order.totalamount ?? order.totalAmount
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 font-semibold text-amber-400">
                        Delivery Details
                      </h3>

                      <p className="text-sm text-gray-300">
                        Address: {order.address || "Not provided"}
                      </p>

                      <p className="mt-2 text-sm text-gray-300">
                        Phone: {order.phone || "Not provided"}
                      </p>

                      <p className="mt-2 text-sm text-gray-300">
                        Payment:{" "}
                        {order.paymentMethod || "Not specified"}
                      </p>

                      <p className="mt-2 text-sm text-gray-300">
                        Confirmed at:{" "}
                        {formatDateTime(order.confirmedAt)}
                      </p>

                      <p className="mt-2 text-sm text-gray-300">
                        Estimated delivery:{" "}
                        {formatDateTime(order.estimatedDeliveryTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-gray-800 pt-5 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <label
                        htmlFor={`status-${id}`}
                        className="mb-2 block text-sm text-gray-400"
                      >
                        Update order status
                      </label>

                      <select
                        id={`status-${id}`}
                        value={chosenStatus}
                        onChange={(event) =>
                          setSelectedStatus((previous) => ({
                            ...previous,
                            [id]: event.target.value,
                          }))
                        }
                        disabled={saving || locked}
                        className="w-full rounded-lg border border-gray-700 bg-[#111111] px-4 py-3 text-white outline-none focus:border-amber-500 disabled:opacity-50"
                      >
                        {STATUSES.map((value) => (
                          <option key={value} value={value}>
                            {value.replaceAll("_", " ")}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateStatus(order)}
                      disabled={
                        saving ||
                        id == null ||
                        chosenStatus === status ||
                        locked
                      }
                      className="rounded-lg bg-amber-500 px-6 py-3 font-bold text-black hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {saving ? "Saving..." : "Update Status"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}