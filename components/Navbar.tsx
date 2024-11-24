"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Watch,
  ShoppingCart,
  Search,
  User,
  Home,
  Tag,
  Smartphone,
  Clock,
} from "lucide-react";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* Top navigation */}
      <nav className="bg-white shadow-md fixed w-full z-50 top-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Search button (mobile only) */}
            <div className="md:hidden">
              <button
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-6 w-6" />
              </button>
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Watch className="h-8 w-8 text-gray-900" />
              <span className="text-xl font-bold ml-2">Chrono Elite</span>
            </Link>

            {/* Links (desktop) */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/category/luxury" className="text-gray-700 hover:text-gray-900">
                Luxury
              </Link>
              <Link href="/category/sport" className="text-gray-700 hover:text-gray-900">
                Sport
              </Link>
              <Link href="/category/smart" className="text-gray-700 hover:text-gray-900">
                Smart
              </Link>
              <Link href="/category/vintage" className="text-gray-700 hover:text-gray-900">
                Vintage
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Link href="/account" className="p-2 text-gray-400 hover:text-gray-500">
                <User className="h-6 w-6" />
              </Link>
              <Link href="/cart" className="p-2 text-gray-400 hover:text-gray-500 relative">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  2
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay (mobile only) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white p-4">
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="flex-grow p-2 border rounded-md"
            />
            <button
              className="ml-2 p-2 rounded-md text-gray-400 hover:text-gray-500"
              onClick={() => setIsSearchOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <div className="fixed-bottom-nav bg-white border-t md:hidden">
        <div className="flex justify-around py-2">
          <Link
            href="/"
            className="flex flex-col items-center text-gray-600 hover:text-gray-900"
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            href="/categories"
            className="flex flex-col items-center text-gray-600 hover:text-gray-900"
          >
            <Tag className="h-6 w-6" />
            <span className="text-xs mt-1">Categories</span>
          </Link>
          <Link
            href="/smart-watches"
            className="flex flex-col items-center text-gray-600 hover:text-gray-900"
          >
            <Smartphone className="h-6 w-6" />
            <span className="text-xs mt-1">Smart</span>
          </Link>
          <Link
            href="/vintage-watches"
            className="flex flex-col items-center text-gray-600 hover:text-gray-900"
          >
            <Clock className="h-6 w-6" />
            <span className="text-xs mt-1">Vintage</span>
          </Link>
        </div>
      </div>
    </>
  );
}
