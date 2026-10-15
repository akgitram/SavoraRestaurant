function SectionTitle({ subtitle, title }) {
  return (
    <div className="mb-12 text-center">
      <p className="mb-2 text-sm uppercase tracking-[4px] text-[#F5B942]">
        {subtitle}
      </p>

      <h2 className="font-serif text-4xl font-bold md:text-5xl">
        {title}
      </h2>

      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#F5B942]" />
    </div>
  );
}

export default SectionTitle;