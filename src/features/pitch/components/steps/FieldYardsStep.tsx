'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { PitchFormData } from '../../schema/pitch.schema';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

const YARD_TYPES = [
  { value: 'FIVE_A_SIDE', label: '5 vs 5' },
  { value: 'SEVEN_A_SIDE', label: '7 vs 7' },
  { value: 'ELEVEN_A_SIDE', label: '11 vs 11' },
];

const YARD_STATUSES = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
];

export default function FieldYardsStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PitchFormData>();

  const { fields, append, remove } = useFieldArray({ control, name: 'yards' });

  const selectClass =
    'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all';
  const inputClass =
    'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all';
  const labelClass = 'text-xs font-bold uppercase tracking-wide text-gray-500';
  const errorClass = 'text-red-500 text-[10px] mt-1';

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="relative p-5 border border-gray-100 rounded-2xl bg-gray-50/50 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {/* Yard label */}
          <div className="sm:col-span-3 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Yard {index + 1}
            </span>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className={labelClass}>Yard Name</label>
            <input
              {...register(`yards.${index}.name`)}
              className={inputClass}
              placeholder="e.g. Yard A"
            />
            {errors?.yards?.[index]?.name && (
              <p className={errorClass}>{errors.yards[index]?.name?.message}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <label className={labelClass}>Type</label>
            <select
              {...register(`yards.${index}.type`)}
              className={selectClass}
            >
              {YARD_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors?.yards?.[index]?.type && (
              <p className={errorClass}>{errors.yards[index]?.type?.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className={labelClass}>Status</label>
            <select
              {...register(`yards.${index}.status`)}
              className={selectClass}
            >
              {YARD_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {errors?.yards?.[index]?.status && (
              <p className={errorClass}>
                {errors.yards[index]?.status?.message}
              </p>
            )}
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({ name: '', type: 'FIVE_A_SIDE', status: 'ACTIVE' })
        }
        className="w-full border-dashed border-emerald-200 text-emerald-700 hover:bg-emerald-50"
      >
        <Plus className="w-4 h-4 mr-2" /> Add Another Yard
      </Button>

      {errors.yards?.root && (
        <p className="text-red-500 text-xs text-center">
          {errors.yards.root.message}
        </p>
      )}
    </div>
  );
}
