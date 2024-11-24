"use client";

import ProductCard from './ProductCard';
import { Product } from '../types';

const products: Product[] = [
  {
    id: 1,
    name: "Royal Oak Chronograph",
    category: "Luxury",
    price: 45000,
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80",
    gift: {
      name: "Premium AirPods Pro",
      value: 249,
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&q=80"
    }
  },
  {
    id: 2,
    name: "Seamaster Professional",
    category: "Sport",
    price: 6500,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80",
    gift: {
      name: "Limited Edition T-Shirt",
      value: 99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80"
    },
    isNew: true
  },
  {
    id: 3,
    name: "Connected Calibre E4",
    category: "Smart",
    price: 2100,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80",
    gift: {
      name: "Premium Trimmer Set",
      value: 129,
      image: "https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&q=80"
    }
  },
];

export default function FeaturedProducts() {
  const handleAddToCart = (product: Product) => {
    // Implement cart functionality here
    console.log(`Added ${product.name} to cart`);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Timepieces</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
