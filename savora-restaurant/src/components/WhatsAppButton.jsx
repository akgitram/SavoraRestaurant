function WhatsAppButton() {
  const phoneNumber = "919876543210";

  const message = encodeURIComponent(
    "Hello SAVORA, I would like to know more about your restaurant."
  );

  const whatsappUrl = `https://wa.me/${8355007631}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with SAVORA on WhatsApp"
      className="
        fixed
        bottom-6
        right-6
        z-50
        flex
        items-center
        gap-3
        rounded-full
        bg-[#25D366]
        px-5
        py-3
        font-semibold
        text-white
        shadow-2xl
        transition
        duration-300
        hover:scale-105
        hover:bg-[#20bd5a]
      "
    >
      <span className="text-2xl">💬</span>

      <span className="hidden sm:block">
        Chat with us
      </span>
    </a>
  );
}

export default WhatsAppButton;