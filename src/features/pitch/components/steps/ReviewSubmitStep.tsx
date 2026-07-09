'use client';

import { useFormContext } from 'react-hook-form';
import { PitchFormData } from '../../schema/pitch.schema';
import { Clock, MapPin, Image, DollarSign, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewSubmitStepProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function ReviewSubmitStep({
  onSubmit,
  isSubmitting,
}: ReviewSubmitStepProps) {
  const { watch } = useFormContext<PitchFormData>();
  const d = watch();

  const section = 'rounded-2xl border border-gray-100 p-5 space-y-3';
  const row = 'flex items-start gap-2 text-sm';
  const key = 'font-semibold text-gray-700 min-w-[120px]';
  const val = 'text-gray-500';

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Field Info */}
      <div className={section}>
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <h4 className="font-bold text-sm uppercase tracking-widest text-emerald-700">
            Field Information
          </h4>
        </div>
        <div className={row}>
          <span className={key}>Name</span>
          <span className={val}>{d.name || '—'}</span>
        </div>
        <div className={row}>
          <span className={key}>Address</span>
          <span className={val}>
            {[d.address, d.ward, d.district, d.province]
              .filter(Boolean)
              .join(', ') || '—'}
          </span>
        </div>
        <div className={row}>
          <span className={key}>Description</span>
          <span className={val}>{d.description || '—'}</span>
        </div>
        <div className={row}>
          <span className={key}>Hours</span>
          <span className={val}>
            {d.open_time} – {d.close_time}
          </span>
        </div>
        {(d.latitude || d.longitude) && (
          <div className={row}>
            <span className={key}>Coordinates</span>
            <span className={val}>
              {d.latitude}, {d.longitude}
            </span>
          </div>
        )}
      </div>

      {/* Yards */}
      <div className={section}>
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-emerald-600" />
          <h4 className="font-bold text-sm uppercase tracking-widest text-emerald-700">
            Yards ({d.yards?.length ?? 0})
          </h4>
        </div>
        {d.yards?.map((y, i) => (
          <div key={i} className={row}>
            <span className={key}>Yard {i + 1}</span>
            <span className={val}>
              {y.name || '(unnamed)'} · {y.type}
            </span>
          </div>
        ))}
      </div>

      {/* Images */}
      <div className={section}>
        <div className="flex items-center gap-2 mb-1">
          <Image className="w-4 h-4 text-emerald-600" />
          <h4 className="font-bold text-sm uppercase tracking-widest text-emerald-700">
            Images ({d.images?.length ?? 0})
          </h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {d.images?.map((img, i) => {
             const url = img.kind === 'new' ? URL.createObjectURL(img.file) : img.url;
            return url ? (
              <div
                key={i}
                className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100"
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
                {img.isCover && (
                  <div className="absolute inset-x-0 bottom-0 bg-emerald-600/80 text-white text-[8px] text-center font-bold py-0.5">
                    COVER
                  </div>
                )}
              </div>
            ) : null;
          })}
        </div>
      </div>

      <p className="text-xs text-emerald-700 font-medium text-center bg-emerald-50 rounded-xl px-4 py-3">
        Khi nhấp vào “Gửi”, tất cả dữ liệu sẽ được gửi đến máy chủ. Sân sẽ được
        đánh dấu <strong>Chờ duyệt</strong> cho đến khi quản trị viên phê duyệt.
      </p>
      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full h-12 bg-emerald-700 hover:bg-emerald-800"
      >
        {isSubmitting ? 'Đang gửi...' : 'Gửi sân'}
      </Button>
    </div>
  );
}
