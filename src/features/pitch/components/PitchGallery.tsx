'use client';

import { useState } from 'react';

interface PitchGalleryProps {
  images: string[];
}

export default function PitchGallery({ images }: PitchGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0] || '');

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all hover:shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mainImage}
          alt="Pitch View"
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setMainImage(img)}
            className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
              mainImage === img ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-transparent hover:border-emerald-200'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
