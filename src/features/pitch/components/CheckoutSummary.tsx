'use client';

import { Calendar, MapPin, Clock, CreditCard, ShieldCheck } from 'lucide-react';

interface CheckoutSummaryProps {
  pitchName: string;
  location: string;
  date: string;
  timeSlot: string;
  price: number;
  fee: number;
}

export default function CheckoutSummary({
  pitchName,
  location,
  date,
  timeSlot,
  price,
  fee,
}: CheckoutSummaryProps) {
  const total = price + fee;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-50 rounded-bl-full -mr-4 -mt-4" />
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4 mb-6">Tóm tắt</h3>
        
        <div className="space-y-5">
          <div className="flex gap-4">
            <div className="h-20 w-20 shrink-0 rounded-2xl bg-gray-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=200&q=80" alt="Pitch" className="h-full w-full object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{pitchName}</h4>
              <div className="mt-1.5 flex items-center gap-1.5 text-gray-500">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-[13px]">{location}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-50 bg-gray-50/30 p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Ngày</p>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                {date}
              </div>
            </div>
            <div className="rounded-2xl border border-gray-50 bg-gray-50/30 p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Giờ</p>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Clock className="h-3.5 w-3.5 text-emerald-600" />
                {timeSlot}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-50">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-gray-500">Phí đặt sân</span>
              <span className="font-semibold text-gray-900">${price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-gray-500">Phí dịch vụ</span>
              <span className="font-semibold text-gray-900">${fee.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Tổng thanh toán</span>
              <span className="text-xl font-black text-emerald-700">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-emerald-950 p-5 text-white flex items-start gap-4">
        <ShieldCheck className="h-6 w-6 text-emerald-400 mt-1 shrink-0" />
        <div>
            <h5 className="font-bold text-[14px]">Thanh toán an toàn</h5>
            <p className="mt-1 text-xs text-emerald-100/60 leading-relaxed">Dữ liệu của bạn được mã hóa và bảo vệ. Chúng tôi sử dụng các giao thức bảo mật tiêu chuẩn ngành cho mọi giao dịch.</p>
        </div>
      </div>
    </div>
  );
}
