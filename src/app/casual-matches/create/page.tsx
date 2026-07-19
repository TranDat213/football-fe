'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useGetBookingsForCreateCasualQuery } from '@/features/booking/api/bookingAPI';
import type { Booking } from '@/features/booking/types/booking.types';
import { CasualMatchForm } from '@/features/casual-match/components/CasualMatchForm';
import { useCreateCasualMatchMutation } from '@/features/casual-match/api/casualMatch.api';
import type { CasualMatchFormValues } from '@/features/casual-match/schema/casual-match.schema';
import { toastApiError } from '@/features/casual-match/utils/error';
import { yardLabel, yardSlots } from '@/features/casual-match/utils/labels';
import { Calendar, Check, Loader2, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function CreateCasualMatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingIdFromUrl = searchParams.get('bookingId');
  const { data, isLoading } = useGetBookingsForCreateCasualQuery();
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(bookingIdFromUrl);
  const [createMatch, { isLoading: isCreating }] = useCreateCasualMatchMutation();

  const eligibleBookings = useMemo(
    () => data?.data || [],
    [data],
  );

  const selectedBooking = eligibleBookings.find((booking) => booking.id === selectedBookingId);
  const matchStartAt = selectedBooking
    ? `${selectedBooking.bookingDate.slice(0, 10)}T${selectedBooking.startTime}`
    : undefined;
  const defaultSlots = selectedBooking ? yardSlots[selectedBooking.fieldYard?.type] || 10 : 10;

  // Mirror BE logic: maxSlotPrice = totalPrice / divisor (fixed per yard type)
  const PRICE_DIVISORS: Record<string, number> = { FIVE_A_SIDE: 10, SEVEN_A_SIDE: 14, ELEVEN_A_SIDE: 22 };
  const priceDivisor = selectedBooking ? (PRICE_DIVISORS[selectedBooking.fieldYard?.type] ?? 10) : 10;
  const defaultSlotPrice = selectedBooking
    ? Math.floor(Number(selectedBooking.totalPrice) / priceDivisor)
    : undefined;

  const handleSubmit = async (values: CasualMatchFormValues) => {
    if (!selectedBooking) return;

    try {
      const response = await createMatch({
        bookingId: selectedBooking.id,
        title: values.title,
        description: values.description,
        totalSlots: values.totalSlots,
        slotPrice: values.slotPrice,
        joinDeadline: new Date(values.joinDeadline).toISOString(),
        visibility: values.visibility,
        teamMode: values.teamMode,
        skillLevel: values.skillLevel,
      }).unwrap();

      toast.success('Tạo trận vãng lai thành công');
      router.push(`/casual-matches/${response.data.id}`);
    } catch (error) {
      toastApiError(error, 'Tạo trận vãng lai thất bại');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tạo trận ngẫu hứng</h1>
            <p className="mt-1 text-sm text-gray-500">Chọn một booking đã thanh toán rồi mở kèo cho cộng đồng.</p>
          </div>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/">Về trang chủ</Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-gray-900">1. Chọn booking</h2>
              {isLoading ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                </div>
              ) : eligibleBookings.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-5 text-center">
                  <p className="text-sm text-gray-500">Bạn chưa có trận đấu nào được đặt.</p>
                  <Button asChild className="mt-4 rounded-xl bg-emerald-700 hover:bg-emerald-800">
                    <Link href="/">Chọn sân mới</Link>
                  </Button>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {eligibleBookings.map((booking) => {
                    const active = booking.id === selectedBookingId;
                    return (
                      <button
                        key={booking.id}
                        type="button"
                        onClick={() => setSelectedBookingId(booking.id)}
                        className={`w-full rounded-xl border p-4 text-left transition ${
                          active ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600/20' : 'border-gray-100 hover:border-emerald-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-gray-900">{booking.fieldYard?.footballField?.name}</p>
                            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="h-3 w-3" /> {booking.fieldYard?.footballField?.address}
                            </p>
                          </div>
                          {active && <Check className="h-5 w-5 text-emerald-700" />}
                        </div>
                        <p className="mt-3 flex items-center gap-1 text-xs font-medium text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {new Date(booking.bookingDate).toLocaleDateString('vi-VN')} · {booking.startTime} - {booking.endTime}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {booking.fieldYard?.name} · {yardLabel[booking.fieldYard?.type] || booking.fieldYard?.type}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-gray-900">2. Thông tin trận</h2>
              {!selectedBooking ? (
                <div className="mt-5 rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                  Chọn booking hợp lệ để nhập thông tin trận.
                </div>
              ) : (
                <div className="mt-5">
                  <CasualMatchForm
                    matchStartAt={matchStartAt}
                    defaultValues={{ totalSlots: defaultSlots, slotPrice: defaultSlotPrice }}
                    maxSlotPrice={defaultSlotPrice}
                    isSubmitting={isCreating}
                    onSubmit={handleSubmit}
                  />
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
