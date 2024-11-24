'use client'

import { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, X, Gift } from 'lucide-react';
import GiftModal from '@/components/GiftModal';

type Gift = {
  name: string;
  value: number;
  image: string;
};

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  gift?: Gift;
};

const cartItems: CartItem[] = [
  {
    id: 1,
    name: "Royal Oak Chronograph",
    price: 45000,
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80",
    quantity: 1,
    gift: {
      name: "Premium AirPods Pro",
      value: 249,
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&q=80",
    },
  },
  {
    id: 2,
    name: "Seamaster Professional",
    price: 6500,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80",
    quantity: 1,
    gift: {
      name: "Limited Edition T-Shirt",
      value: 99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80",
    },
  },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(cartItems);
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  const updateQuantity = (id: number, newQuantity: number) => {
    setItems(items.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const openGiftModal = (gift: Gift) => {
    setSelectedGift(gift);
    setGiftModalOpen(true);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 50; // Example shipping cost
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center border-b py-4">
              <div className="w-24 h-24 relative flex-shrink-0">
                <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" className="rounded-md" />
              </div>
              <div className="ml-4 flex-grow">
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-600">${item.price.toLocaleString()}</p>
                {item.gift && (
  <button
    className="text-purple-600 text-sm flex items-center mt-1"
    onClick={() => openGiftModal(item.gift as Gift)}
  >
    <Gift className="w-4 h-4 mr-1" />
    View Gift
  </button>
)}

              </div>
              <div className="flex items-center">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => removeItem(item.id)} className="ml-4 p-1">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
        <div className="lg:w-1/3 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>${shipping.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mt-4">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <button className="w-full bg-black text-white py-3 rounded-lg mt-6 hover:bg-gray-800 transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
      {selectedGift && (
        <GiftModal
          isOpen={giftModalOpen}
          onClose={() => setGiftModalOpen(false)}
          gift={selectedGift}
          productName="Your Watch"
        />
      )}
    </div>
  );
}
