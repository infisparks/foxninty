'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ref, get, push } from 'firebase/database'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Gift, ArrowLeft, X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { database } from '@/lib/firebaseClient'

interface Gift {
  image: string
  name: string
  value: number
}

interface Review {
  id: string
  user: string
  rating: number
  comment: string
  date: string
}

interface Product {
  id: string
  bulletPoints: string[]
  category: string
  description: string
  gift?: Gift
  images: string[]
  isNew: boolean
  name: string
  numReviewsToShow: number
  price: number
  warranty: string
  reviews?: Review[]
}

interface ProductDetailProps {
  params: {
    id: string
  }
}

export default function ProductDetail({ params }: ProductDetailProps) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isGiftModalOpen, setIsGiftModalOpen] = useState<boolean>(false)
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState<boolean>(false)
  const [isReviewFormOpen, setIsReviewFormOpen] = useState<boolean>(false)
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [randomReviews, setRandomReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState<Omit<Review, 'id' | 'date'>>({
    user: '',
    rating: 5,
    comment: ''
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = ref(database, `products/${params.id}`)
        const snapshot = await get(productRef)
        if (snapshot.exists()) {
          const data = snapshot.val()
          const loadedProduct: Product = {
            id: params.id,
            ...data,
            reviews: data.reviews ? Object.values(data.reviews) : [],
          }
          setProduct(loadedProduct)
          if (loadedProduct.reviews && loadedProduct.reviews.length > 0) {
            const shuffled = loadedProduct.reviews.sort(() => 0.5 - Math.random())
            setRandomReviews(shuffled.slice(0, 3))
          }
        } else {
          setError("Product not found.")
        }
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product details.")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  useEffect(() => {
    let shineInterval: NodeJS.Timeout
    if (product) {
      shineInterval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length)
      }, 2000)
    }
    return () => clearInterval(shineInterval)
  }, [product])

  const handlePurchase = () => {
    if (!product) return

    const phoneNumber = "9958399157"
    const message = `Hello, I would like to purchase the following watch:

*Name:* ${product.name}
*Price:* $${product.price.toLocaleString()}
*Description:* ${product.description}
*Warranty:* ${product.warranty}

Please let me know the next steps. Thank you!`

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappURL, '_blank')
  }

  const handleNextImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length)
    }
  }

  const handlePrevImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length)
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    const newReviewData: Review = {
      ...newReview,
      id: Date.now().toString(),
      date: new Date().toISOString()
    }

    try {
      const reviewsRef = ref(database, `products/${product.id}/reviews`)
      await push(reviewsRef, newReviewData)

      // Update local state
      setProduct(prevProduct => ({
        ...prevProduct!,
        reviews: [...(prevProduct!.reviews || []), newReviewData]
      }))

      // Reset form and close modal
      setNewReview({ user: '', rating: 5, comment: '' })
      setIsReviewFormOpen(false)

      // Update random reviews
      setRandomReviews(prevReviews => {
        const updatedReviews = [...prevReviews, newReviewData]
        return updatedReviews.sort(() => 0.5 - Math.random()).slice(0, 3)
      })
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Failed to submit review. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p className="text-red-500 text-xl mb-4">{error || "Product not found."}</p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Go Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
      >
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </button>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-64 w-full md:w-96 md:h-96 relative overflow-hidden"
              >
                <Image
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                />
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="shine-effect"></div>
                </div>
              </motion.div>
              {product.images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-2">
                  <button
                    onClick={handlePrevImage}
                    className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
            <div className="p-8 flex flex-col flex-grow">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold flex items-center">
                <CheckCircle className="w-5 h-5 mr-1" />
                {product.category}
              </div>
              <h1 className="mt-1 text-4xl font-extrabold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <p className="mt-2 text-gray-600 flex-grow">{product.description || 'No description available'}</p>

              {/* Bullet Points */}
              {product.bulletPoints && product.bulletPoints.length > 0 && (
                <ul className="mt-4 list-disc list-inside text-gray-700">
                  {product.bulletPoints.map((point, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-indigo-500 mr-2" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}

              {/* Warranty */}
              {product.warranty && (
                <div className="mt-4 text-gray-700 flex items-center">
                  <CheckCircle className="w-5 h-5 text-indigo-500 mr-2" />
                  <strong>Warranty:</strong> {product.warranty}
                </div>
              )}

              {/* Ratings */}
              <div className="mt-4 flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor((product.numReviewsToShow || 0) / 20)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.numReviewsToShow} Reviews
                </span>
              </div>

              {/* Price and New Arrival Badge */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toLocaleString()}
                </span>
                {product.isNew && (
                  <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    New Arrival
                  </span>
                )}
              </div>

              {/* Purchase Watch Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handlePurchase}
                className="mt-8 w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition duration-300 flex items-center justify-center"
              >
                <Gift className="w-5 h-5 mr-2" />
                Purchase Watch
              </motion.button>

              {/* Add to Cart Confirmation Removed */}
              {/* The "Add to Cart" related states and UI have been removed as per the new functionality */}
              
              {/* View Gift Button */}
              {product.gift && product.gift.name && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <button
                    onClick={() => setIsGiftModalOpen(true)}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition duration-300 flex items-center justify-center"
                  >
                    <Gift className="w-5 h-5 mr-2" />
                    View Gift
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Features Section */}
          {product.bulletPoints && product.bulletPoints.length > 0 && (
            <div className="px-8 py-6 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-indigo-500 mr-2" />
                Features
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.bulletPoints.map((point, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-indigo-500" />
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviews Section */}
          <div className="px-8 py-6 bg-gray-50">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-6 h-6 text-yellow-400 mr-2" />
              Customer Reviews
            </h2>
            {product.reviews && product.reviews.length > 0 ? (
              <>
                <div className="space-y-4">
                  {randomReviews.map((review) => (
                    <div key={review.id} className="p-4 bg-white rounded-md shadow">
                      <div className="flex items-center mb-2">
                        <strong className="text-gray-800">{review.user}</strong>
                        <span className="ml-2 text-yellow-400 flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
                {product.reviews.length > 3 && (
                  <button
                    onClick={() => setIsReviewsModalOpen(true)}
                    className="mt-4 text-indigo-600 hover:underline flex items-center"
                  >
                    View All Reviews
                    <ArrowLeft className="w-4 h-4 ml-1 transform rotate-180" />
                  </button>
                )}
              </>
            ) : (
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            )}
            <button
              onClick={() => setIsReviewFormOpen(true)}
              className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 flex items-center"
            >
              <Star className="w-5 h-5 mr-2" />
              Write a Review
            </button>
          </div>
        </div>
      </motion.div>

      {/* Gift Modal */}
      <AnimatePresence>
        {isGiftModalOpen && product.gift && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGiftModalOpen(false)}
            ></motion.div>
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
                <button
                  onClick={() => setIsGiftModalOpen(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                  <Gift className="w-6 h-6 text-purple-600 mr-2" />
                  Free Gift
                </h3>
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={product.gift.image}
                    alt={product.gift.name}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="rounded-md"
                  />
                </div>
                <p className="text-lg font-medium">{product.gift.name}</p>
                <p className="text-gray-600">Value: ${product.gift.value.toLocaleString()}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reviews Modal */}
      <AnimatePresence>
        {isReviewsModalOpen && product.reviews && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewsModalOpen(false)}
            ></motion.div>
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 overflow-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
                <button
                  onClick={() => setIsReviewsModalOpen(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                  <Star className="w-6 h-6 text-yellow-400 mr-2" />
                  All Reviews
                </h3>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-gray-50 rounded-md">
                      <div className="flex items-center mb-2">
                        <strong className="text-gray-800">{review.user}</strong>
                        <span className="ml-2 text-yellow-400 flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Review Form Modal */}
      <AnimatePresence>
        {isReviewFormOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewFormOpen(false)}
            ></motion.div>
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
                <button
                  onClick={() => setIsReviewFormOpen(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                  <Star className="w-6 h-6 text-yellow-400 mr-2" />
                  Write a Review
                </h3>
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-4">
                    <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="user"
                      name="user"
                      value={newReview.user}
                      onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                      Rating
                    </label>
                    <select
                      id="rating"
                      name="rating"
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} Star{rating !== 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                      Your Review
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows={4}
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
    </div>
  )
}
