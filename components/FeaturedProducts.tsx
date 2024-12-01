// components/FeaturedProducts.tsx

"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion} from 'framer-motion';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { ref, onValue} from 'firebase/database';
import { useRouter } from 'next/navigation';
import { database } from '@/lib/firebaseClient';

interface Gift {
  image: string;
  name: string;
  value: number;
}

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface Product {
  id: string;
  bulletPoints: string[];
  category: string;
  description: string;
  gift?: Gift;
  images: string[];
  isNew: boolean;
  name: string;
  numReviewsToShow: number;
  price: number;
  warranty: string;
  reviews?: Review[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  previewImage: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, previewImage }) => {

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
    >
      <div className="relative h-64 w-full">
        <Image
          src={previewImage}
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 transform hover:scale-110"
        />
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="shine-effect"></div>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
    <div className=''>
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold flex items-center">
          <CheckCircle className="w-5 h-5 mr-1" />
          {product.category}
        </div>
        <h3 className="mt-2 text-xl font-bold text-gray-900">{product.name}</h3>

    </div>
        {/* <p className="mt-2 text-gray-600 flex-grow">{product.description}</p> */}
        
        {/* Ratings */}
        {/* <div className="mt-4 flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-gray-600">({product.numReviewsToShow} Reviews)</span>
        </div> */}

        {/* Price */}
        <div className="1">
          <span className="text-2xl font-bold text-gray-600">${product.price.toLocaleString()}</span>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddToCart(product)}
          className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const productsRef = ref(database, 'products/');
    const unsubscribe = onValue(
      productsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const loadedProducts: Product[] = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setProducts(loadedProducts);
        } else {
          setProducts([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching products:", error);
        setError("Failed to load products.");
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleAddToCart = (product: Product) => {
    // Navigate to the product detail page
    router.push(`/product/${product.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-indigo-500 mr-2" />
          Featured Timepieces
        </h2>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                previewImage={product.images[0]} // Pass the first image as preview
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No featured products available.</p>
        )}
      </div>

      {/* Shine Effect Styles */}
      <style jsx>{`
        .shine-effect {
          position: absolute;
          top: 0;
          left: -150%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          animation: shine 2s infinite;
        }

        @keyframes shine {
          0% {
            left: -150%;
          }
          50% {
            left: 100%;
          }
          100% {
            left: 150%;
          }
        }
      `}</style>
    </section>
  );
}
