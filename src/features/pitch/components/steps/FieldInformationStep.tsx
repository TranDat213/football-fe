'use client';

import { useFormContext } from 'react-hook-form';
import { PitchFormData } from '../../schema/pitch.schema';
import { useGetPitchCategoryQuery } from '../../api/pitchAPI';

// Placeholder — replace with real data from your category API
const CATEGORIES = [
  { id: 'cat_001', label: 'Football Field' },
  { id: 'cat_002', label: 'Futsal Field' },
];

export default function FieldInformationStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PitchFormData>();

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
          <label className={labelClass}>Pitch Name</label>
          <input
            {...register('name')}
            className={inputClass}
            placeholder="e.g. Green Star Football Field"
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className={labelClass}>Address</label>
          <input
            {...register('address')}
            className={inputClass}
            placeholder="Street number and name"
          />
          {errors.address && (
            <p className={errorClass}>{errors.address.message}</p>
          )}
        </div>

        {/* Province */}
        <div className="space-y-2">
          <label className={labelClass}>Province / City</label>
          <input
            {...register('province')}
            className={inputClass}
            placeholder="e.g. Ho Chi Minh City"
          />
          {errors.province && (
            <p className={errorClass}>{errors.province.message}</p>
          )}
        </div>

        {/* District */}
        <div className="space-y-2">
          <label className={labelClass}>District</label>
          <input
            {...register('district')}
            className={inputClass}
            placeholder="e.g. Quan 1"
          />
          {errors.district && (
            <p className={errorClass}>{errors.district.message}</p>
          )}
        </div>

        {/* Ward */}
        <div className="space-y-2">
          <label className={labelClass}>Ward</label>
          <input
            {...register('ward')}
            className={inputClass}
            placeholder="e.g. Phuong Ben Nghe"
          />
          {errors.ward && <p className={errorClass}>{errors.ward.message}</p>}
        </div>

        {/* Open time */}
        <div className="space-y-2">
          <label className={labelClass}>Open Time</label>
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
          <label className={labelClass}>Close Time</label>
          <input
            type="time"
            {...register('close_time')}
            className={inputClass}
          />
          {errors.close_time && (
            <p className={errorClass}>{errors.close_time.message}</p>
          )}
        </div>

        {/* Latitude (optional) */}
        <div className="space-y-2">
          <label className={labelClass}>
            Latitude{' '}
            <span className="text-gray-300 font-normal normal-case">
              (optional)
            </span>
          </label>
          <input
            type="number"
            step="any"
            {...register('latitude')}
            className={inputClass}
            placeholder="10.7769"
          />
        </div>

        {/* Longitude (optional) */}
        <div className="space-y-2">
          <label className={labelClass}>
            Longitude{' '}
            <span className="text-gray-300 font-normal normal-case">
              (optional)
            </span>
          </label>
          <input
            type="number"
            step="any"
            {...register('longitude')}
            className={inputClass}
            placeholder="106.7009"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className={labelClass}>Description</label>
        <textarea
          rows={4}
          {...register('description')}
          className={`${inputClass} resize-none`}
          placeholder="Describe the field, facilities, parking, etc."
        />
        {errors.description && (
          <p className={errorClass}>{errors.description.message}</p>
        )}
      </div>
    </div>
  );
}
