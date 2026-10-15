import { useState } from "react";
import axios from "axios";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/contect",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(
        typeof response.data === "string"
          ? response.data
          : response.data?.message || "Your message has been sent successfully!"
      );

      setFormData({
        fullName: "",
        email: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact form error:", err);

      setError(
        err.response?.data?.message ||
          (typeof err.response?.data === "string"
            ? err.response.data
            : "Unable to send your message. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <Navbar />

      <main className="px-5 pb-20 pt-32">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <p className="uppercase tracking-[4px] text-[#F5B942]">
              Get In Touch
            </p>

            <h1 className="mt-3 font-serif text-5xl font-bold">
              Contact Us
            </h1>

            <p className="mt-4 text-gray-400">
              We'd love to hear from you.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact Information */}
            <div className="space-y-4">
              {[
                [MapPin, "Our Location", "123 Food Street, Bangluru"],
                [Phone, "Call Us", "+91 9450280144"],
                [Mail, "Email Us", "info@savora.com"],
                [Clock, "Opening Hours", "Mon - Sun, 10:00 AM - 11:00 PM"],
              ].map(([Icon, title, text]) => (
                <div
                  key={title}
                  className="flex gap-5 rounded-2xl border border-white/10 bg-[#181818] p-6"
                >
                  <div className="shrink-0 rounded-full bg-[#F5B942]/10 p-4">
                    <Icon className="text-[#F5B942]" />
                  </div>

                  <div>
                    <h3 className="font-semibold">{title}</h3>

                    <p className="mt-1 text-sm text-gray-400">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl border border-white/10 bg-[#181818] p-7">
              <h2 className="font-serif text-3xl font-bold">
                Send Us a Message
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Fill in the details below and send us your message.
              </p>

              {/* Success Message */}
              {success && (
                <div
                  role="status"
                  className="mt-5 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400"
                >
                  {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div
                  role="alert"
                  className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm text-gray-300"
                  >
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    maxLength={100}
                    required
                    className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-[#F5B942]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm text-gray-300"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    maxLength={254}
                    required
                    className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-[#F5B942]"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm text-gray-300"
                  >
                    Your Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    maxLength={2000}
                    placeholder="Write your message..."
                    required
                    className="w-full resize-y rounded-lg border border-white/10 bg-[#111111] px-4 py-3 outline-none transition focus:border-[#F5B942]"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#F5B942] py-3 font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}

export default Contact;