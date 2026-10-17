
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionTitle from "../components/SectionTitle";
import WhatsAppButton from "../components/WhatsAppButton";

import { API_URL } from "../config";
const CATEGORY_API = `${API_URL}/api/categories`;
const MENU_API = `${API_URL}/api/menu`;
const FALLBACK_IMAGE = "/images/pizza.jpeg";

function getList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.categories)) return data.categories;
  if (Array.isArray(data?.menuItems)) return data.menuItems;
  return [];
}

function getImage(value) {
  if (!value || typeof value !== "string") {
    return FALLBACK_IMAGE;
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/")
  ) {
    return value;
  }

  return `/${value}`;
}

function Home() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [categoryLoading, setCategoryLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(true);

  const [categoryError, setCategoryError] = useState("");
  const [menuError, setMenuError] = useState("");

  useEffect(() => {
    const fetchData = async (
      url,
      setData,
      setError,
      setLoading,
      label
    ) => {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `${label} request failed (${response.status})`
          );
        }

        const data = await response.json();
        setData(getList(data));
      } catch (error) {
        console.error(`Error loading ${label}:`, error);
        setError(error.message || `Unable to load ${label}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData(
      CATEGORY_API,
      setCategories,
      setCategoryError,
      setCategoryLoading,
      "Categories"
    );

    fetchData(
      MENU_API,
      setMenuItems,
      setMenuError,
      setMenuLoading,
      "Menu"
    );
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[#111111] text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden">
        <img
          src="/images/hero.jpeg"
          alt="Freshly prepared restaurant dishes"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-24 md:px-8">
          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-[#F5B942] sm:text-sm">
              Welcome to Savora
            </p>

            <h1 className="font-serif text-5xl font-bold leading-[1.08] sm:text-6xl md:text-7xl">
              Taste
              <span className="block text-[#F5B942]">
                The Difference.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-300 sm:text-lg">
              Fresh ingredients, authentic flavours, and memorable
              moments — thoughtfully prepared for every occasion.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/menu"
                className="rounded-full bg-[#F5B942] px-7 py-3.5 font-bold text-black shadow-lg transition hover:-translate-y-0.5 hover:bg-[#ffd36b]"
              >
                Explore Menu →
              </Link>

              <Link
                to="/reservation"
                className="rounded-full border border-white/50 px-7 py-3.5 font-semibold transition hover:border-white hover:bg-white hover:text-black"
              >
                Book a Table
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-300">
              <span>✦ Fresh ingredients</span>
              <span>✦ Made with passion</span>
              <span>✦ Warm hospitality</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-y border-white/10 bg-[#171717]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-white/10 md:grid-cols-4 md:divide-y-0">
          <Feature
            icon="🌿"
            title="Fresh Ingredients"
            description="Fresh, quality produce"
          />

          <Feature
            icon="👨‍🍳"
            title="Expert Chefs"
            description="Crafted with care"
          />

          <Feature
            icon="✨"
            title="Lovely Ambience"
            description="A place to unwind"
          />

          <Feature
            icon="🍽️"
            title="Made for You"
            description="Flavour in every bite"
          />
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="bg-[#f8f1e4] px-5 py-20 text-black sm:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            subtitle="Explore the flavours"
            title="Popular Categories"
          />

          {categoryLoading ? (
            <LoadingMessage text="Loading categories..." />
          ) : categoryError ? (
            <ErrorMessage message={categoryError} />
          ) : categories.length === 0 ? (
            <EmptyMessage text="No categories available yet. Add categories from your admin dashboard." />
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {categories.slice(0, 8).map((category, index) => (
                <CategoryCard
                  key={
                    category.id ??
                    category.categoryId ??
                    category.name ??
                    index
                  }
                  category={category}
                />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full border border-black/20 px-6 py-3 font-semibold transition hover:border-black hover:bg-black hover:text-white"
            >
              Browse All Dishes →
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="bg-[#111111] px-5 py-20 sm:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="relative">
            <div className="absolute -left-3 -top-3 h-full w-full rounded-3xl border border-[#F5B942]/50" />

            <img
              src="/images/restaurant.jpeg"
              alt="Inside the Savora restaurant"
              className="relative h-[320px] w-full rounded-3xl object-cover sm:h-[420px]"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = FALLBACK_IMAGE;
              }}
            />

            <div className="absolute bottom-5 right-5 rounded-2xl bg-[#F5B942] px-5 py-4 text-black shadow-xl">
              <p className="font-serif text-2xl font-bold">
                Made with love
              </p>
              <p className="mt-1 text-xs font-medium">
                Served with care
              </p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#F5B942]">
              A Little About Us
            </p>

            <h2 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
              More Than Just
              <span className="block text-[#F5B942]">
                A Restaurant.
              </span>
            </h2>

            <p className="mt-6 leading-8 text-gray-400">
              At Savora, good food brings people together. We pair
              quality ingredients with thoughtful preparation and a
              welcoming atmosphere to make everyday meals feel special.
            </p>

            <p className="mt-4 leading-8 text-gray-400">
              Whether you're joining us for a quick bite or a special
              occasion, there's always something delicious waiting for you.
            </p>

            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#F5B942] px-6 py-3 font-bold text-black transition hover:bg-[#ffd36b]"
            >
              Discover Savora →
            </Link>
          </div>
        </div>
      </section>

      {/* POPULAR MENU */}
      <section className="bg-[#171717] px-5 py-20 sm:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            subtitle="Handpicked for you"
            title="Popular Menu"
          />

          {menuLoading ? (
            <LoadingMessage text="Loading menu items..." />
          ) : menuError ? (
            <ErrorMessage message={menuError} />
          ) : menuItems.length === 0 ? (
            <EmptyMessage text="No menu items available yet. Please check back soon." />
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {menuItems.slice(0, 6).map((item, index) => (
                <SimpleFoodCard
                  key={item.id ?? item.menuItemId ?? index}
                  item={item}
                />
              ))}
            </div>
          )}

          <div className="mt-11 text-center">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-[#F5B942] px-7 py-3.5 font-bold text-black transition hover:bg-[#ffd36b]"
            >
              View Full Menu →
            </Link>
          </div>
        </div>
      </section>

      {/* RESERVATION CALL TO ACTION */}
      <section className="bg-[#111111] px-5 pb-20 sm:px-8 md:pb-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#F5B942] px-6 py-12 text-center text-black sm:px-12 md:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.3em]">
            Your Table Is Waiting
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl font-serif text-3xl font-bold sm:text-4xl md:text-5xl">
            Ready for an unforgettable meal?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-black/75">
            Bring your favourite people. We'll take care of the flavours.
          </p>

          <Link
            to="/reservation"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 font-bold text-white transition hover:bg-neutral-800"
          >
            Reserve Your Table →
          </Link>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="px-4 py-7 text-center sm:px-6">
      <div className="mb-3 text-3xl" aria-hidden="true">
        {icon}
      </div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-1 text-xs text-gray-400 sm:text-sm">
        {description}
      </p>
    </div>
  );
}

function CategoryCard({ category }) {
  const title =
    category.name ??
    category.categoryName ??
    category.title ??
    "Category";

  const image = getImage(
    category.imageUrl ??
    category.imageURL ??
    category.image ??
    category.photoUrl
  );

  return (
    <Link
      to={`/menu?category=${encodeURIComponent(title)}`}
      className="group relative block h-64 overflow-hidden rounded-2xl bg-neutral-200 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:h-72"
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = FALLBACK_IMAGE;
        }}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <h3 className="text-xl font-bold sm:text-2xl">{title}</h3>
        <p className="mt-1 text-sm text-gray-200">
          Discover the flavour →
        </p>
      </div>
    </Link>
  );
}

function SimpleFoodCard({ item }) {
  const name =
    item.name ??
    item.itemName ??
    item.title ??
    "Menu Item";

  const image = getImage(
    item.imageUrl ??
    item.imageURL ??
    item.image ??
    item.photoUrl
  );

  const rawPrice = item.price ?? item.itemPrice ?? item.cost;
  const price = Number(rawPrice);

  const description =
    item.description ??
    item.details ??
    "Freshly prepared just for you.";

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#202020] transition duration-300 hover:-translate-y-1 hover:border-[#F5B942]/50 hover:shadow-xl hover:shadow-black/20">
      <div className="relative h-56 overflow-hidden bg-neutral-800">
        <img
          src={image}
          alt={name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_IMAGE;
          }}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-[#F5B942] backdrop-blur">
          Savora Special
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-white">{name}</h3>

          <span className="shrink-0 font-bold text-[#F5B942]">
            {Number.isFinite(price) && rawPrice != null
              ? `₹${price.toFixed(2)}`
              : "Ask for price"}
          </span>
        </div>

        <p className="mt-2 min-h-10 line-clamp-2 text-sm leading-6 text-gray-400">
          {description}
        </p>

        <Link
          to="/menu"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5B942] py-3 font-bold text-black transition hover:bg-[#ffd36b]"
        >
          View Menu →
        </Link>
      </div>
    </article>
  );
}

function LoadingMessage({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center text-gray-400">
      <span className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <p>{text}</p>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="my-8 rounded-xl border border-red-400/30 bg-red-500/10 px-5 py-6 text-center text-red-300">
      <p className="font-semibold">Something went wrong</p>
      <p className="mt-2 text-sm">{message}</p>
      <p className="mt-2 text-xs">
        Check that Spring Boot is running and the API URL matches your controller.
      </p>
    </div>
  );
}

function EmptyMessage({ text }) {
  return (
    <p className="my-8 rounded-xl border border-black/10 bg-white/50 px-5 py-10 text-center text-gray-600">
      {text}
    </p>
  );
}

export default Home;
