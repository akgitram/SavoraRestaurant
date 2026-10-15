import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";


function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();


  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data");
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");
  };

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#111111]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
        {/* LOGO */}
        <Link
          to="/"
          className="font-serif text-2xl font-bold tracking-wider text-[#F5B942]"
        >
          SAVORA
        </Link>

        {/* NAVIGATION */}
        <div className="hidden items-center gap-7 md:flex">
          <Link
            to="/"
            className="text-sm text-gray-300 transition hover:text-[#F5B942]"
          >
            Home
          </Link>

          <Link
            to="/menu"
            className="text-sm text-gray-300 transition hover:text-[#F5B942]"
          >
            Menu
          </Link>

          <Link
            to="/about"
            className="text-sm text-gray-300 transition hover:text-[#F5B942]"
          >
            About
          </Link>

          <Link
            to="/gallery"
            className="text-sm text-gray-300 transition hover:text-[#F5B942]"
          >
            Gallery
          </Link>

          <Link
            to="/reservation"
            className="text-sm text-gray-300 transition hover:text-[#F5B942]"
          >
            Reservation
          </Link>

          <Link
            to="/contact"
            className="text-sm text-gray-300 transition hover:text-[#F5B942]"
          >
            Contact
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              {/* LOGIN */}
              <Link
                to="/login"
                className="rounded-lg border border-[#F5B942] px-4 py-2 text-sm text-[#F5B942] transition hover:bg-[#F5B942] hover:text-black"
              >
                Login
              </Link>

              {/* SIGNUP */}
              <Link
                to="/signup"
                className="rounded-lg bg-[#F5B942] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#dca333]"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* USER NAME */}
              <span className="hidden text-sm text-gray-300 sm:block">
                Hi, {user.name}
              </span>

              {/* DASHBOARD */}
              <Link
                to={user.role === "ADMIN" ? "/dashboard" : "/userdashboard"}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-[#F5B942] hover:text-[#F5B942]"
              >
                {user.role === "ADMIN"
                  ? "Admin Dashboard"
                  : "Dashboard for user"}
              </Link>

              {/* LOGOUT */}
              <button onClick={() => navigate("/cart")} className="relative mx-3">
                <ShoppingCart size={22} />

                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#F5B942] text-xs text-black ">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
