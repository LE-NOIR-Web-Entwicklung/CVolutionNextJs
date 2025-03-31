"use client"

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const slides = [
    {
      title: "Welcome to Our Store",
      description: "Discover the best products and meet our amazing team.",
      image: "/images/hero-bg.jpg", // Replace with your image path
    },
    {
      title: "Quality Products",
      description: "We offer the highest quality products for your needs.",
      image: "/images/hero-bg-2.jpg", // Replace with your image path
    },
    {
      title: "Join Our Team",
      description: "Be part of our amazing journey and grow with us.",
      image: "/images/hero-bg-3.jpg", // Replace with your image path
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-blue-950 text-white">
        <Image
          src={slides[currentSlide].image}
          alt={slides[currentSlide].title}
          layout="fill"
          objectFit="cover"
          className="opacity-50"
        />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">
            {slides[currentSlide].title}
          </h1>
          <p className="text-lg sm:text-xl">{slides[currentSlide].description}</p>
        </div>
        {/* Slider Controls */}
        <div>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white text-blue-950 p-2 rounded-full shadow hover:bg-gray-200 ml-4"
          >
            &#8249;
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-blue-950 p-2 rounded-full shadow hover:bg-gray-200"
          >
            &#8250;
          </button>
        </div>
        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-gray-400"
              }`}
            ></div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our <span className="text-blue-600">Products</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
              >
                <Image
                  src={`/images/product-${index + 1}.jpg`} // Replace with your product images
                  alt={`Product ${index + 1}`}
                  width={200}
                  height={200}
                  className="mx-auto mb-4"
                />
                <h3 className="text-xl font-bold mb-2">Product {index + 1}</h3>
                <p className="text-gray-600">
                  This is a short description of product {index + 1}.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-[#0a396b] bg-opacity-90">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Meet Our <span className="text-blue-300">Team</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {[
              {
                name: "Armend Mustafa",
                position: "CEO / Managing Partner",
                image: "/images/team-1.jpg",
              },
              {
                name: "Jan Eggenberger",
                position: "Software Engineer",
                image: "/images/team-2.jpg",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-gray-100 p-6 rounded-lg shadow-lg text-center"
              >
                <Image
                  src={member.image} // Replace with your team images
                  alt={member.name}
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.position}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a396b] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} - All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}