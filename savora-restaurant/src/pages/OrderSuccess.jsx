
import { Link, useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-gray-700 bg-[#1c1c1c] p-8 text-center shadow-2xl">

        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/15">
          <svg
            className="h-14 w-14 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
          SAVORA
        </p>

        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Order Placed Successfully!
        </h1>

        <p className="mb-6 leading-7 text-gray-400">
          Thank you for ordering with SAVORA. Your delicious food
          is being prepared. You can track your order status
          from the My Orders page.
        </p>

        {orderId && (
          <div className="mb-6 rounded-lg bg-gray-800 p-4">
            <p className="text-sm text-gray-400">Your Order ID</p>
            <p className="mt-1 font-bold text-amber-400">
              #{orderId}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            to="/my-orders"
            className="rounded-lg bg-amber-500 px-6 py-3 font-bold text-black transition hover:bg-amber-400"
          >
            View My Orders
          </Link>

          <Link
            to="/menu"
            className="rounded-lg border border-gray-600 px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}