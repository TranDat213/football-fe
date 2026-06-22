'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetBookingByIdQuery, useCreatePaymentMutation } from '@/features/booking/api/bookingAPI';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, MapPin, Calendar, CreditCard, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: response, isLoading, error } = useGetBookingByIdQuery(id);
  const [createPayment, { isLoading: isPaying }] = useCreatePaymentMutation();

  if (isLoading) return <div className="flex min-h-screen items-center justify-center">Loading booking details...</div>;
  if (error || !response) return <div className="flex min-h-screen items-center justify-center text-red-500">Booking not found</div>;

  const booking = response.data;

  const handlePayment = async (method: string) => {
    try {
      const response = await createPayment({
        bookingId: id,
        paymentMethod: method
      }).unwrap();

      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        toast.info(response.message || 'Thanh toán thành công (Mô phỏng)');
        // If cash or something else, maybe redirect to success
        router.push('/booking/success');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Có lỗi xảy ra khi tạo thanh toán');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-emerald-600 p-8 text-white text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/20 mb-4">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Booking Confirmation</h1>
            <p className="text-emerald-100 mt-2">Please review your booking and proceed to payment</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Field Info */}
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
                {/* Image placeholder or real image if available */}
                <div className="h-full w-full bg-emerald-50 flex items-center justify-center">
                   <MapPin className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{booking.fieldYard?.footballField?.name}</h2>
                <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> {booking.fieldYard?.footballField?.address}
                </p>
                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  {booking.fieldYard?.name}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 border-y border-gray-100 py-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</span>
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  {format(new Date(booking.bookingDate), 'PPP')}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Time Slot</span>
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  {booking.startTime} - {booking.endTime}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Booking Fee</span>
                  <span className="text-gray-900">${booking.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                  <span className="text-gray-900">Total Amount</span>
                  <span className="text-emerald-700 font-price">${booking.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="font-bold text-gray-900">Select Payment Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                  onClick={() => handlePayment('VNPAY')}
                  disabled={isPaying}
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                       <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900">VNPay</p>
                      <p className="text-[10px] text-gray-500">Fast & Secure</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => handlePayment('CASH')}
                  disabled={isPaying}
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
                       <CreditCard className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900">Pay at Pitch</p>
                      <p className="text-[10px] text-gray-500">Cash or Transfer</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <Button 
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-600/20 mt-4"
              onClick={() => handlePayment('VNPAY')}
              disabled={isPaying}
            >
              {isPaying ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
              Confirm & Pay Now
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
