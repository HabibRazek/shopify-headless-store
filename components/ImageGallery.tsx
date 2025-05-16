'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiChevronRight, FiChevronLeft, FiZoomIn } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

import { ShopifyImage } from '@/types/shopify';

type ImageGalleryProps = {
  images: ShopifyImage[];
  productTitle: string;
};

export default function ImageGallery({ images, productTitle }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Reset current image when images change
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [images]);

  // Handle image navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Lightbox navigation
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setShowLightbox(true);
    // Prevent body scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    // Restore body scrolling
    document.body.style.overflow = 'auto';
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      nextImage();
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      prevImage();
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showLightbox) return;

      switch (e.key) {
        case 'ArrowRight':
          nextLightboxImage();
          break;
        case 'ArrowLeft':
          prevLightboxImage();
          break;
        case 'Escape':
          closeLightbox();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox]);

  // If no images, show placeholder
  if (!images.length) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main image */}
      <div
        className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4 relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-full w-full group">
          <Image
            src={images[currentImageIndex]?.node.url}
            alt={images[currentImageIndex]?.node.altText || productTitle}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />

          {/* Zoom button */}
          <button
            onClick={() => openLightbox(currentImageIndex)}
            className="absolute bottom-4 right-4 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Zoom image"
          >
            <FiZoomIn className="w-5 h-5" />
          </button>

          {/* Image navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 mt-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-md ${
                currentImageIndex === index
                  ? 'ring-2 ring-indigo-600'
                  : 'ring-1 ring-gray-200 hover:ring-gray-300'
              }`}
            >
              <Image
                src={image.node.url}
                alt={image.node.altText || `${productTitle} - Image ${index + 1}`}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 20vw, 10vw"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <div
              className="relative max-w-4xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[80vh]">
                <Image
                  src={images[lightboxIndex]?.node.url}
                  alt={images[lightboxIndex]?.node.altText || productTitle}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>

              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 bg-white/20 rounded-full p-2 hover:bg-white/40 transition-colors"
                aria-label="Close lightbox"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Navigation buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevLightboxImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 rounded-full p-3 hover:bg-white/40 transition-colors"
                    aria-label="Previous image"
                  >
                    <FiChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextLightboxImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 rounded-full p-3 hover:bg-white/40 transition-colors"
                    aria-label="Next image"
                  >
                    <FiChevronRight className="w-6 h-6 text-white" />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {lightboxIndex + 1} / {images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
