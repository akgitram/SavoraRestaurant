import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#090909]">

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4">

        {/* BRAND */}
        <div>
          <h2 className="mb-4 text-2xl font-bold text-white">
            SAVORA
          </h2>

          <p className="text-sm leading-7 text-gray-400">
            Fresh ingredients, authentic flavors and
            unforgettable dining experiences.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="mb-4 font-semibold text-[#F5B942]">
            Quick Links
          </h3>

          <div className="flex flex-col gap-3 text-sm text-gray-400">

            <Link
              to="/"
              className="transition hover:text-[#F5B942]"
            >
              Home
            </Link>

            <Link
              to="/menu"
              className="transition hover:text-[#F5B942]"
            >
              Menu
            </Link>

            <Link
              to="/about"
              className="transition hover:text-[#F5B942]"
            >
              About
            </Link>

            <Link
              to="/gallery"
              className="transition hover:text-[#F5B942]"
            >
              Gallery
            </Link>

            <Link
              to="/reservation"
              className="transition hover:text-[#F5B942]"
            >
              Reservation
            </Link>

          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="mb-4 font-semibold text-[#F5B942]">
            Contact
          </h3>

          <div className="space-y-4 text-sm text-gray-400">

            <div className="flex items-center gap-3">
              <MapPin
                size={18}
                className="text-[#F5B942]"
              />

              <span>
                123 Food Street
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Phone
                size={18}
                className="text-[#F5B942]"
              />

              <span>
                +1 234 567 890
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Mail
                size={18}
                className="text-[#F5B942]"
              />

              <span>
                info@savora.com
              </span>
            </div>

          </div>
        </div>

        {/* SOCIAL MEDIA */}
        <div>

          <h3 className="mb-4 font-semibold text-[#F5B942]">
            Follow Us
          </h3>

          <div className="flex gap-3">

            {/* Instagram */}
            <a
              href="#"
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-full
                border border-white/10
                text-sm font-bold
                transition
                hover:border-[#F5B942]
                hover:text-[#F5B942]
              "
            >
              IG
            </a>

            {/* Facebook */}
            <a
              href="#"
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-full
                border border-white/10
                text-sm font-bold
                transition
                hover:border-[#F5B942]
                hover:text-[#F5B942]
              "
            >
              f
            </a>

            {/* X */}
            <a
              href="#"
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-full
                border border-white/10
                text-sm font-bold
                transition
                hover:border-[#F5B942]
                hover:text-[#F5B942]
              "
            >
              𝕏
            </a>

          </div>

          <p className="mt-5 text-sm leading-6 text-gray-500">
            Follow us for delicious food,
            special offers and restaurant updates.
          </p>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10 py-5 text-center text-sm text-gray-500">
        © 2026 SAVORA. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;