'use client';

import { useFormContext } from 'react-hook-form';
import { PitchFormData } from '../../schema/pitch.schema';
import { Clock, MapPin, Image, DollarSign, CalendarClock } from 'lucide-react';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ReviewSubmitStep() {
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
          <h4 className="font-bold text-sm uppercase tracking-widest text-emerald-700">Field Information</h4>
        </div>
        <div className={row}><span className={key}>Name</span><span className={val}>{d.name || '—'}</span></div>
        <div className={row}><span className={key}>Address</span><span className={val}>{[d.address, d.ward, d.district, d.province].filter(Boolean).join(', ') || '—'}</span></div>
        <div className={row}><span className={key}>Description</span><span className={val}>{d.description || '—'}</span></div>
        <div className={row}>
          <span className={key}>Hours</span>
          <span className={val}>{d.open_time} – {d.close_time}</span>
        </div>
        {(d.latitude || d.longitude) && (
          <div className={row}>
            <span className={key}>Coordinates</span>
            <span className={val}>{d.latitude}, {d.longitude}</span>
          </div>
        )}
      </div>

      {/* Yards */}
      <div className={section}>
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-emerald-600" />
          <h4 className="font-bold text-sm uppercase tracking-widest text-emerald-700">Yards ({d.yards?.length ?? 0})</h4>
        </div>
        {d.yards?.map((y, i) => (
          <div key={i} className={row}>
            <span className={key}>Yard {i + 1}</span>
            <span className={val}>{y.name || '(unnamed)'} · {y.type} · {y.status}</span>
          </div>
        ))}
      </div>

      {/* Images */}
      <div className={section}>
        <div className="flex items-center gap-2 mb-1">
          <Image className="w-4 h-4 text-emerald-600" />
          <h4 className="font-bold text-sm uppercase tracking-widest text-emerald-700">Images ({d.images?.length ?? 0})</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {d.images?.map((img, i) => {
            const url = img.file ? URL.createObjectURL(img.file) : null;
            return url ? (
              <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100">
                <img src={url} alt="" className="w-full h-full object-cover" />
                {img.isCover && (
                  <div className="absolute inset-x-0 bottom-0 bg-emerald-600/80 text-white text-[8px] text-center font-bold py-0.5">COVER</div>
                )}
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* Price Rules */}
      {(d.priceRules?.length ?? 0) > 0 && (
        <div className={section}>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-sm uppercase tracking-widest text-emerald-700">Price Rules ({d.priceRules?.length})</h4>
          </div>
          {d.priceRules?.map((r, i) => (
            <div key={i} className={row}>
              <span className={key}>Rule {i + 1}</span>
              <span className={val}>
                Yard {r.yardIndex + 1} · {r.startTime}–{r.endTime} ·{' '}
                {r.dayOfWeek != null ? DAY_NAMES[r.dayOfWeek] : r.specialDate ?? '—'} ·{' '}
                {r.price.toLocaleString('vi-VN')}₫
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Operating Hours */}
      {(d.operatingHours?.length ?? 0) > 0 && (
        <div className={section}>
          <div className="flex items-center gap-2 mb-1">
            <CalendarClock className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-sm uppercase tracking-widest text-emerald-700">Operating Hours ({d.operatingHours?.length})</h4>
          </div>
          {d.operatingHours?.map((h, i) => (
            <div key={i} className={row}>
              <span className={key}>{DAY_NAMES[h.dayOfWeek]}</span>
              <span className={val}>Yard {h.yardIndex + 1} · {h.openTime} – {h.closeTime}</span>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-emerald-700 font-medium text-center bg-emerald-50 rounded-xl px-4 py-3">
        Clicking Submit will send all data to the server. The field will be marked <strong>PENDING</strong> until an admin approves it.
      </p>
    </div>
  );
}