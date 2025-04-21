import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen text-black md:p-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 mt-12">About Buddhima Gems</h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          At <span className="text-yellow-400 font-semibold">Buddhima Gems</span>, we specialize in sourcing, crafting, and offering
          high-quality precious and semi-precious gemstones. With a deep passion for
          natural beauty and elegance, our mission is to deliver authenticity,
          transparency, and excellence to gem lovers around the world.
        </p>
        <div className="bg-blue-500 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-white">Our Vision</h2>
          <p className="text-gray-300 mb-6">
            To become a globally trusted brand for ethically sourced and expertly crafted gems,
            bridging tradition with modern craftsmanship.
          </p>
          <h2 className="text-2xl font-semibold mb-4 text-white">Why Choose Us?</h2>
          <ul className="list-disc list-inside text-left space-y-2 text-gray-300">
            <li>100% Authentic and Certified Gems</li>
            <li>Personalized Customer Experience</li>
            <li>Custom Jewelry Orders</li>
            <li>Worldwide Shipping</li>
            <li>Trusted by Clients Globally</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
