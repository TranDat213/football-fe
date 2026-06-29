'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { PitchFormData } from '../../schema/pitch.schema';
import { Camera, Star, Trash2 } from 'lucide-react';
import { useRef } from 'react';

export default function FieldImagesStep() {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PitchFormData>();

  const { fields, append, remove } = useFieldArray({ control, name: 'images' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const images = watch('images') ?? [];

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file, i) => {
      append({
        file,
        sortOrder: images.length + i,
        isCover: images.length === 0 && i === 0, // first image is cover by default
      });
    });
    // reset input so same file can be re-selected if removed
    e.target.value = '';
  };

  const toggleCover = (index: number) => {
    images.forEach((_, i) => {
      setValue(`images.${i}.isCover`, i === index, { shouldValidate: true });
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

      {/* Upload trigger */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Existing image previews */}
        {fields.map((field, index) => {
          const img = images[index];
          const previewUrl = img?.file ? URL.createObjectURL(img.file) : null;

          return (
            <div
              key={field.id}
              className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100"
            >
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt={`Field image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Cover badge */}
              {img?.isCover && (
                <div className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-white" /> Cover
                </div>
              )}

              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                {!img?.isCover && (
                  <button
                    type="button"
                    onClick={() => toggleCover(index)}
                    className="text-[10px] font-bold bg-white/90 text-gray-800 px-3 py-1 rounded-full hover:bg-white transition"
                  >
                    Set as Cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all"
        >
          <Camera className="h-6 w-6 text-gray-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Upload
          </span>
        </button>
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-400">
        Upload at least one image. Hover an image to set it as the cover photo.
        Files are sent as{' '}
        <code className="text-gray-500">multipart/form-data</code> via Express
        Multer.
      </p>

      {/* Validation error */}
      {errors.images?.root?.message && (
        <p className="text-red-500 text-xs">{errors.images.root.message}</p>
      )}
      {/* min(1) error shows as message on the array itself */}
      {typeof errors.images?.message === 'string' && (
        <p className="text-red-500 text-xs">{errors.images.message}</p>
      )}
    </div>
  );
}
