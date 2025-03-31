"use client";

import Image from "next/image";

export default function Service() {
  const products = [
    {
      name: "Product 1",
      description: "This is a short description of Product 1.",
      image: "/images/product-1.jpg", // Replace with your product images
    },
    {
      name: "Product 2",
      description: "This is a short description of Product 2.",
      image: "/images/product-2.jpg", // Replace with your product images
    },
    {
      name: "Product 3",
      description: "This is a short description of Product 3.",
      image: "/images/product-3.jpg", // Replace with your product images
    },
    {
      name: "Product 4",
      description: "This is a short description of Product 4.",
      image: "/images/product-4.jpg", // Replace with your product images
    },
    {
      name: "Product 5",
      description: "This is a short description of Product 5.",
      image: "/images/product-5.jpg", // Replace with your product images
    },
    {
      name: "Product 6",
      description: "This is a short description of Product 6.",
      image: "/images/product-6.jpg", // Replace with your product images
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Discover Our <span className="text-blue-600">Products</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="mx-auto mb-4 rounded-lg"
                />
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}