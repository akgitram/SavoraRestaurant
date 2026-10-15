
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingId, setCancelingId] = useState(null);

  const API_URL = "http://localhost:8080/api/orders";

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setOrders([]);
        setError("Please log in to view your orders.");
        return;
      }

      const response = await axios.get(`${API_URL}/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("ORDERS RESPONSE:", response.data);

      setOrders(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error("FETCH ORDERS ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    if (
      orderId == null ||
      String(orderId).trim() === "" ||
      !Number.isInteger(Number(orderId)) ||
      Number(orderId) <= 0
    ) {
      setError("Order ID is missing. Please refresh your orders.");
      console.error("Invalid order ID:", orderId);
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to cancel order #${orderId}?`
      )
    ) {
      return;
    }

    try {
      setCancelingId(String(orderId));
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in again.");
        return;
      }

      const response = await axios.patch(
        `${API_URL}/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("CANCEL RESPONSE:", response.data);

      // Refresh the orders after successful cancellation.
      await fetchOrders();
    } catch (err) {
      console.error("CANCEL ORDER ERROR:", err);
      console.error("STATUS:", err.response?.status);
      console.error("DATA:", err.response?.data);

      setError(
        err.response?.data?.message ||
          "Could not cancel the order. Please try again."
      );
    } finally {
      setCancelingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Match the cancellation rules in the Spring Boot backend.
  const canCancel = (status) =>
    ["PENDING", "CONFIRMED"].includes(
      String(status || "").toUpperCase()
    );

  return (
    <div className="min-h-screen bg-[#111111] px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 font-semibold tracking-[0.25em] text-amber-500">
              SAVORA
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-2 text-gray-400">
              View your orders and track their status.
            </p>
          </div>

          <Link
            to="/menu"
            className="rounded-lg bg-amber-500 px-5 py-3 font-semibold text-black hover:bg-amber-400"
          >
            Order More Food
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <p className="py-12 text-center text-gray-400">
            Loading your orders...
          </p>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-[#1b1b1b] px-6 py-16 text-center">
            <h2 className="text-2xl font-semibold">No orders yet</h2>

            <p className="mt-3 text-gray-400">
              Your delicious SAVORA meals will appear here.
            </p>

            <Link
              to="/menu"
              className="mt-6 inline-block rounded-lg bg-amber-500 px-6 py-3 font-bold text-black hover:bg-amber-400"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const orderId = order.id ?? order.orderId;
              const validId =
                orderId != null &&
                String(orderId).trim() !== "" &&
                Number.isInteger(Number(orderId)) &&
                Number(orderId) > 0;

              const isCancelling =
                cancelingId === String(orderId);

              const status = String(
                order.status || "PENDING"
              ).toUpperCase();

              const items = order.orderItems || [];

              return (
                <div
                  key={orderId ?? `order-${index}`}
                  className="overflow-hidden rounded-2xl border border-gray-800 bg-[#1b1b1b]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 p-5">
                    <div>
                      <p className="text-sm text-gray-400">
                        Order ID
                      </p>

                      <p className="font-bold text-amber-400">
                        {validId ? `#${orderId}` : "Unavailable"}
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        {formatDate(order.orderDate)}
                      </p>
                    </div>

                    <span className="rounded-full bg-amber-500/15 px-4 py-2 text-sm font-semibold text-amber-400">
                      {status.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="space-y-4 p-5">
                    {items.map((item, itemIndex) => (
                      <div
                        key={item.id ?? itemIndex}
                        className="flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="font-medium">
                            {item.menuItem?.name || "Food item"}
                          </p>

                          <p className="mt-1 text-sm text-gray-400">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="font-semibold">
                          ₹{Number(item.subtotal ?? 0).toFixed(2)}
                        </p>
                      </div>
                    ))}

                    <div className="border-t border-gray-800 pt-4">
                      <p className="text-sm text-gray-400">
                        Delivery address
                      </p>

                      <p className="mt-1">
                        {order.address || "Not provided"}
                      </p>

                      <div className="mt-4 flex flex-wrap justify-between gap-3">
                        <div>
                          <p className="text-sm text-gray-400">
                            Payment method
                          </p>

                          <p className="mt-1">
                            {order.paymentMethod || "Not specified"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-400">
                            Total amount
                          </p>

                          <p className="text-xl font-bold text-amber-400">
                            ₹
                            {Number(
                              order.totalamount ??
                                order.totalAmount ??
                                0
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cancellation button */}
                    <div className="border-t border-gray-800 pt-4">
                      {canCancel(status) ? (
                        <button
                          type="button"
                          onClick={() => cancelOrder(orderId)}
                          disabled={!validId || isCancelling}
                          className="rounded-lg border border-red-500 px-5 py-2.5 font-semibold text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isCancelling
                            ? "Cancelling..."
                            : "Cancel Order"}
                        </button>
                      ) : (
                        <p className="text-sm text-gray-400">
                          This order cannot be cancelled because its
                          status is {status.replaceAll("_", " ")}.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}