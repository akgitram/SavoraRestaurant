
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MENU_API = "http://localhost:8080/api/menu";
const CATEGORY_API = "http://localhost:8080/api/categories";

function getList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function getCategoryName(category) {
  if (typeof category === "string") return category;

  return (
    category?.name ??
    category?.categoryName ??
    category?.title ??
    ""
  );
}

function AdminMenu() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categoryError, setCategoryError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    available: true,
  });

  const authConfig = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};

  // =========================
  // GET ALL MENU ITEMS
  // =========================
  const fetchMenuItems = async () => {
    try {
      setLoading(true);

      const response = await axios.get(MENU_API, authConfig);

      console.log("MENU DATA:", response.data);

      setMenuItems(getList(response.data));
    } catch (error) {
      console.error("Error loading menu:", error);
      alert(
        error.response?.status === 401
          ? "Please login again."
          : "Unable to load menu."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET ADMIN CATEGORIES
  // =========================
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoryError("");

      const response = await axios.get(
        CATEGORY_API,
        authConfig
      );

      console.log("CATEGORY DATA:", response.data);

      const categoryList = getList(response.data).filter(
        (item) => getCategoryName(item).trim() !== ""
      );

      setCategories(categoryList);
    } catch (error) {
      console.error("Error loading categories:", error);

      setCategories([]);

      if (error.response?.status === 403) {
        setCategoryError(
          "Access denied. Check your category API permissions."
        );
      } else if (error.response?.status === 401) {
        setCategoryError(
          "Your session has expired. Please log in again."
        );
      } else {
        setCategoryError(
          "Unable to load categories. Check your backend."
        );
      }
    } finally {
      setCategoriesLoading(false);
    }
  };

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
    // Load initial page data once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
      available: true,
    });

    setEditingId(null);
    setShowForm(false);
  };

  // =========================
  // ADD / UPDATE MENU ITEM
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category) {
      alert("Please select a category.");
      return;
    }

    const menuData = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      imageUrl: form.imageUrl.trim(),
      available: form.available,
    };

    console.log("MENU DATA:", menuData);

    try {
      setSaving(true);

      if (editingId !== null) {
        await axios.put(
          `${MENU_API}/${editingId}`,
          menuData,
          authConfig
        );

        alert("Menu item updated successfully.");
      } else {
        await axios.post(
          MENU_API,
          menuData,
          authConfig
        );

        alert("Menu item added successfully.");
      }

      resetForm();

      await fetchMenuItems();
    } catch (error) {
      console.error("Menu save error:", error);
      console.log("Status:", error.response?.status);
      console.log("Data:", error.response?.data);

      if (error.response?.status === 403) {
        alert("You don't have admin permission.");
      } else if (error.response?.status === 401) {
        alert("Please log in again.");
      } else {
        alert("Unable to save menu item. Check the backend logs.");
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EDIT MENU ITEM
  // =========================
  const handleEdit = (item) => {
    setForm({
      name: item.name ?? "",
      description: item.description ?? "",
      price: item.price ?? "",
      category: getCategoryName(item.category) ||
        item.categoryName ||
        "",
      imageUrl: item.imageUrl ?? "",
      available: item.available ?? true,
    });

    setEditingId(item.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE MENU ITEM
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${MENU_API}/${id}`,
        authConfig
      );

      alert("Menu item deleted successfully.");

      await fetchMenuItems();
    } catch (error) {
      console.error("Delete error:", error);

      if (error.response?.status === 403) {
        alert("You don't have admin permission.");
      } else if (error.response?.status === 401) {
        alert("Please log in again.");
      } else {
        alert("Unable to delete menu item.");
      }
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between border-b border-white/10 bg-[#181818] px-5 py-4 md:px-8">
        <div>
          <button
            onClick={() => navigate("/admin")}
            className="text-2xl font-bold tracking-wide text-[#F5B942]"
          >
            SAVORA
          </button>

          <p className="text-xs uppercase tracking-widest text-gray-500">
            Admin Panel
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="hidden rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-[#F5B942] hover:text-[#F5B942] sm:block"
          >
            Dashboard
          </button>

          <button
            onClick={logout}
            className="rounded-lg bg-[#F5B942] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#e5aa35]"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm text-[#F5B942]">
              Restaurant Management
            </p>

            <h1 className="mt-1 text-3xl font-bold md:text-4xl">
              Menu Management
            </h1>

            <p className="mt-2 text-gray-500">
              Add, edit and manage your SAVORA menu.
            </p>
          </div>

          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
            className="rounded-lg bg-[#F5B942] px-6 py-3 font-semibold text-black transition hover:bg-[#e5aa35]"
          >
            {showForm ? "Cancel" : "+ Add Menu Item"}
          </button>
        </div>

        {/* ADD / EDIT FORM */}
        {showForm && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-[#181818] p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              {editingId !== null
                ? "Edit Menu Item"
                : "Add New Menu Item"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-6 grid gap-5 md:grid-cols-2"
            >
              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Item Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Margherita Pizza"
                  required
                  className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-[#F5B942]"
                />
              </div>

              {/* DYNAMIC CATEGORY */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  disabled={
                    categoriesLoading ||
                    categories.length === 0
                  }
                  className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none focus:border-[#F5B942] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading categories..."
                      : categories.length === 0
                      ? "No categories available"
                      : "Select Category"}
                  </option>

                  {categories.map((item, index) => {
                    const name = getCategoryName(item);

                    return (
                      <option
                        key={item.id ?? `${name}-${index}`}
                        value={name}
                      >
                        {name}
                      </option>
                    );
                  })}
                </select>

                {categoryError && (
                  <p className="mt-2 text-sm text-red-400">
                    {categoryError}
                  </p>
                )}

                {!categoriesLoading &&
                  !categoryError &&
                  categories.length === 0 && (
                    <p className="mt-2 text-sm text-gray-500">
                      Add a category in Category Management first.
                    </p>
                  )}

                {!categoriesLoading &&
                  categories.length > 0 && (
                    <button
                      type="button"
                      onClick={fetchCategories}
                      className="mt-2 text-sm text-[#F5B942] hover:underline"
                    >
                      Refresh categories
                    </button>
                  )}
              </div>

              {/* PRICE */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="399"
                  min="0"
                  step="0.01"
                  required
                  className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-[#F5B942]"
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Image URL
                </label>

                <input
                  type="text"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="/images/pizza.jpg"
                  className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-[#F5B942]"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the dish..."
                  rows="4"
                  required
                  className="w-full resize-none rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-[#F5B942]"
                />
              </div>

              {/* AVAILABLE */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="available"
                  checked={form.available}
                  onChange={handleChange}
                  className="h-5 w-5 accent-[#F5B942]"
                />

                <label className="text-sm">
                  Item is available
                </label>
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 md:col-span-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-white/10 px-5 py-3 text-gray-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || categoriesLoading || categories.length === 0}
                  className="rounded-lg bg-[#F5B942] px-6 py-3 font-semibold text-black transition hover:bg-[#e5aa35] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                    ? "Update Item"
                    : "Add Item"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* MENU LIST */}
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                All Menu Items
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {menuItems.length} item
                {menuItems.length !== 1 ? "s" : ""} in your menu.
              </p>
            </div>

            <button
              onClick={() => {
                fetchMenuItems();
                fetchCategories();
              }}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 hover:border-[#F5B942] hover:text-[#F5B942]"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-[#181818] p-10 text-center text-gray-500">
              Loading menu...
            </div>
          ) : menuItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#181818] p-12 text-center">
              <div className="text-5xl">🍽️</div>

              <h3 className="mt-4 text-xl font-semibold">
                No menu items yet
              </h3>

              <p className="mt-2 text-gray-500">
                Add your first dish to the SAVORA menu.
              </p>

              <button
                onClick={() => setShowForm(true)}
                className="mt-5 rounded-lg bg-[#F5B942] px-5 py-3 font-semibold text-black"
              >
                + Add Menu Item
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item, index) => (
                <div
                  key={item.id ?? index}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#181818] transition hover:-translate-y-1 hover:border-[#F5B942]/40"
                >
                  {/* IMAGE */}
                  <div className="relative h-48 bg-[#222222]">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-5xl">
                        🍽️
                      </div>
                    )}

                    <span
                      className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                        item.available
                          ? "bg-green-500/90 text-white"
                          : "bg-red-500/90 text-white"
                      }`}
                    >
                      {item.available ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {item.name}
                        </h3>

                        <span className="mt-2 inline-block rounded-full bg-[#F5B942]/10 px-3 py-1 text-xs font-medium text-[#F5B942]">
                          {getCategoryName(item.category) ||
                            item.categoryName ||
                            "Uncategorized"}
                        </span>
                      </div>

                      <p className="whitespace-nowrap text-lg font-bold text-[#F5B942]">
                        ₹{item.price}
                      </p>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-500">
                      {item.description}
                    </p>

                    {/* ACTIONS */}
                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 rounded-lg border border-[#F5B942]/40 px-4 py-2 text-sm font-semibold text-[#F5B942] transition hover:bg-[#F5B942] hover:text-black"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 rounded-lg border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminMenu;
