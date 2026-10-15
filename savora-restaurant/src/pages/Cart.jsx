import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalItems,
    totalAmount,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-5">🛒</div>

          <h1 className="text-3xl font-bold mb-3">
            Your Cart is Empty
          </h1>

          <p className="text-gray-400 mb-6">
            Add some delicious food to your cart.
          </p>

          <button
            onClick={() => navigate("/menu")}
            className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Your Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-5">

            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-[#1c1c1c] rounded-xl p-5 flex flex-col sm:flex-row gap-5"
              >

                <img
                  src={item.imageUrl || "/images/restaurant.jpg"}
                  alt={item.name}
                  className="w-full sm:w-32 h-32 object-cover rounded-lg"
                />

                <div className="flex-1">

                  <div className="flex justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold">
                        {item.name}
                      </h2>

                      <p className="text-gray-400 text-sm mt-1">
                        {item.description}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>

                  <p className="text-orange-400 font-semibold mt-3">
                    ₹{item.price}
                  </p>

                  <div className="flex items-center gap-4 mt-4">

                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-9 h-9 bg-gray-700 rounded-lg hover:bg-gray-600"
                    >
                      −
                    </button>

                    <span className="font-bold text-lg">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="w-9 h-9 bg-orange-500 rounded-lg hover:bg-orange-600"
                    >
                      +
                    </button>

                    <span className="ml-auto font-bold">
                      ₹{item.price * item.quantity}
                    </span>

                  </div>

                </div>

              </div>
            ))}

          </div>

          {/* SUMMARY */}
          <div className="bg-[#1c1c1c] rounded-xl p-6 h-fit">

            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>

            <div className="flex justify-between text-gray-400 mb-3">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between text-gray-400 mb-3">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>

            <div className="flex justify-between text-gray-400 mb-5">
              <span>Delivery</span>
              <span>Free</span>
            </div>

            <hr className="border-gray-700 mb-5" />

            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total</span>
              <span className="text-orange-400">
                ₹{totalAmount}
              </span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-bold"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate("/menu")}
              className="w-full border border-gray-600 hover:bg-gray-800 py-3 rounded-lg font-semibold mt-3"
            >
              Continue Shopping
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Cart;