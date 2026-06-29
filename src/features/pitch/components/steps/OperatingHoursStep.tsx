'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { PitchFormData } from '../../schema/pitch.schema';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

const DAY_OPTIONS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function OperatingHoursStep() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<PitchFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'operatingHours',
  });
  const yards = watch('yards');

  const inputClass =
    'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all';
  const labelClass =
    'text-[10px] font-bold uppercase tracking-wide text-gray-500';
  const errorClass = 'text-red-500 text-[10px] mt-1';

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      {fields.map((field, index) => {
        const hourErrors = errors?.operatingHours?.[index];

        return (
          <div
            key={field.id}
            className="relative p-5 border border-gray-100 rounded-2xl bg-gray-50/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                Schedule {index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Yard */}
              <div className="space-y-1.5">
                <label className={labelClass}>Yard</label>
                <select
                  {...register(`operatingHours.${index}.yardIndex`, {
                    valueAsNumber: true,
                  })}
                  className={`${inputClass} bg-white`}
                >
                  {yards.map((y, yi) => (
                    <option key={yi} value={yi}>
                      {y.name || `Yard ${yi + 1}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Day of Week */}
              <div className="space-y-1.5">
                <label className={labelClass}>Day of Week</label>
                <select
                  {...register(`operatingHours.${index}.dayOfWeek`, {
                    valueAsNumber: true,
                  })}
                  className={`${inputClass} bg-white`}
                >
                  {DAY_OPTIONS.map((d, di) => (
                    <option key={di} value={di}>
                      {d}
                    </option>
                  ))}
                </select>
                {hourErrors?.dayOfWeek && (
                  <p className={errorClass}>{hourErrors.dayOfWeek.message}</p>
                )}
              </div>

              {/* Open Time */}
              <div className="space-y-1.5">
                <label className={labelClass}>Open</label>
                <input
                  type="time"
                  {...register(`operatingHours.${index}.openTime`)}
                  className={inputClass}
                />
                {hourErrors?.openTime && (
                  <p className={errorClass}>{hourErrors.openTime.message}</p>
                )}
              </div>

              {/* Close Time */}
              <div className="space-y-1.5">
                <label className={labelClass}>Close</label>
                <input
                  type="time"
                  {...register(`operatingHours.${index}.closeTime`)}
                  className={inputClass}
                />
                {hourErrors?.closeTime && (
                  <p className={errorClass}>{hourErrors.closeTime.message}</p>
                )}
              </div>
            </div>

            {/* Cross-field error (openTime >= closeTime) */}
            {hourErrors?.openTime?.message?.includes('before') && (
              <p className={`${errorClass} mt-2`}>
                {hourErrors.openTime.message}
              </p>
            )}
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            yardIndex: 0,
            dayOfWeek: 1,
            openTime: '06:00',
            closeTime: '22:00',
          })
        }
        className="w-full border-dashed border-emerald-200 text-emerald-700 hover:bg-emerald-50"
      >
        <Plus className="w-4 h-4 mr-2" /> Add Operating Hour
      </Button>

      {errors.operatingHours?.root && (
        <p className="text-red-500 text-xs text-center">
          {errors.operatingHours.root.message}
        </p>
      )}
    </div>
  );
}
