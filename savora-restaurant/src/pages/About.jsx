import {
  ChefHat,
  Leaf,
  Heart,
  Users,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionTitle from "../components/SectionTitle";

const chefs = [
  {
    name: "John Smith",
    role: "Head Chef",
    image: "/images/chef1.jpeg",
  },
  {
    name: "Emily Carter",
    role: "Pastry Chef",
    image: "/images/chef2.jpeg",
  },
  {
    name: "Michael Brown",
    role: "Sous Chef",
    image: "/images/chef3.jpeg",
  },
  {
    name: "Sarah Wilson",
    role: "Specialty Chef",
    image: "/images/chef1.jpeg",
  },
];

function About() {
  return (
    <div className="bg-[#111111] text-white">

      <Navbar />

      <section className="px-5 pb-20 pt-32">

        <div className="mx-auto max-w-7xl">

          <div className="mb-14 text-center">
            <p className="uppercase tracking-[4px] text-[#F5B942]">
              Our Story
            </p>

            <h1 className="mt-3 font-serif text-5xl font-bold">
              About Us
            </h1>
          </div>

          {/* STORY */}
          <div className="grid items-center gap-10 md:grid-cols-2">

            <img
              src="/images/restaurant.jpeg"
              alt="Restaurant"
              className="h-[500px] w-full rounded-3xl object-cover"
            />

            <div>

              <p className="mb-3 text-[#F5B942]">
                Since 2015
              </p>

              <h2 className="font-serif text-4xl font-bold">
                Good Food.
                <span className="block text-[#F5B942]">
                  Good People.
                </span>
              </h2>

              <p className="mt-6 leading-8 text-gray-400">
                Savora was founded with a simple mission:
                to serve delicious food made with fresh
                ingredients and to create memorable dining
                experiences.
              </p>

              <p className="mt-4 leading-8 text-gray-400">
                From our kitchen to your table, every dish
                is prepared with care and passion.
              </p>

            </div>

          </div>

          {/* FEATURES */}
          <div className="mt-20 grid gap-5 md:grid-cols-4">

            {[
              [Leaf, "Fresh Ingredients"],
              [ChefHat, "Expert Chefs"],
              [Heart, "Unique Recipes"],
              [Users, "Friendly Staff"],
            ].map(([Icon, title]) => (

              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-[#181818] p-7 text-center"
              >

                <Icon
                  className="mx-auto mb-4 text-[#F5B942]"
                  size={35}
                />

                <h3 className="font-semibold">
                  {title}
                </h3>

              </div>

            ))}

          </div>

          {/* CHEFS */}
          <div className="mt-24">

            <SectionTitle
              subtitle="Meet Our Team"
              title="Our Chefs"
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

              {chefs.map((chef) => (

                <div
                  key={chef.name}
                  className="text-center"
                >

                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="mx-auto h-48 w-48 rounded-full object-cover ring-4 ring-[#F5B942]/30"
                  />

                  <h3 className="mt-5 text-lg font-semibold">
                    {chef.name}
                  </h3>

                  <p className="text-sm text-[#F5B942]">
                    {chef.role}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </div>
  );
}

export default About;