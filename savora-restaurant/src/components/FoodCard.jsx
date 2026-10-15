
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function FoodCard({ food }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [adding, setAdding] = useState(false);

  const image = food?.imageUrl;

  const categoryName =
    typeof food?.category === "string"
      ? food.category
      : food?.category?.name ??
        food?.category?.categoryName ??
        food?.categoryName ??
        "";

  const available =
    food?.available === true ||
    food?.available === "true";

  const handleAddToCart = () => {
    if (adding) return;

    setAdding(true);
    setMessage("");

    try {
      const result = addToCart(food);

      if (!result?.success) {
        setMessage(result?.message || "Unable to add item to cart.");
        return;
      }

      setMessage(`${food.name} added to cart!`);
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);
      setMessage("Unable to add this item. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleOrderNow = () => {
    if (!available) return;

    const result = addToCart(food);

    if (!result?.success) {
      setMessage(result?.message || "Please log in first.");
      return;
    }

    navigate("/cart");
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-lg transition duration-300 hover:-translate-y-2 hover:border-[#F5B942]/50">

      {/* IMAGE */}
      <div className="relative h-64 w-full overflow-hidden bg-[#222]">
        <img
          src={image || "/images/restaurant.jpg"}
          alt={food?.name || "Savora food"}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/images/restaurant.jpg";
          }}
        />

        {/* CATEGORY */}
        {categoryName && (
          <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-[#F5B942] backdrop-blur-sm">
            {categoryName}
          </div>
        )}

        {/* AVAILABILITY */}
        {!available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-red-500/90 px-4 py-2 text-sm font-semibold text-white">
              Not Available
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">
            {food?.name || "Unnamed Item"}
          </h2>

          <span className="whitespace-nowrap text-lg font-bold text-[#F5B942]">
            ₹{Number(food?.price || 0).toFixed(2)}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-400">
          {food?.description || "Delicious food, freshly prepared for you."}
        </p>

        {/* FEEDBACK */}
        {message && (
          <p
            role="status"
            aria-live="polite"
            className={`mt-3 text-sm ${
              message.includes("added")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        {/* BUTTONS */}
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            disabled={!available}
            onClick={handleOrderNow}
            className={`w-full rounded-xl py-3 font-semibold transition ${
              available
                ? "bg-[#F5B942] text-black hover:bg-[#dca333]"
                : "cursor-not-allowed bg-gray-700 text-gray-400"
            }`}
          >
            {available ? "Order Now" : "Unavailable"}
          </button>

          <button
            type="button"
            disabled={!available || adding}
            onClick={handleAddToCart}
            className={`w-full rounded-xl border border-[#F5B942] py-3 font-semibold transition ${
              available && !adding
                ? "bg-transparent text-[#F5B942] hover:bg-[#F5B942] hover:text-black"
                : "cursor-not-allowed bg-gray-800 text-gray-500"
            }`}
          >
            {adding
              ? "Adding..."
              : !available
                ? "Unavailable"
                : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;