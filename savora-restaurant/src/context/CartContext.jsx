
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

// Get the currently logged-in user's ID.
function getUserId() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    return user?.id != null ? String(user.id) : null;
  } catch {
    return null;
  }
}

// Load the selected user's cart.
function getSavedCart(userId) {
  if (!userId) return [];

  try {
    const savedCart = JSON.parse(
      localStorage.getItem(`cart_${userId}`) || "[]"
    );

    return Array.isArray(savedCart) ? savedCart : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [userId, setUserId] = useState(() => getUserId());
  const [cart, setCart] = useState(() => getSavedCart(getUserId()));

  // Save the cart only for the currently authenticated user.
  useEffect(() => {
    if (!userId || getUserId() !== userId) return;

    localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
  }, [cart, userId]);

  // Synchronize cart after login, logout, or switching accounts.
  useEffect(() => {
    const syncUserCart = () => {
      const nextUserId = getUserId();

      setUserId((currentUserId) => {
        if (currentUserId === nextUserId) return currentUserId;

        setCart(getSavedCart(nextUserId));
        return nextUserId;
      });
    };

    window.addEventListener("user-changed", syncUserCart);
    window.addEventListener("storage", syncUserCart);

    // Check the current account when the provider mounts.
    syncUserCart();

    return () => {
      window.removeEventListener("user-changed", syncUserCart);
      window.removeEventListener("storage", syncUserCart);
    };
  }, []);

  // Add food to the logged-in user's cart.
  const addToCart = (food) => {
    const currentUserId = getUserId();

    if (!currentUserId) {
      return {
        success: false,
        message: "Please log in first to add items to your cart.",
      };
    }

    if (food?.id == null || food?.price == null) {
      console.error("Invalid food item:", food);

      return {
        success: false,
        message: "Food item must have an ID and price.",
      };
    }

    // Handle a recent login or account switch before adding.
    if (currentUserId !== userId) {
      const userCart = getSavedCart(currentUserId);
      const existingItem = userCart.find(
        (item) => String(item.id) === String(food.id)
      );

      const updatedCart = existingItem
        ? userCart.map((item) =>
            String(item.id) === String(food.id)
              ? { ...item, quantity: (Number(item.quantity) || 0) + 1 }
              : item
          )
        : [...userCart, { ...food, quantity: 1 }];

      localStorage.setItem(
        `cart_${currentUserId}`,
        JSON.stringify(updatedCart)
      );

      setUserId(currentUserId);
      setCart(updatedCart);

      return { success: true };
    }

    setCart((previousCart) => {
      const existingItem = previousCart.find(
        (item) => String(item.id) === String(food.id)
      );

      if (existingItem) {
        return previousCart.map((item) =>
          String(item.id) === String(food.id)
            ? { ...item, quantity: (Number(item.quantity) || 0) + 1 }
            : item
        );
      }

      return [...previousCart, { ...food, quantity: 1 }];
    });

    return { success: true };
  };

  const increaseQuantity = (id) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        String(item.id) === String(id)
          ? { ...item, quantity: (Number(item.quantity) || 0) + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          String(item.id) === String(id)
            ? { ...item, quantity: (Number(item.quantity) || 0) - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((previousCart) =>
      previousCart.filter(
        (item) => String(item.id) !== String(id)
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  const totalAmount = cart.reduce(
    (total, item) =>
      total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}