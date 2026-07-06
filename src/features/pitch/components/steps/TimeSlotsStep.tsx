'use client';

import { useFormContext, useFieldArray, Control } from 'react-hook-form';
import { PitchFormData } from '../../schema/pitch.schema';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const DAY_OPTIONS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const TIME_SLOT_LABELS = [
  { value: 'REGULAR', label: 'Regular' },
  { value: 'PEAK', label: 'Peak' },
  { value: 'LATE_NIGHT', label: 'Late Night' },
];

interface TimeSlotFieldsProps {
  control: Control<PitchFormData>;
  yardIndex: number;
}

export default function TimeSlotFields({
  control,
  yardIndex,
}: TimeSlotFieldsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<PitchFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `yards.${yardIndex}.timeSlots`,
  });

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const inputClass =
    'w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all';
  const labelClass =
    'text-[9px] font-bold uppercase tracking-wide text-gray-400';
  const errorClass = 'text-red-500 text-[10px] mt-1';

  const slotErrors = errors?.yards?.[yardIndex]?.timeSlots;

  return (
    <div className="space-y-3">
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
        Time Slots
      </span>

      {fields.map((field, slotIndex) => {
        const isOpen = openIndex === slotIndex;
        const errs = slotErrors?.[slotIndex];

        return (
          <div
            key={field.id}
            className="border border-gray-200 rounded-xl bg-white overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : slotIndex)}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-xs font-semibold text-gray-700">
                Slot {slotIndex + 1}
              </span>
              <div className="flex items-center gap-2">
                {fields.length > 1 && (
                  <span
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(slotIndex);
                    }}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </span>
                )}
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            {isOpen && (
              <div className="p-3 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className={labelClass}>Day of Week</label>
                    <select
                      {...register(
                        `yards.${yardIndex}.timeSlots.${slotIndex}.dayOfWeek`,
                        { valueAsNumber: true },
                      )}
                      className={`${inputClass} bg-white`}
                    >
                      {DAY_OPTIONS.map((d, di) => (
                        <option key={di} value={di}>
                          {d}
                        </option>
                      ))}
                    </select>
                    {errs?.dayOfWeek && (
                      <p className={errorClass}>{errs.dayOfWeek.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Start Time</label>
                    <input
                      type="time"
                      {...register(
                        `yards.${yardIndex}.timeSlots.${slotIndex}.startTime`,
                      )}
                      className={inputClass}
                    />
                    {errs?.startTime && (
                      <p className={errorClass}>{errs.startTime.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>End Time</label>
                    <input
                      type="time"
                      {...register(
                        `yards.${yardIndex}.timeSlots.${slotIndex}.endTime`,
                      )}
                      className={inputClass}
                    />
                    {errs?.endTime && (
                      <p className={errorClass}>{errs.endTime.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Label</label>
                    <select
                      {...register(
                        `yards.${yardIndex}.timeSlots.${slotIndex}.label`,
                      )}
                      className={`${inputClass} bg-white`}
                    >
                      {TIME_SLOT_LABELS.map((l) => (
                        <option key={l.value} value={l.value}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                    {errs?.label && (
                      <p className={errorClass}>{errs.label.message}</p>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
                  <label className={labelClass}>Price (VNĐ)</label>

                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      ₫
                    </span>

                    <input
                      type="number"
                      min={0}
                      {...register(
                        `yards.${yardIndex}.timeSlots.${slotIndex}.priceRule.price`,
                        {
                          valueAsNumber: true,
                        },
                      )}
                      className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-8 pr-16 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none"
                      placeholder="100000"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      VNĐ
                    </span>
                  </div>

                  {errs?.priceRule?.price && (
                    <p className={errorClass}>{errs.priceRule.price.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          append({
            dayOfWeek: 1,
            startTime: '06:00',
            endTime: '18:00',
            label: 'REGULAR',
            sortOrder: fields.length,
            priceRule: { price: 100000 },
          });
          setOpenIndex(fields.length);
        }}
        className="w-full border-dashed border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-xs h-8"
      >
        <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Time Slot
      </Button>

      {slotErrors?.root && (
        <p className={errorClass}>{slotErrors.root.message}</p>
      )}
    </div>
  );
}
