"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GiftIcon, Eye } from 'lucide-react';
import Image from 'next/image';
import { Product } from '../types';
import ProductBadge from './ProductBadge';
import GiftPreview from './GiftPreview';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isGiftPreviewOpen, setIsGiftPreviewOpen] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden group"
    >
      <div className="relative h-64 overflow-hidden">
        {product.gift && (
          <ProductBadge type="gift" text="Free Gift" />
        )}
        {product.isNew && (
          <ProductBadge type="new" text="New Arrival" />
        )}
        <Image 
          src={product.image} 
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="transform group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <span className="text-sm text-gray-500">{product.category}</span>
        <h3 className="text-lg font-semibold mt-1">{product.name}</h3>
        <p className="text-xl font-bold text-gray-900 mt-2">
          ${product.price.toLocaleString()}
        </p>
        
        {product.gift && (
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2 text-purple-600">
              <GiftIcon className="h-4 w-4" />
              <span className="text-sm">Free {product.gift.name}</span>
            </div>
            <button
              onClick={() => setIsGiftPreviewOpen(true)}
              className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700"
            >
              <Eye className="h-4 w-4" />
              <span>View Gift</span>
            </button>
          </div>
        )}
        
        <button 
          onClick={() => onAddToCart(product)}
          className="w-full mt-4 bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Add to Cart
        </button>
      </div>

      {product.gift && (
        <GiftPreview
          isOpen={isGiftPreviewOpen}
          onClose={() => setIsGiftPreviewOpen(false)}
          gift={product.gift}
          productName={product.name}
        />
      )}
    </motion.div>
  );
}

