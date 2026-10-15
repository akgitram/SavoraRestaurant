
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/api";

// Load Razorpay Checkout script
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

function Checkout() {
  const navigate = useNavigate();
  const { cart, totalAmount, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [form, setForm] = useState({
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const placeOrder = async () => {
    if (!form.phone.trim() || !form.address.trim()) {
      alert("Please enter your phone number and delivery address.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (loading) return;

    setLoading(true);

    const orderData = {
      phone: form.phone.trim(),
      deliveryAddress: form.address.trim(),
      paymentMethod,
      items: cart.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      // Cash on Delivery: existing order API
      if (paymentMethod === "COD") {
        await api.post("/api/orders", orderData);

        clearCart();
        navigate("/orderSuccess");
        return;
      }

      // Online Payment: create a pending order and
      // Razorpay order through the Spring Boot backend.
      const scriptLoaded = await loadRazorpay();

      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay. Check your internet connection.");
      }

      const { data: paymentOrder } = await api.post(
        "/api/payment/create-order",
        orderData
      );

      if (
        !paymentOrder?.keyId ||
        !paymentOrder?.razorpayOrderId ||
        !paymentOrder?.restaurantOrderId ||
        !Number.isFinite(Number(paymentOrder?.amount))
      ) {
        throw new Error(
          "Invalid payment details received from the backend."
        );
      }

      const options = {
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency || "INR",
        name: "SAVORA",
        description: "Restaurant Order",
        order_id: paymentOrder.razorpayOrderId,

        handler: async (paymentResponse) => {
          try {
            // Verify payment on the backend before
            // clearing the cart or showing success.
            await api.post("/api/payment/verify", {
              restaurantOrderId: paymentOrder.restaurantOrderId,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            clearCart();
            navigate("/orderSuccess");
          } catch (error) {
            console.error("Payment verification error:", error);

            alert(
              "Payment could not be confirmed. Please check your order status or contact support before paying again."
            );
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },

        theme: {
          color: "#f97316",
        },
      };

      const checkout = new window.Razorpay(options);

      checkout.on("payment.failed", (response) => {
        console.error("Razorpay payment failed:", response.error);

        alert(
          response.error?.description ||
            "Payment failed. You can try again."
        );

        setLoading(false);
      });

      checkout.open();
    } catch (error) {
      console.error("CHECKOUT ERROR:", error);
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      if (!error.response) {
        alert(
          error.message ||
            "Cannot connect to the backend. Please check your server."
        );
      } else if (error.response.status === 401) {
        alert("Your login session has expired. Please login again.");
        navigate("/login");
      } else if (error.response.status === 403) {
        alert("Access denied. Check your Spring Security configuration.");
      } else {
        alert(
          error.response.data?.message ||
            "Unable to start checkout. Please try again."
        );
      }

      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            Your cart is empty
          </h1>

          <button
            onClick={() => navigate("/menu")}
            className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold"
          >
            Go to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* DELIVERY DETAILS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1c1c1c] rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">
                Delivery Details
              </h2>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-gray-300"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    autoComplete="tel"
                    required
                    className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block mb-2 text-gray-300"
                  >
                    Delivery Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter your complete delivery address"
                    rows={4}
                    required
                    className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="bg-[#1c1c1c] rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">
                Payment Method
              </h2>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("ONLINE")}
                  aria-pressed={paymentMethod === "ONLINE"}
                  className={`w-full text-left border rounded-xl p-5 transition ${
                    paymentMethod === "ONLINE"
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">💳</span>

                    <div className="flex-1">
                      <h3 className="font-bold text-lg">
                        Online Payment
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Pay using UPI, debit/credit cards or net banking
                        through Razorpay Checkout.
                      </p>
                    </div>

                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "ONLINE"}
                      onChange={() => setPaymentMethod("ONLINE")}
                      aria-label="Online Payment"
                    />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  aria-pressed={paymentMethod === "COD"}
                  className={`w-full text-left border rounded-xl p-5 transition ${
                    paymentMethod === "COD"
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">💵</span>

                    <div className="flex-1">
                      <h3 className="font-bold text-lg">
                        Cash on Delivery
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Pay when your food is delivered.
                      </p>
                    </div>

                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      aria-label="Cash on Delivery"
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-[#1c1c1c] rounded-xl p-6 h-fit">
            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-400">
                      {item.quantity} × ₹{item.price}
                    </p>
                  </div>

                  <p className="font-semibold">
                    ₹{Number(item.price) * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <hr className="border-gray-700 mb-5" />

            <div className="flex justify-between text-gray-400 mb-3">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>

            <div className="flex justify-between text-gray-400 mb-5">
              <span>Delivery</span>
              <span>Free</span>
            </div>

            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total</span>
              <span className="text-orange-400">
                ₹{totalAmount}
              </span>
            </div>

            <div className="bg-[#111] rounded-lg p-4 mb-5">
              <p className="text-sm text-gray-400">Selected Payment</p>
              <p className="font-bold mt-1">
                {paymentMethod === "COD"
                  ? "💵 Cash on Delivery"
                  : "💳 Razorpay Online Payment"}
              </p>
            </div>

            <button
              onClick={placeOrder}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 rounded-lg font-bold transition"
            >
              {loading
                ? "Processing..."
                : paymentMethod === "COD"
                  ? "Place Order"
                  : "Pay & Place Order"}
            </button>

            <button
              onClick={() => navigate("/cart")}
              disabled={loading}
              className="w-full border border-gray-600 hover:bg-gray-800 disabled:opacity-50 py-3 rounded-lg font-semibold mt-3"
            >
              Back to Cart
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Online payments are processed securely through Razorpay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;