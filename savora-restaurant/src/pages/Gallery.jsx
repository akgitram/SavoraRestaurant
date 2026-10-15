
import { useEffect, useState } from "react";
import axios from "axios";
import { RefreshCw, Image as ImageIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL = "http://localhost:8080/admin/gellery";

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      console.log("Gallery images:", response.data);

      // API should return an array of image objects.
      const galleryData = Array.isArray(response.data)
        ? response.data
        : [];

      setImages(galleryData);
    } catch (err) {
      console.error(
        "Gallery fetch error:",
        err.response?.data || err
      );
      setError("Unable to load gallery images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <Navbar />

      <main className="px-5 pb-20 pt-32">
        <div className="mx-auto max-w-7xl">
          {/* Heading */}
          <div className="mb-12 text-center">
            <p className="uppercase tracking-[4px] text-[#F5B942]">
              Our Moments
            </p>

            <h1 className="mt-3 font-serif text-5xl font-bold">
              Our Gallery
            </h1>

            <p className="mt-4 text-gray-400">
              A glimpse of our food, ambience and happy moments.
            </p>
          </div>

          {/* Refresh */}
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={fetchImages}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm transition hover:border-[#F5B942] disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh Gallery
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <p className="py-12 text-center text-gray-400">
              Loading gallery images...
            </p>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="py-12 text-center">
              <p className="mb-4 text-red-400">{error}</p>

              <button
                onClick={fetchImages}
                className="rounded-lg bg-[#F5B942] px-5 py-2 font-semibold text-black"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Gallery Images */}
          {!loading && !error && images.length > 0 && (
            <div className="grid auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {images.map((image, index) => (
                <div
                  key={image.id ?? `${image.name}-${index}`}
                  className={`group relative overflow-hidden rounded-2xl ${
                    index % 6 === 0 ? "row-span-2" : ""
                  }`}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.name || "Savora Gallery"}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  {/* Image title */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-12 opacity-0 transition duration-300 group-hover:opacity-100">
                    <h2 className="font-semibold text-white">
                      {image.name}
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty gallery */}
          {!loading && !error && images.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#181818] px-6 py-16 text-center">
              <ImageIcon
                size={48}
                className="mx-auto mb-4 text-[#F5B942]"
              />

              <h2 className="text-2xl font-semibold">
                No Images Yet
              </h2>

              <p className="mt-3 text-gray-400">
                Gallery images added by the admin will appear here.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Gallery;