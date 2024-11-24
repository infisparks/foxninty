"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const brands = [
  {
    name: "Rolex",
    logo: "/images/rolex-logo.png",
    image: "https://images.unsplash.com/photo-1627037558426-c2d07beda3af?auto=format&fit=crop&q=80",
    description: "The crown of luxury timepieces",
    models: ["Submariner", "Daytona", "GMT-Master II"],
    year: "Est. 1905"
  },
  {
    name: "Hublot",
    logo: "/images/hublot-logo.png",
    image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80",
    description: "Bold innovation meets luxury",
    models: ["Big Bang", "Classic Fusion", "Spirit of Big Bang"],
    year: "Est. 1980"
  },
  {
    name: "Patek Philippe",
    logo: "/images/patek-philippe-logo.png",
    image: "https://images.unsplash.com/photo-1623998022290-a74f8cc36563?auto=format&fit=crop&q=80",
    description: "Timeless excellence since 1839",
    models: ["Nautilus", "Calatrava", "Grand Complications"],
    year: "Est. 1839"
  },
  {
    name: "Audemars Piguet",
    logo: "/images/audemars-piguet-logo.png",
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80",
    description: "Masters of haute horlogerie",
    models: ["Royal Oak", "Code 11.59", "Royal Oak Offshore"],
    year: "Est. 1875"
  }
];

export default function BrandShowcase() {
  const [currentBrand, setCurrentBrand] = useState(0);
  const [ref] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const nextBrand = () => {
    setCurrentBrand((prev) => (prev + 1) % brands.length);
  };

  const prevBrand = () => {
    setCurrentBrand((prev) => (prev - 1 + brands.length) % brands.length);
  };

  return (
    <section className="py-16 bg-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Prestigious Brands</h2>
        
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBrand}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={brands[currentBrand].image}
                  alt={brands[currentBrand].name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 relative">
                    <Image
                      src={brands[currentBrand].logo}
                      alt={`${brands[currentBrand].name} logo`}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{brands[currentBrand].name}</h3>
                    <p className="text-gray-600">{brands[currentBrand].year}</p>
                  </div>
                </div>
                <p className="text-lg text-gray-700">{brands[currentBrand].description}</p>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Signature Models:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {brands[currentBrand].models.map((model) => (
                      <li key={model} className="text-gray-700">{model}</li>
                    ))}
                  </ul>
                </div>
                <button className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors">
                  Explore Collection
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prevBrand}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Previous brand"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextBrand}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Next brand"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {brands.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBrand(index)}
              className={`w-3 h-3 rounded-full ${
                currentBrand === index ? 'bg-gray-800' : 'bg-gray-300'
              }`}
              aria-label={`Go to brand ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

