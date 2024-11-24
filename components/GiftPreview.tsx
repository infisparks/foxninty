import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { Gift } from '../types';

interface GiftPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  gift: Gift;
  productName: string;
}

export default function GiftPreview({ isOpen, onClose, gift, productName }: GiftPreviewProps) {
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
            className="bg-white rounded-lg max-w-xs w-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Free Gift</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="aspect-square rounded-lg overflow-hidden relative">
                <Image 
                  src={gift.image} 
                  alt={gift.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              
              <div>
                <p className="font-semibold">{gift.name}</p>
                <p className="text-sm text-gray-600">With {productName}</p>
                <p className="text-sm text-purple-600 font-semibold mt-1">Value: ${gift.value}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

