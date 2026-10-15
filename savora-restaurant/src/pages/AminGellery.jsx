import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Image as ImageIcon, RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL = "http://localhost:8080/admin/gellery";

function AminGellery() {
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchImages = async () => {
    try {
      setError("");
      const response = await axios.get(API_URL);
      setImages(response.data);
      console.log("data loaded", response.data);
    } catch (err) {
      setError("Unable to load gallery images.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleAddImage = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await axios.post(
        API_URL,
        {
          name: name.trim(),
          imageUrl: imageUrl.trim(),
        },
        {
          headers: getHeaders(),
        },
      );

      setName("");
      setImageUrl("");
      setPreview("");
      setMessage("Gallery image added successfully!");

      await fetchImages();
    } catch (err) {
      console.error("Add image error:", err.response?.data || err);
      setError(
        err.response?.status === 403
          ? "Access denied. Only an admin can add images."
          : err.response?.data?.message || "Failed to add image.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (image) => {
    const id = image?.id;

    // Prevent requests such as /admin/gellery/undefined
    console.log(id);
    if (id === undefined || id === null || !Number.isFinite(Number(id))) {
      console.error("Invalid image ID:", image);
      setError("Cannot delete image: valid image ID not found.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${image.name}"?`,
    );

    if (!confirmed) return;

    setDeletingId(id);
    setMessage("");
    setError("");

    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: getHeaders(),
      });

      console.log("Delete response:", response.status, response.data);

      setImages((previousImages) =>
        previousImages.filter((item) => String(item.id) !== String(id)),
      );

      setMessage("Image deleted successfully!");

      // Reload the list to reflect the backend's current data.
      await fetchImages();
    } catch (err) {
      console.error(
        "Delete image error:",
        err.response?.status,
        err.response?.data || err.message,
      );

      if (err.response?.status === 403) {
        setError("Access denied. Only an admin can delete images.");
      } else if (err.response?.status === 404) {
        setError("Image not found. Refresh the gallery and try again.");
        await fetchImages();
      } else {
        setError(err.response?.data?.message || "Failed to delete image.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 pb-20 pt-32">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[4px] text-[#F5B942]">
            SAVORA ADMIN
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
            Gallery Management
          </h1>

          <p className="mt-3 text-gray-400">
            Add and manage the images displayed in your restaurant gallery.
          </p>
        </div>

        {/* Add Image Form */}
        <div className="mb-12 grid gap-8 rounded-2xl border border-white/10 bg-[#181818] p-6 md:grid-cols-2 md:p-8">
          <div>
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
              <Plus className="text-[#F5B942]" />
              Add New Image
            </h2>

            <form onSubmit={handleAddImage} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Image Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Restaurant Interior"
                  required
                  maxLength={100}
                  className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none focus:border-[#F5B942]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Image URL
                </label>

                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setPreview(e.target.value);
                  }}
                  placeholder="https://example.com/image.jpg"
                  required
                  className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none focus:border-[#F5B942]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F5B942] py-3 font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={18} />
                {loading ? "Adding..." : "Add Image"}
              </button>
            </form>

            {message && (
              <p className="mt-4 text-sm text-green-400">{message}</p>
            )}

            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          </div>

          {/* Image Preview */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Image Preview</h2>

            <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-[#111111]">
              {preview ? (
                <img
                  src={preview}
                  alt="Gallery preview"
                  className="h-64 w-full object-cover"
                  onError={() => setPreview("")}
                />
              ) : (
                <div className="text-center text-gray-500">
                  <ImageIcon size={48} className="mx-auto mb-3" />
                  <p>Enter an image URL to preview it</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Existing Images */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-bold">Existing Images</h2>
            <p className="mt-2 text-gray-400">Total images: {images.length}</p>
          </div>

          <button
            onClick={fetchImages}
            className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 hover:border-[#F5B942]"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {images.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#181818] p-10 text-center text-gray-400">
            No gallery images found. Add your first image above.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-xl border border-white/10 bg-[#181818]"
              >
                <img
                  src={image.imageUrl}
                  alt={image.name}
                  className="h-56 w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.alt = "Image could not be loaded";
                  }}
                />

                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{image.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">ID: {image.id}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image)}
                    disabled={deletingId === image.id}
                    title="Delete image"
                    className="shrink-0 rounded-lg bg-red-500/10 p-3 text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === image.id ? (
                      <span className="text-xs">Deleting...</span>
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default AminGellery;
