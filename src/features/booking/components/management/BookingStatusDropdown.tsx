'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Booking } from '@/features/booking/types/booking.types';
import { useUpdateBookingStatusMutation } from '@/features/booking/api/bookingAPI';

interface Option {
  value: Booking['status'];
  label: string;
  style: string;
  dot: string;
}

const OPTIONS: Option[] = [
  {
    value: 'PENDING',
    label: 'Đang chờ',
    style: 'text-amber-700 bg-amber-50 ring-amber-600/10',
    dot: 'bg-amber-500',
  },
  {
    value: 'CONFIRMED',
    label: 'Đã đặt',
    style: 'text-emerald-700 bg-emerald-50 ring-emerald-600/10',
    dot: 'bg-emerald-500',
  },
  {
    value: 'CANCELLED',
    label: 'Đã hủy',
    style: 'text-red-700 bg-red-50 ring-red-600/10',
    dot: 'bg-red-500',
  },
];

interface Props {
  bookingId: string;
  currentStatus: Booking['status'];
}

export default function BookingStatusDropdown({ bookingId, currentStatus }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [updateStatus, { isLoading }] = useUpdateBookingStatusMutation();

  const current = OPTIONS.find((o) => o.value === currentStatus) ?? OPTIONS[0];

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = async (option: Option) => {
    if (option.value === currentStatus) {
      setOpen(false);
      return;
    }
    setOpen(false);
    try {
      await updateStatus({ id: bookingId, status: option.value }).unwrap();
      toast.success(`Cập nhật trạng thái: ${option.label}`);
    } catch {
      toast.error('Cập nhật thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isLoading}
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset transition-opacity ${current.style} ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
      >
        {isLoading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
        )}
        {current.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1.5 w-36 rounded-xl border border-gray-100 bg-white shadow-lg shadow-gray-200/60 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors hover:bg-gray-50 ${
                option.value === currentStatus ? 'opacity-40 cursor-default' : ''
              }`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${option.dot}`} />
              <span className={`${option.value === currentStatus ? 'text-gray-400' : 'text-gray-700'}`}>
                {option.label}
              </span>
              {option.value === currentStatus && (
                <span className="ml-auto text-[9px] text-gray-300 uppercase tracking-wider">hiện tại</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}