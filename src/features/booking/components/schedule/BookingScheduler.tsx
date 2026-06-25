'use client';

import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useGetAvailabilityQuery,
  useCreateBookingMutation,
} from '@/features/booking/api/bookingAPI';
import { FieldYard, YardAvailability, TimeSlot } from '@/features/booking/types/booking.types';
import { format, addDays, startOfDay } from 'date-fns';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface BookingSchedulerProps {
  pitchId: string;
  yards: FieldYard[];
}

const YARD_TYPE_LABEL: Record<string, string> = {
  FIVE_A_SIDE: '5v5',
  SEVEN_A_SIDE: '7v7',
  ELEVEN_A_SIDE: '11v11',
};

export default function BookingScheduler({ pitchId, yards }: BookingSchedulerProps) {
  const router = useRouter();

  const [selectedYardId, setSelectedYardId] = useState<string | null>(
    yards.length > 0 ? yards[0].id : null,
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  const { data: availabilityResponse, isLoading, isFetching } = useGetAvailabilityQuery({
    fieldId: pitchId,
    date: dateStr,
  });

  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  const availabilityYards: YardAvailability[] = availabilityResponse?.data?.yards ?? [];
  const selectedYardAvailability = availabilityYards.find((y) => y.yardId === selectedYardId);
  const slots: TimeSlot[] = selectedYardAvailability?.slots ?? [];

  const handleDateChange = (days: number) => {
    setSelectedDate((prev) => addDays(prev, days));
    setSelectedSlot(null);
  };

  const handleYardSelect = (yardId: string) => {
    setSelectedYardId(yardId);
    setSelectedSlot(null);
  };

  const handleBooking = async () => {
    if (!selectedSlot || !selectedYardId) return;

    try {
      const result = await createBooking({
        fieldYardId: selectedYardId,
        bookingDate: dateStr,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      }).unwrap();

      toast.success('Đặt sân thành công!');
      router.push(`/booking/${result.data.id}`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Có lỗi xảy ra khi đặt sân');
    }
  };

  const selectedYardMeta = yards.find((y) => y.id === selectedYardId);
  const isLoadingSlots = isLoading || isFetching;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header: Date picker */}
      <div className="bg-gray-900 p-5 text-white">
        <h3 className="text-lg font-bold">Chọn Ngày & Giờ</h3>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-white/10 p-2.5 backdrop-blur-sm">
          <button
            onClick={() => handleDateChange(-1)}
            disabled={startOfDay(selectedDate) <= startOfDay(new Date())}
            className="rounded-lg p-1.5 hover:bg-white/10 transition-colors disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              {format(selectedDate, 'MMMM yyyy')} — {format(selectedDate, 'dd')}
            </span>
          </div>
          <button
            onClick={() => handleDateChange(1)}
            className="rounded-lg p-1.5 hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Step 1 — Yard selector */}
        <div>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
            1. Chọn sân con
          </p>
          {yards.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Không có sân con nào khả dụng.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {yards.map((yard) => {
                const isActive = selectedYardId === yard.id;
                const yardAvail = availabilityYards.find((y) => y.yardId === yard.id);
                const hasAvailable = yardAvail
                  ? yardAvail.slots.some((s) => s.status === 'AVAILABLE')
                  : true;

                return (
                  <button
                    key={yard.id}
                    onClick={() => handleYardSelect(yard.id)}
                    className={`relative flex flex-col gap-0.5 rounded-xl border px-3 py-2.5 text-left transition-all ${
                      isActive
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm ring-1 ring-emerald-600/30'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <MapPin
                        className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}
                      />
                      <span className="truncate text-sm font-semibold">{yard.name}</span>
                    </div>
                    <div className="ml-5 flex items-center gap-1.5">
                      <span className={`text-[11px] font-medium ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {YARD_TYPE_LABEL[yard.type] ?? yard.type}
                      </span>
                      {!isLoadingSlots && yardAvail && !hasAvailable && (
                        <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-500">
                          Hết giờ
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 2 — Time slot grid */}
        <div>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
            2. Chọn khung giờ
          </p>

          {!selectedYardId ? (
            <EmptyState message="Vui lòng chọn sân con trước" />
          ) : isLoadingSlots ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            </div>
          ) : slots.length === 0 ? (
            <EmptyState message="Không có khung giờ nào cho ngày này" />
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {slots.map((slot) => {
                const isSelected = selectedSlot?.startTime === slot.startTime;
                const isBooked = slot.status === 'BOOKED';
                const isDisabled = slot.status === 'DISABLED';
                const unavailable = isBooked || isDisabled;

                return (
                  <button
                    key={slot.startTime}
                    disabled={unavailable}
                    onClick={() => setSelectedSlot(slot)}
                    className={`flex flex-col items-center justify-center rounded-xl py-2.5 transition-all ${
                      unavailable
                        ? 'cursor-not-allowed bg-gray-50 text-gray-300'
                        : isSelected
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600/20'
                          : 'bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:ring-1 hover:ring-emerald-200'
                    }`}
                  >
                    <span className={`text-[13px] ${isSelected ? 'font-bold' : 'font-medium'}`}>
                      {slot.startTime}
                    </span>
                    {!unavailable && slot.price > 0 && (
                      <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-gray-400'}`}>
                        {(slot.price / 1000).toFixed(0)}k
                      </span>
                    )}
                    {isSelected && <Check className="mt-1 h-3 w-3" />}
                    {isBooked && (
                      <span className="mt-1 text-[10px] font-bold uppercase tracking-tight">Full</span>
                    )}
                    {isDisabled && (
                      <span className="mt-1 text-[10px] font-bold uppercase tracking-tight">Đóng</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary & CTA */}
        <div className="space-y-4">
          {selectedYardMeta && selectedSlot && (
            <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm space-y-1.5">
              <SummaryRow
                label="Sân"
                value={`${selectedYardMeta.name} (${YARD_TYPE_LABEL[selectedYardMeta.type] ?? selectedYardMeta.type})`}
              />
              <SummaryRow label="Ngày" value={format(selectedDate, 'dd/MM/yyyy')} />
              <SummaryRow label="Giờ" value={`${selectedSlot.startTime} – ${selectedSlot.endTime}`} />
              {selectedSlot.priceLabel && (
                <SummaryRow label="Khung giá" value={selectedSlot.priceLabel} />
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Giá / giờ</span>
            <span className="font-semibold text-gray-900">
              {selectedSlot ? selectedSlot.price.toLocaleString('vi-VN') + '₫' : '—'}
            </span>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900">Tổng tiền</span>
              <span className="text-xl font-bold text-emerald-700">
                {selectedSlot ? selectedSlot.price.toLocaleString('vi-VN') + '₫' : '—'}
              </span>
            </div>
          </div>

          <Button
            className="w-full bg-emerald-700 hover:bg-emerald-800 rounded-xl h-12 text-sm font-bold shadow-lg shadow-emerald-700/10 active:scale-[0.98] transition-transform"
            disabled={!selectedSlot || !selectedYardId || isBooking}
            onClick={handleBooking}
          >
            {isBooking && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Đặt sân ngay
          </Button>

          <p className="text-center text-[11px] text-gray-400">
            Chưa thanh toán. Vui lòng kiểm tra trước khi xác nhận.
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400">
      {message}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-gray-500">
      <span>{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}