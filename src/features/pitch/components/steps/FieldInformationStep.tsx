'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { PitchFormData } from '../../schema/pitch.schema';
import { useGetPitchCategoryQuery } from '../../api/pitchAPI';
import LocationPicker from '../LocationPicker';

// Placeholder — replace with real data from your category API
const CATEGORIES = [
  { id: 'cat_001', label: 'Football Field' },
  { id: 'cat_002', label: 'Futsal Field' },
];

export default function FieldInformationStep() {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<PitchFormData>();
  const latitude = useWatch({
    control,
    name: 'latitude',
  });

  const longitude = useWatch({
    control,
    name: 'longitude',
  });

  const inputClass =
    'w-full rounded-xl border border-gray-100 px-4 py-3 text-sm focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/5 transition-all outline-none';
  const labelClass =
    'text-xs font-bold uppercase tracking-widest text-gray-500';
  const errorClass = 'text-red-500 text-xs mt-1';

  const { data: categoryResponse, isLoading } = useGetPitchCategoryQuery();

  const categories = categoryResponse?.data ?? [];
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Category */}
        <div className="space-y-2 sm:col-span-2">
          <label className={labelClass}>Category</label>

          <select
            {...register('category_id')}
            className={`${inputClass} bg-white`}
          >
            <option value="">Select category…</option>

            {isLoading ? (
              <option disabled>Loading...</option>
            ) : (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </select>

          {errors.category_id && (
            <p className={errorClass}>{errors.category_id.message}</p>
          )}
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label className={labelClass}>Tên sân</label>
          <input
            {...register('name')}
            className={inputClass}
            placeholder="e.g. Green Star Football Field"
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className={labelClass}>Địa chỉ</label>
          <input
            {...register('address')}
            className={inputClass}
            placeholder="Tên đường và số nhà"
          />
          {errors.address && (
            <p className={errorClass}>{errors.address.message}</p>
          )}
        </div>

        {/* District */}
        <div className="space-y-2">
          <label className={labelClass}>Quận/Huyện</label>
          <input
            {...register('district')}
            className={inputClass}
            placeholder="e.g. Quận 1"
          />
          {errors.district && (
            <p className={errorClass}>{errors.district.message}</p>
          )}
        </div>

        {/* Ward */}
        <div className="space-y-2">
          <label className={labelClass}>Phường</label>
          <input
            {...register('ward')}
            className={inputClass}
            placeholder="e.g. Phường Bến Nghé"
          />
          {errors.ward && <p className={errorClass}>{errors.ward.message}</p>}
        </div>

        {/* Province */}
        <div className="space-y-2">
          <label className={labelClass}>Tỉnh/Thành phố</label>
          <input
            {...register('province')}
            className={inputClass}
            placeholder="e.g. Thành phố Hồ Chí Minh"
          />
          {errors.province && (
            <p className={errorClass}>{errors.province.message}</p>
          )}
        </div>

        {/* Open time */}
        <div className="space-y-2">
          <label className={labelClass}>Giờ mở cửa</label>
          <input
            type="time"
            {...register('open_time')}
            className={inputClass}
          />
          {errors.open_time && (
            <p className={errorClass}>{errors.open_time.message}</p>
          )}
        </div>

        {/* Close time */}
        <div className="space-y-2">
          <label className={labelClass}>Giờ đóng cửa</label>
          <input
            type="time"
            {...register('close_time')}
            className={inputClass}
          />
          {errors.close_time && (
            <p className={errorClass}>{errors.close_time.message}</p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className={labelClass}>Vị trí</label>

          <LocationPicker
            value={
              latitude != null && longitude != null
                ? {
                    lat: latitude,
                    lng: longitude,
                  }
                : undefined
            }
            onChange={(lat, lng) => {
              setValue('latitude', lat, {
                shouldValidate: true,
              });

              setValue('longitude', lng, {
                shouldValidate: true,
              });
            }}
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className={labelClass}>Mô tả</label>
        <textarea
          rows={4}
          {...register('description')}
          className={`${inputClass} resize-none`}
          placeholder="Hãy mô tả về sân, cơ sở vật chất, bãi đỗ xe, v.v."
        />
        {errors.description && (
          <p className={errorClass}>{errors.description.message}</p>
        )}
      </div>
    </div>
  );
}
