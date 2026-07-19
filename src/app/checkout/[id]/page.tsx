'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CheckoutSummary from '@/features/pitch/components/CheckoutSummary';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CreditCard, Wallet, Banknote } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const PAYMENT_METHODS = [
    { id: 'vnpay', name: 'VNPay QR / E-Wallet', icon: Wallet, description: 'Pay with VNPay, MoMo, or ShopeePay' },
    { id: 'credit', name: 'Credit / Debit Card', icon: CreditCard, description: 'Visa, Mastercard, JCB, AMEX' },
    { id: 'cash', name: 'Pay at Counter', icon: Banknote, description: 'Pay directly at the facility' },
];

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const [selectedMethod, setSelectedMethod] = useState('vnpay');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-8 lg:py-12">
        <Link 
            href={`/pitch/${params.id}`} 
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700 hover:text-emerald-800 transition-colors mb-6 group"
        >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Sửa đổi đặt sân
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8 uppercase tracking-tight">Thanh toán</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 items-start">
            {/* Payment & Details (Left) */}
            <div className="lg:col-span-3 space-y-8">
                <section className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Phương thức thanh toán</h2>
                    <div className="grid grid-cols-1 gap-3">
                        {PAYMENT_METHODS.map((method) => {
                            const isSelected = selectedMethod === method.id;
                            return (
                                <button
                                    key={method.id}
                                    onClick={() => setSelectedMethod(method.id)}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                                        isSelected 
                                            ? 'border-emerald-600 bg-emerald-50/40 shadow-sm' 
                                            : 'border-gray-100 bg-white hover:border-emerald-200'
                                    }`}
                                >
                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
                                        isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                        <method.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-bold ${isSelected ? 'text-emerald-950' : 'text-gray-900'}`}>{method.name}</h4>
                                        <p className="text-[11px] text-gray-500 mt-0.5">{method.description}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                                            isSelected ? 'border-emerald-600' : 'border-gray-200'
                                        }`}>
                                            {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <div className="rounded-3xl border border-gray-100 bg-white p-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 font-mono">Thông tin khách hàng</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Họ và tên</label>
                            <input type="text" defaultValue="Alex Johnson" className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm font-medium focus:outline-none" />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Số điện thoại</label>
                             <input type="text" defaultValue="090-xxx-xxxx" className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm font-medium focus:outline-none" />
                        </div>
                    </div>
                    <p className="mt-4 text-[11px] text-gray-400 italic">Thông tin này sẽ được sử dụng để xác nhận đặt sân và check-in.</p>
                </div>

                <Button className="w-full h-14 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-sm font-bold uppercase tracking-widest shadow-xl shadow-emerald-700/20 active:scale-[0.98] transition-transform">
                    Hoàn tất đặt sân & Thanh toán
                </Button>
            </div>

            {/* Sidebar Summary (Right) */}
            <div className="lg:col-span-2">
                <CheckoutSummary 
                    pitchName="San Siro Premium Turf"
                    location="72nd St, Ho Chi Minh City"
                    date="Monday, June 22, 2026"
                    timeSlot="18:00 - 19:30"
                    price={35.00}
                    fee={2.00}
                />
                
                <div className="mt-6 text-center">
                    <p className="text-[11px] text-gray-400">Bằng cách hoàn tất đặt sân này, bạn đồng ý với <Link href="#" className="hover:text-emerald-700 underline underline-offset-2">Điều khoản dịch vụ</Link> và <Link href="#" className="hover:text-emerald-700 underline underline-offset-2">Chính sách hoàn tiền</Link>.</p>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
