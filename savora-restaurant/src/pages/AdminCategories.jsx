import { useEffect, useState } from "react";
import { API_URL } from "../config";
const API = `${API_URL}/api/categories`;

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchCategories = async () => {
    try {
      setError("");

      const response = await fetch(API, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to load categories. Status: ${response.status}`,
        );
      }

      const data = await response.json();

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.content)
          ? data.content
          : Array.isArray(data.data)
            ? data.data
            : [];

      setCategories(list);

      console.log("Categories received from backend:", list);
    } catch (err) {
      setError(err.message || "Unable to load categories.");
      console.error("Category loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !imageUrl.trim()) {
      setError("Please enter both category name and image URL.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(API, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          name: name.trim(),
          imageUrl: imageUrl.trim(),
        }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Access denied. Sign in with an admin account and check your Spring Security configuration.",
          );
        }

        throw new Error(`Failed to add category (${response.status})`);
      }

      setName("");
      setImageUrl("");
      setSuccess("Category added successfully!");

      await fetchCategories();
    } catch (err) {
      setError(err.message || "Unable to add category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("You are not authorized to delete this category.");
        }

        throw new Error(`Failed to delete category (${response.status})`);
      }

      setCategories((previous) =>
        previous.filter((category) => category.id !== id),
      );

      setSuccess("Category deleted successfully!");
    } catch (err) {
      setError(err.message || "Unable to delete category.");
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[4px] text-[#F5B942]">
              Savora Admin
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Manage Categories
            </h1>

            <p className="mt-2 text-gray-400">
              Add categories to display on your restaurant Home page.
            </p>
          </div>

          <span className="rounded-full bg-[#242424] px-4 py-2 text-sm text-[#F5B942]">
            {categories.length} Categories
          </span>
        </div>

        {/* ADD CATEGORY FORM */}
        <div className="mb-10 rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 sm:p-8">
          <h2 className="mb-6 text-xl font-semibold">Add New Category</h2>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Category Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Example: Pizza"
                className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none focus:border-[#F5B942]"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Category Image URL
              </label>

              <input
                type="text"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="/images/pizza.jpeg or an image URL"
                className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none focus:border-[#F5B942]"
                required
              />
            </div>

            {imageUrl.trim() && (
              <div className="md:col-span-2">
                <p className="mb-2 text-sm text-gray-400">Image preview</p>

                <img
                  src={imageUrl}
                  alt="Category preview"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  onLoad={(event) => {
                    event.currentTarget.style.display = "block";
                  }}
                  className="h-40 w-48 rounded-xl object-cover"
                />
              </div>
            )}

            {error && (
              <p className="md:col-span-2 text-sm text-red-400">{error}</p>
            )}

            {success && (
              <p className="md:col-span-2 text-sm text-green-400">{success}</p>
            )}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#F5B942] px-7 py-3 font-semibold text-black transition hover:bg-[#ffd36b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Adding..." : "Add Category"}
              </button>
            </div>
          </form>
        </div>

        {/* CATEGORY LIST */}
        <div>
          <h2 className="mb-6 text-2xl font-bold">Existing Categories</h2>

          {loading ? (
            <p className="text-gray-400">Loading categories...</p>
          ) : categories.length === 0 ? (
            <div className="rounded-xl border border-white/10 p-8 text-center text-gray-400">
              No categories found. Add your first category above.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a]"
                >
                  <img
                    src={category.imageUrl || "/images/pizza.jpeg"}
                    alt={category.name}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "/images/pizza.jpeg";
                    }}
                    className="h-48 w-full object-cover"
                  />

                  <div className="flex items-center justify-between gap-3 p-5">
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        ID: {category.id}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(category.id)}
                      className="rounded-lg bg-red-600/15 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCategories;
