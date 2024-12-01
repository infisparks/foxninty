// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { database, storage } from '@/lib/firebaseClient';
import {
  ref as dbRef,
  push,
  onValue,
  remove,
  update,
} from 'firebase/database';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import {
  
  Gift,
  X,
} from 'lucide-react';

interface Gift {
  name: string;
  value: number;
  image: string;
}

interface Review {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  isFake: boolean;
}

interface ProductInput {
  name: string;
  category: string;
  price: number;
  description: string;
  warranty: string;
  images: File[];
  giftName: string;
  giftValue: number;
  giftImageFile: File | null;
  numReviewsToShow: number;
  bulletPoints: string[];
}

interface ProductData {
  name: string;
  category: string;
  price: number;
  description: string;
  warranty: string;
  images: string[];
  gift: Gift;
  isNew?: boolean;
  reviews?: Review[];
  numReviewsToShow: number;
  bulletPoints: string[];
}

interface Product extends ProductData {
  key: string;
}

export default function Admin() {
  const [form, setForm] = useState<ProductInput>({
    name: '',
    category: '',
    price: 0,
    description: '',
    warranty: '',
    images: [],
    giftName: '',
    giftValue: 0,
    giftImageFile: null,
    numReviewsToShow: 5,
    bulletPoints: [],
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingProductKey, setEditingProductKey] = useState<string | null>(null);

  const [reviewForm, setReviewForm] = useState<{
    reviewer: string;
    rating: number;
    comment: string;
    isFake: boolean;
    productKey: string | null;
    reviewId: string | null;
  }>({
    reviewer: '',
    rating: 5,
    comment: '',
    isFake: false,
    productKey: null,
    reviewId: null,
  });

  useEffect(() => {
    const productsRef = dbRef(database, 'products/');
    const unsubscribe = onValue(
      productsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const loadedProducts: Product[] = Object.keys(data).map((key) => ({
            key,
            ...data[key],
            images: Array.isArray(data[key].images) ? data[key].images : [],
            bulletPoints: Array.isArray(data[key].bulletPoints) ? data[key].bulletPoints : [],
            reviews: data[key].reviews
              ? Object.values(data[key].reviews)
              : [],
          }));
          setProducts(loadedProducts);
        } else {
          setProducts([]);
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
        setError('Failed to load products.');
      }
    );

    return () => unsubscribe();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const { name, value, type } = target;

    if (name === 'images') {
      const files = (target as HTMLInputElement).files;
      const fileArray = files ? Array.from(files) : [];
      if (fileArray.length > 4) {
        setError('You can upload a maximum of 4 images.');
      } else {
        setForm({ ...form, images: fileArray });
      }
    } else if (name === 'giftImageFile') {
      const files = (target as HTMLInputElement).files;
      setForm({ ...form, giftImageFile: files ? files[0] : null });
    } else if (name.startsWith('bulletPoint')) {
      const index = parseInt(name.split('_')[1], 10);
      const updatedBulletPoints = [...form.bulletPoints];
      updatedBulletPoints[index] = value;
      setForm({ ...form, bulletPoints: updatedBulletPoints });
    } else if (type === 'checkbox') {
      setForm({ ...form, [name]: (target as HTMLInputElement).checked });
    } else if (name === 'price' || name === 'giftValue' || name === 'numReviewsToShow') {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddBulletPoint = () => {
    if (form.bulletPoints.length >= 10) {
      setError('You can add up to 10 bullet points.');
      return;
    }
    setForm({ ...form, bulletPoints: [...form.bulletPoints, ''] });
  };

  const handleRemoveBulletPoint = (index: number) => {
    const updatedBulletPoints = [...form.bulletPoints];
    updatedBulletPoints.splice(index, 1);
    setForm({ ...form, bulletPoints: updatedBulletPoints });
  };

  const handleReviewChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const { name, value, type } = target;

    if (type === 'checkbox') {
      setReviewForm({ ...reviewForm, [name]: (target as HTMLInputElement).checked });
    } else if (name === 'rating') {
      setReviewForm({ ...reviewForm, [name]: Number(value) });
    } else {
      setReviewForm({ ...reviewForm, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate image upload
    if (!editingProductKey && form.images.length < 1) {
      setError('Please upload at least 1 image.');
      setLoading(false);
      return;
    }
    if (form.images.length > 4) {
      setError('You can upload a maximum of 4 images.');
      setLoading(false);
      return;
    }

    // Validate bullet points
    if (form.bulletPoints.length > 10) {
      setError('You can add up to 10 bullet points.');
      setLoading(false);
      return;
    }

    try {
      let imageURLs: string[] = [];
      let giftImageURL = '';

      if (form.images.length > 0) {
        const uploadPromises = form.images.map(async (imageFile) => {
          const imageStorageRef = storageRef(
            storage,
            `products/${Date.now()}_${imageFile.name}`
          );
          await uploadBytes(imageStorageRef, imageFile);
          const url = await getDownloadURL(imageStorageRef);
          return url;
        });
        imageURLs = await Promise.all(uploadPromises);
      }

      if (form.giftImageFile) {
        const giftImageStorageRef = storageRef(
          storage,
          `gifts/${Date.now()}_${form.giftImageFile.name}`
        );
        await uploadBytes(giftImageStorageRef, form.giftImageFile);
        giftImageURL = await getDownloadURL(giftImageStorageRef);
      }

      if (editingProductKey) {
        const currentProduct = products.find(
          (p) => p.key === editingProductKey
        );
        if (!currentProduct) throw new Error('Product not found');

        const updates: Partial<ProductData> = {
          name: form.name,
          category: form.category,
          price: form.price,
          description: form.description,
          warranty: form.warranty,
          numReviewsToShow: form.numReviewsToShow,
          gift: {
            name: form.giftName,
            value: form.giftValue,
            image: giftImageURL || currentProduct.gift.image || '',
          },
          bulletPoints: form.bulletPoints,
        };

        if (imageURLs.length > 0) {
          if (currentProduct.images) {
            const deletePromises = currentProduct.images.map(async (imageUrl) => {
              const oldImageRef = storageRef(storage, imageUrl);
              await deleteObject(oldImageRef).catch((err) => {
                console.warn(`Failed to delete old product image: ${err}`);
              });
            });
            await Promise.all(deletePromises);
          }
          updates.images = imageURLs;
        }

        await update(dbRef(database, `products/${editingProductKey}`), updates);

        setSuccess('Product updated successfully!');
      } else {
        const newProduct: ProductData = {
          name: form.name,
          category: form.category,
          price: form.price,
          description: form.description,
          warranty: form.warranty,
          images: imageURLs,
          gift: {
            name: form.giftName,
            value: form.giftValue,
            image: giftImageURL,
          },
          isNew: false,
          reviews: [],
          numReviewsToShow: form.numReviewsToShow,
          bulletPoints: form.bulletPoints,
        };

        await push(dbRef(database, 'products/'), newProduct);

        setSuccess('Product added successfully!');
      }

      setForm({
        name: '',
        category: '',
        price: 0,
        description: '',
        warranty: '',
        images: [],
        giftName: '',
        giftValue: 0,
        giftImageFile: null,
        numReviewsToShow: 5,
        bulletPoints: [],
      });
      setEditingProductKey(null);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (
    key: string,
    images: string[],
    giftImageUrl: string
  ) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (images && images.length > 0) {
        const deletePromises = images.map(async (imageUrl) => {
          const imageRef = storageRef(storage, imageUrl);
          await deleteObject(imageRef).catch((err) => {
            console.warn(`Failed to delete product image: ${err}`);
          });
        });
        await Promise.all(deletePromises);
      }

      if (giftImageUrl) {
        const giftImageRef = storageRef(storage, giftImageUrl);
        await deleteObject(giftImageRef).catch((err) => {
          console.warn(`Failed to delete gift image: ${err}`);
        });
      }

      await remove(dbRef(database, `products/${key}`));

      setSuccess('Product deleted successfully!');
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name || '',
      category: product.category || '',
      price: product.price || 0,
      description: product.description || '',
      warranty: product.warranty || '',
      images: [],
      giftName: product.gift.name || '',
      giftValue: product.gift.value || 0,
      giftImageFile: null,
      numReviewsToShow: product.numReviewsToShow || 5,
      bulletPoints: product.bulletPoints || [],
    });
    setEditingProductKey(product.key);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.productKey) {
      setError('No product selected for the review.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const productRef = dbRef(
        database,
        `products/${reviewForm.productKey}/reviews`
      );
      const reviewId = reviewForm.reviewId || uuidv4();

      const newReview: Review = {
        id: reviewId,
        reviewer: reviewForm.reviewer,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        isFake: reviewForm.isFake,
      };

      if (reviewForm.reviewId) {
        await update(
          dbRef(
            database,
            `products/${reviewForm.productKey}/reviews/${reviewForm.reviewId}`
          ),
          newReview
        );
        setSuccess('Review updated successfully!');
      } else {
        await push(productRef, newReview);
        setSuccess('Review added successfully!');
      }

      setReviewForm({
        reviewer: '',
        rating: 5,
        comment: '',
        isFake: false,
        productKey: null,
        reviewId: null,
      });
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (productKey: string, reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await remove(
        dbRef(database, `products/${productKey}/reviews/${reviewId}`)
      );
      setSuccess('Review deleted successfully!');
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (productKey: string, review: Review) => {
    setReviewForm({
      reviewer: review.reviewer || '',
      rating: review.rating || 5,
      comment: review.comment || '',
      isFake: review.isFake || false,
      productKey: productKey || null,
      reviewId: review.id || null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        {editingProductKey ? 'Edit Watch' : 'Admin - Add New Watch'}
      </h1>

      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 text-green-500"
        >
          {success}
        </motion.div>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 text-red-500"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="Luxury">Luxury</option>
            <option value="Sport">Sport</option>
            <option value="Smart">Smart</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium">Price (USD)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Warranty */}
        <div>
          <label className="block text-sm font-medium">Warranty</label>
          <input
            type="text"
            name="warranty"
            value={form.warranty}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Number of Reviews to Show */}
        <div>
          <label className="block text-sm font-medium">
            Number of Reviews to Display
          </label>
          <input
            type="number"
            name="numReviewsToShow"
            value={form.numReviewsToShow}
            onChange={handleChange}
            required
            min="1"
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Product Images */}
        <div>
          <label className="block text-sm font-medium">
            {editingProductKey ? 'Change Product Images' : 'Product Images'}
          </label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="mt-1 block w-full"
            required={!editingProductKey}
          />
          <p className="text-sm text-gray-500 mt-1">
            {editingProductKey
              ? 'Upload between 1 and 4 images. Leave blank to keep existing images.'
              : 'Upload 1 to 4 images.'}
          </p>
          {form.images.length > 4 && (
            <p className="text-sm text-red-500 mt-1">
              You can upload a maximum of 4 images.
            </p>
          )}
          {form.images.length < 1 && !editingProductKey && (
            <p className="text-sm text-red-500 mt-1">
              Please upload at least 1 image.
            </p>
          )}
        </div>

        {/* Bullet Points for Watch Specialties */}
        <div>
          <label className="block text-sm font-medium">Watch Specialties (Bullet Points)</label>
          <div className="mt-2 space-y-2">
            {form.bulletPoints.map((point, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="text"
                  name={`bulletPoint_${index}`}
                  value={point}
                  onChange={handleChange}
                  className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Bullet Point ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveBulletPoint(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            {form.bulletPoints.length < 10 && (
              <button
                type="button"
                onClick={handleAddBulletPoint}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
              >
                Add Bullet Point
              </button>
            )}
            {form.bulletPoints.length >= 10 && (
              <p className="text-sm text-red-500 mt-1">
                You can add up to 10 bullet points.
              </p>
            )}
          </div>
        </div>

        {/* Gift Name */}
        <div>
          <label className="block text-sm font-medium">Gift Name</label>
          <input
            type="text"
            name="giftName"
            value={form.giftName}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Gift Value */}
        <div>
          <label className="block text-sm font-medium">Gift Value (USD)</label>
          <input
            type="number"
            name="giftValue"
            value={form.giftValue}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Gift Image */}
        <div>
          <label className="block text-sm font-medium">
            {editingProductKey ? 'Change Gift Image' : 'Gift Image'}
          </label>
          <input
            type="file"
            name="giftImageFile"
            accept="image/*"
            onChange={handleChange}
            className="mt-1 block w-full"
            required={!editingProductKey}
          />
          <p className="text-sm text-gray-500 mt-1">
            {editingProductKey
              ? 'Upload a new gift image or leave blank to keep existing.'
              : 'Upload a gift image.'}
          </p>
        </div>

        {/* Submit Button */}
        <div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded ${
              loading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-700 transition duration-300'
            }`}
          >
            {loading
              ? editingProductKey
                ? 'Updating...'
                : 'Adding...'
              : editingProductKey
              ? 'Update Product'
              : 'Add Product'}
          </motion.button>
        </div>

        {/* Cancel Edit Button */}
        {editingProductKey && (
          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => {
                setEditingProductKey(null);
                setForm({
                  name: '',
                  category: '',
                  price: 0,
                  description: '',
                  warranty: '',
                  images: [],
                  giftName: '',
                  giftValue: 0,
                  giftImageFile: null,
                  numReviewsToShow: 5,
                  bulletPoints: [],
                });
                setError(null);
                setSuccess(null);
              }}
              className="w-full py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700 transition duration-300"
            >
              Cancel Edit
            </motion.button>
          </div>
        )}
      </form>

      {/* Review Form */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Manage Reviews</h2>
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          {/* Select Product for Review */}
          <div>
            <label className="block text-sm font-medium">Select Product</label>
            <select
              name="productKey"
              value={reviewForm.productKey || ''}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  productKey: e.target.value || null,
                })
              }
              required
              className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.key} value={product.key}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reviewer Name */}
          <div>
            <label className="block text-sm font-medium">Reviewer Name</label>
            <input
              type="text"
              name="reviewer"
              value={reviewForm.reviewer}
              onChange={handleReviewChange}
              required
              className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium">Rating</label>
            <select
              name="rating"
              value={reviewForm.rating}
              onChange={handleReviewChange}
              required
              className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>
                  {num} Star{num > 1 && 's'}
                </option>
              ))}
            </select>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium">Comment</label>
            <textarea
              name="comment"
              value={reviewForm.comment}
              onChange={handleReviewChange}
              required
              rows={3}
              className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Is Fake */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isFake"
              checked={reviewForm.isFake}
              onChange={handleReviewChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm">Is Fake</label>
          </div>

          {/* Submit Button */}
          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 bg-purple-600 text-white rounded ${
                loading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-purple-700 transition duration-300'
              }`}
            >
              {loading
                ? reviewForm.reviewId
                  ? 'Updating Review...'
                  : 'Adding Review...'
                : reviewForm.reviewId
                ? 'Update Review'
                : 'Add Review'}
            </motion.button>
          </div>
        </form>
      </div>

      {/* Products Table */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">All Products</h2>

        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Images</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Category</th>
                  <th className="py-2 px-4 border-b">Price (USD)</th>
                  <th className="py-2 px-4 border-b">Description</th>
                  <th className="py-2 px-4 border-b">Warranty</th>
                  <th className="py-2 px-4 border-b">Specialties</th>
                  <th className="py-2 px-4 border-b">Gift</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.key}>
                    <td className="py-2 px-4 border-b">
                      <div className="flex space-x-2">
                        {product.images && product.images.length > 0 ? (
                          product.images.slice(0, 3).map((imageUrl, idx) => (
                            <Image
                              key={idx}
                              src={imageUrl}
                              alt={product.name}
                              width={50}
                              height={50}
                              className="object-cover rounded"
                            />
                          ))
                        ) : (
                          <span className="text-gray-500">No Images</span>
                        )}
                        {product.images && product.images.length > 3 && (
                          <span className="text-sm text-gray-500">
                            +{product.images.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">{product.name || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">{product.category || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">
                      {product.price !== undefined
                        ? `$${product.price.toLocaleString()}`
                        : 'N/A'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {product.description
                        ? product.description.length > 50
                          ? `${product.description.substring(0, 50)}...`
                          : product.description
                        : 'N/A'}
                    </td>
                    <td className="py-2 px-4 border-b">{product.warranty || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">
                      {product.bulletPoints && product.bulletPoints.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {product.bulletPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex items-center space-x-2">
                        {product.gift && product.gift.image ? (
                          <Image
                            src={product.gift.image}
                            alt={product.gift.name}
                            width={50}
                            height={50}
                            className="object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-500">No Gift Image</span>
                        )}
                        <div>
                          <p>{product.gift.name || 'N/A'}</p>
                          <p>
                            {product.gift.value !== undefined
                              ? `$${product.gift.value.toLocaleString()}`
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(product.key, product.images, product.gift.image)
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">All Reviews</h2>
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <div key={product.key} className="mb-8">
              <h3 className="text-xl font-semibold mb-2">{product.name || 'N/A'}</h3>
              {product.reviews && product.reviews.length > 0 ? (
                <table className="min-w-full bg-white mb-4">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Reviewer</th>
                      <th className="py-2 px-4 border-b">Rating</th>
                      <th className="py-2 px-4 border-b">Comment</th>
                      <th className="py-2 px-4 border-b">Is Fake</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.reviews.map((review) => (
                      <tr key={review.id}>
                        <td className="py-2 px-4 border-b">{review.reviewer || 'N/A'}</td>
                        <td className="py-2 px-4 border-b">
                          {review.rating !== undefined
                            ? `${review.rating} Star${review.rating > 1 ? 's' : ''}`
                            : 'N/A'}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {review.comment
                            ? review.comment.length > 50
                              ? `${review.comment.substring(0, 50)}...`
                              : review.comment
                            : 'N/A'}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {review.isFake ? 'Yes' : 'No'}
                        </td>
                        <td className="py-2 px-4 border-b space-x-2">
                          <button
                            onClick={() => handleEditReview(product.key, review)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition duration-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(product.key, review.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No reviews for this product.</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
