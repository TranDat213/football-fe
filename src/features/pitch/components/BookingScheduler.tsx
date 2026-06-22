'use client';

import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetAvailabilityQuery, useCreateBookingMutation } from '@/features/booking/api/bookingAPI';
import { format, addDays, subDays, startOfDay } from 'date-fns';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface BookingSchedulerProps {
  pitchId: string;
  price: number;
  yards: { id: string; name: string }[];
}

export default function BookingScheduler({ pitchId, price, yards }: BookingSchedulerProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string } | null>(null);
  
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const { data: availabilityResponse, isLoading, isFetching } = useGetAvailabilityQuery({ 
    fieldId: pitchId, 
    date: dateStr 
  });
  
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  const handleDateChange = (days: number) => {
    setSelectedDate(prev => addDays(prev, days));
    setSelectedSlot(null);
  };

  const handleBooking = async () => {
    if (!selectedSlot || !yards.length) return;

    try {
      const result = await createBooking({
        fieldYardId: yards[0].id, // For now, pick the first yard. In a more complex UI, user should pick a yard.
        bookingDate: dateStr,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        paymentMethod: 'VNPAY' // Default
      }).unwrap();

      toast.success('Đặt sân thành công!');
      router.push(`/booking/${result.data.id}`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Có lỗi xảy ra khi đặt sân');
    }
  };

  const slots = availabilityResponse?.data?.slots || [];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="bg-gray-900 p-5 text-white">
        <h3 className="text-lg font-bold">Select Date & Time</h3>
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
              {format(selectedDate, 'MMMM yyyy')} - {format(selectedDate, 'dd')}
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

      <div className="p-5">
        {(isLoading || isFetching) ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {slots.map((slot) => {
              const isSelected = selectedSlot?.startTime === slot.startTime;
              const isBooked = slot.status === 'BOOKED';

              return (
                <button
                  key={slot.startTime}
                  disabled={isBooked}
                  onClick={() => setSelectedSlot({ startTime: slot.startTime, endTime: slot.endTime })}
                  className={`flex flex-col items-center justify-center rounded-xl py-3 transition-all ${
                    isBooked
                      ? 'cursor-not-allowed bg-gray-50 text-gray-300'
                      : isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600/20'
                      : 'bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:ring-1 hover:ring-emerald-200'
                  }`}
                >
                  <span className={`text-[13px] ${isSelected ? 'font-bold' : 'font-medium'}`}>{slot.startTime}</span>
                  {isSelected && <Check className="mt-1 h-3 w-3" />}
                  {isBooked && <span className="mt-1 text-[10px] font-bold uppercase tracking-tight">Full</span>}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Price per Hour</span>
            <span className="font-semibold text-gray-900">${price.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900">Total Price</span>
              <span className="text-xl font-bold text-emerald-700">${price.toFixed(2)}</span>
            </div>
          </div>
          <Button 
            className="w-full bg-emerald-700 hover:bg-emerald-800 rounded-xl h-12 text-sm font-bold shadow-lg shadow-emerald-700/10 active:scale-[0.98] transition-transform"
            disabled={!selectedSlot || isBooking}
            onClick={handleBooking}
          >
            {isBooking ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Đặt sân ngay
          </Button>
          <p className="text-center text-[11px] text-gray-400">
            No charge yet. Review before payment.
          </p>
        </div>
      </div>
    </div>
  );
}
