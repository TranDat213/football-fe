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

export default function PriceRulesStep() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<PitchFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'priceRules',
  });
  const yards = watch('yards');
  const priceRules = watch('priceRules');

  const inputClass =
    'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all';
  const labelClass =
    'text-[10px] font-bold uppercase tracking-wide text-gray-500';
  const errorClass = 'text-red-500 text-[10px] mt-1';

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      {fields.map((field, index) => {
        const ruleErrors = errors?.priceRules?.[index];
        const useSpecialDate = !!priceRules?.[index]?.specialDate;

        return (
          <div
            key={field.id}
            className="relative p-5 border border-gray-100 rounded-2xl bg-gray-50/50 space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                Rule {index + 1}
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
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className={labelClass}>Apply to Yard</label>
                <select
                  {...register(`priceRules.${index}.yardIndex`, {
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

              {/* Start Time */}
              <div className="space-y-1.5">
                <label className={labelClass}>Start Time</label>
                <input
                  type="time"
                  {...register(`priceRules.${index}.startTime`)}
                  className={inputClass}
                />
                {ruleErrors?.startTime && (
                  <p className={errorClass}>{ruleErrors.startTime.message}</p>
                )}
              </div>

              {/* End Time */}
              <div className="space-y-1.5">
                <label className={labelClass}>End Time</label>
                <input
                  type="time"
                  {...register(`priceRules.${index}.endTime`)}
                  className={inputClass}
                />
                {ruleErrors?.endTime && (
                  <p className={errorClass}>{ruleErrors.endTime.message}</p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className={labelClass}>Price (₫)</label>
                <input
                  type="number"
                  min={0}
                  {...register(`priceRules.${index}.price`, {
                    valueAsNumber: true,
                  })}
                  className={inputClass}
                  placeholder="100000"
                />
                {ruleErrors?.price && (
                  <p className={errorClass}>{ruleErrors.price.message}</p>
                )}
              </div>
            </div>

            {/* Day of Week OR Special Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Day of Week</label>
                <select
                  {...register(`priceRules.${index}.dayOfWeek`, {
                    valueAsNumber: true,
                    setValueAs: (v) => (v === '' ? null : Number(v)),
                  })}
                  disabled={useSpecialDate}
                  className={`${inputClass} bg-white disabled:opacity-40`}
                >
                  <option value="">— Any day —</option>
                  {DAY_OPTIONS.map((d, di) => (
                    <option key={di} value={di}>
                      {d}
                    </option>
                  ))}
                </select>
                {ruleErrors?.dayOfWeek && (
                  <p className={errorClass}>{ruleErrors.dayOfWeek.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>
                  Special Date{' '}
                  <span className="text-gray-300 normal-case font-normal">
                    (overrides day)
                  </span>
                </label>
                <input
                  type="date"
                  {...register(`priceRules.${index}.specialDate`)}
                  disabled={
                    priceRules?.[index]?.dayOfWeek != null &&
                    priceRules?.[index]?.dayOfWeek !== ('' as any)
                  }
                  className={`${inputClass} disabled:opacity-40`}
                />
                {ruleErrors?.specialDate && (
                  <p className={errorClass}>{ruleErrors.specialDate.message}</p>
                )}
              </div>
            </div>

            {/* Label (optional) */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                Label{' '}
                <span className="text-gray-300 normal-case font-normal">
                  (optional)
                </span>
              </label>
              <input
                {...register(`priceRules.${index}.label`)}
                className={inputClass}
                placeholder="e.g. Weekend peak hours"
              />
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            yardIndex: 0,
            startTime: '06:00',
            endTime: '18:00',
            price: 100000,
            dayOfWeek: 1,
          })
        }
        className="w-full border-dashed border-emerald-200 text-emerald-700 hover:bg-emerald-50"
      >
        <Plus className="w-4 h-4 mr-2" /> Add Price Rule
      </Button>
    </div>
  );
}
