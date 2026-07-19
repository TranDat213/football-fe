'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { casualMatchSchema, type CasualMatchFormValues } from '../schema/casual-match.schema';
import { skillLevelLabels, teamModeLabels, visibilityLabels } from '../utils/labels';
import type { CasualMatch } from '../types/casual-match.types';

interface CasualMatchFormProps {
  matchStartAt?: string;
  defaultValues?: Partial<CasualMatchFormValues>;
  isSubmitting?: boolean;
  hideTotalSlots?: boolean;
  /** Giá slot tối đa được phép (tính từ BE) — chỉ dùng để hiển thị hint */
  maxSlotPrice?: number;
  onSubmit: (values: CasualMatchFormValues) => void | Promise<void>;
}

const fieldClass = 'w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100';
const labelClass = 'text-xs font-bold uppercase tracking-widest text-gray-400';

export function CasualMatchForm({
  matchStartAt,
  defaultValues,
  isSubmitting,
  hideTotalSlots,
  maxSlotPrice,
  onSubmit,
}: CasualMatchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CasualMatchFormValues>({
    resolver: zodResolver(casualMatchSchema),
    defaultValues: {
      title: '',
      description: '',
      totalSlots: 10,
      slotPrice: undefined,
      joinDeadline: '',
      visibility: 'PUBLIC',
      teamMode: 'NO_TEAM',
      skillLevel: 'ANY',
      matchStartAt,
      ...defaultValues,
    },
  });

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register('matchStartAt')} />

      <div className="space-y-2">
        <label className={labelClass}>Tiêu đề</label>
        <input className={fieldClass} {...register('title')} placeholder="Ví dụ: Kèo 7v7 tối thứ bảy" />
        <ErrorText message={errors.title?.message} />
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Mô tả</label>
        <textarea className={`${fieldClass} min-h-24 resize-none`} {...register('description')} placeholder="Ghi chú thêm cho người tham gia" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {!hideTotalSlots && (
          <div className="space-y-2">
            <label className={labelClass}>Số slot tối đa</label>
            <input type="number" min={1} max={100} className={fieldClass} {...register('totalSlots')} />
            <ErrorText message={errors.totalSlots?.message} />
          </div>
        )}

        <div className="space-y-2">
          <label className={labelClass}>Giá mỗi slot</label>
          <input type="number" min={0} step={1000} className={fieldClass} {...register('slotPrice')} />
          {maxSlotPrice !== undefined && (
            <p className="text-xs text-gray-400">
              Tối đa: <span className="font-semibold text-emerald-700">{maxSlotPrice.toLocaleString('vi-VN')} VNĐ</span>
            </p>
          )}
          <ErrorText message={errors.slotPrice?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Hạn tham gia</label>
        <input type="datetime-local" className={fieldClass} {...register('joinDeadline')} />
        <ErrorText message={errors.joinDeadline?.message} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField label="Hiển thị" register={register('visibility')} options={visibilityLabels} />
        <SelectField label="Chia đội" register={register('teamMode')} options={teamModeLabels} />
        <SelectField label="Trình độ" register={register('skillLevel')} options={skillLevelLabels} />
      </div>

      <Button disabled={isSubmitting} className="h-12 w-full rounded-xl bg-emerald-700 font-bold text-white hover:bg-emerald-800">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Lưu trận vãng lai
      </Button>
    </form>
  );
}

function SelectField({
  label,
  register,
  options,
}: {
  label: string;
  register: ReturnType<typeof useForm<CasualMatchFormValues>>['register'] extends (...args: any) => infer R ? R : never;
  options: Record<string, string>;
}) {
  return (
    <div className="space-y-2">
      <label className={labelClass}>{label}</label>
      <select className={fieldClass} {...register}>
        {Object.entries(options).map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </div>
  );
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs font-medium text-red-600">{message}</p>;
}

export function matchToFormValues(match: CasualMatch): Partial<CasualMatchFormValues> {
  return {
    title: match.title || '',
    description: match.description || '',
    totalSlots: match.totalSlots,
    slotPrice: Number(match.slotPrice),
    joinDeadline: match.joinDeadline ? toDatetimeLocal(match.joinDeadline) : '',
    visibility: match.visibility,
    teamMode: match.teamMode,
    skillLevel: match.skillLevel,
  };
}

export function toDatetimeLocal(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
