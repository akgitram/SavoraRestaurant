
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FoodCard from "../components/FoodCard";
import axios from "axios";

const CATEGORY_API = "http://localhost:8080/api/categories";
const MENU_API = "http://localhost:8080/api/menu";

function getList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.content)) return data.data.content;
  return [];
}

function getCategoryName(item) {
  if (typeof item === "string") return item;

  return (
    item?.name ??
    item?.categoryName ??
    item?.title ??
    ""
  );
}

function getFoodCategory(food) {
  if (typeof food?.category === "string") {
    return food.category;
  }

  return (
    food?.category?.name ??
    food?.category?.categoryName ??
    food?.categoryName ??
    ""
  );
}

function Menu() {
  const [searchParams] = useSearchParams();

  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );

  // Fetch menu items.
  useEffect(() => {
    let active = true;

    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(MENU_API);
        const items = getList(response.data);

        if (active) {
          console.log("MENU DATA:", response.data);
          setMenuItems(items);
        }
      } catch (err) {
        console.error("MENU FETCH ERROR:", err);

        if (active) {
          setError(
            `Unable to load menu items (${
              err.response?.status || "network error"
            }).`
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchMenu();

    return () => {
      active = false;
    };
  }, []);

  // Fetch categories.
  useEffect(() => {
    let active = true;

    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);
        setCategoryError("");

        const response = await axios.get(CATEGORY_API);
        const categoryList = getList(response.data);

        if (active) {
          console.log("CATEGORY DATA:", response.data);
          setCategories(categoryList);
        }
      } catch (err) {
        console.error("CATEGORY FETCH ERROR:", err);

        if (active) {
          setCategoryError(
            `Unable to load categories (${
              err.response?.status || "network error"
            }).`
          );
        }
      } finally {
        if (active) setCategoryLoading(false);
      }
    };

    fetchCategories();

    return () => {
      active = false;
    };
  }, []);

  // Sync category with the URL.
  useEffect(() => {
    setCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  const filteredMenu =
    category.toLowerCase() === "all"
      ? menuItems
      : menuItems.filter(
          (food) =>
            getFoodCategory(food).trim().toLowerCase() ===
            category.trim().toLowerCase()
        );

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <Navbar />

      <main className="px-5 pb-20 pt-32">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[4px] text-[#F5B942]">
              Discover
            </p>

            <h1 className="mt-3 font-serif text-5xl font-bold">
              Our Menu
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              Fresh ingredients. Great taste. Every time.
            </p>
          </div>

          {/* Category buttons */}
          {categoryLoading ? (
            <p className="mb-8 text-center text-gray-400">
              Loading categories...
            </p>
          ) : (
            <>
              {categoryError && (
                <p className="mb-5 text-center text-red-400">
                  {categoryError}
                </p>
              )}

              <div className="mb-10 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setCategory("All")}
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition ${
                    category.toLowerCase() === "all"
                      ? "bg-[#F5B942] text-black"
                      : "border border-white/10 bg-[#1a1a1a] text-gray-300 hover:border-[#F5B942] hover:text-[#F5B942]"
                  }`}
                >
                  All
                </button>

                {categories.map((item, index) => {
                  const name = getCategoryName(item);

                  if (!name) return null;

                  return (
                    <button
                      type="button"
                      key={item?.id ?? name ?? index}
                      onClick={() => setCategory(name)}
                      className={`rounded-full px-6 py-2.5 text-sm font-medium transition ${
                        category.toLowerCase() === name.toLowerCase()
                          ? "bg-[#F5B942] text-black"
                          : "border border-white/10 bg-[#1a1a1a] text-gray-300 hover:border-[#F5B942] hover:text-[#F5B942]"
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Menu loading */}
          {loading && (
            <div className="py-20 text-center text-gray-400">
              Loading menu...
            </div>
          )}

          {/* Menu error */}
          {!loading && error && (
            <div className="py-12 text-center">
              <p className="text-red-400">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-full bg-[#F5B942] px-6 py-2.5 font-semibold text-black transition hover:bg-yellow-400"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty menu */}
          {!loading && !error && filteredMenu.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-5xl">🍽️</p>

              <h2 className="mt-4 text-2xl font-semibold">
                No menu items found
              </h2>

              <p className="mt-2 text-gray-500">
                {category.toLowerCase() === "all"
                  ? "No menu items are available right now."
                  : `No items available in ${category}.`}
              </p>

              {category.toLowerCase() !== "all" && (
                <button
                  type="button"
                  onClick={() => setCategory("All")}
                  className="mt-5 rounded-full bg-[#F5B942] px-6 py-2.5 font-semibold text-black"
                >
                  View All Items
                </button>
              )}
            </div>
          )}

          {/* Menu grid */}
          {!loading && !error && filteredMenu.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMenu.map((food, index) => (
                <FoodCard
                  key={food.id ?? index}
                  food={food}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Menu;