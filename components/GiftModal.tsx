import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { Gift } from '../types';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  gift: Gift;
  productName: string;
}

export default function GiftModal({ isOpen, onClose, gift, productName }: GiftModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg max-w-md w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Complimentary Gift</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden relative">
                <Image 
                  src={gift.image} 
                  alt={gift.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              
              
<div>
                <p className="font-semibold text-lg">{gift.name}</p>
                <p className="text-gray-600">Included with {productName}</p>
                <p className="text-purple-600 font-semibold mt-2">Value: ${gift.value}</p>
              </div>
              
              <p className="text-sm text-gray-500">
                This exclusive gift comes complimentary with your purchase. 
                Limited time offer while stocks last.
              </p>
            </div>
            
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Accept Gift
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

