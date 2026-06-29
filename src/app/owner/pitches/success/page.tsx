'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CheckCircle2, ClipboardList, ArrowRight, PlusCircle } from 'lucide-react';

export default function PitchSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">
          {/* Card */}
          <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-sm text-center space-y-6">

            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center ring-8 ring-emerald-50/60">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 stroke-[1.5]" />
              </div>
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Gửi yêu cầu thành công!</h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                Sân bóng của bạn đã được ghi nhận và đang chờ quản trị viên xét duyệt.
                Chúng tôi sẽ thông báo cho bạn sớm nhất có thể.
              </p>
            </div>

            {/* Status badge */}
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Đang chờ duyệt
            </div>

            {/* Steps */}
            <div className="text-left rounded-2xl bg-gray-50 border border-gray-100 p-5 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">Các bước tiếp theo</p>
              {[
                'Quản trị viên xem xét thông tin sân bóng của bạn',
                'Bạn nhận được thông báo khi sân được duyệt hoặc cần chỉnh sửa',
                'Sân được hiển thị công khai và bắt đầu nhận lượt đặt sân',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-600">{step}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href="/owner/pitches"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 h-12 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ClipboardList className="w-4 h-4" />
                Sân của tôi
              </Link>
              <Link
                href="/owner/pitch/add"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 h-12 text-sm font-bold transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Thêm sân mới
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Support hint */}
          <div className="mt-6 p-5 rounded-2xl border-2 border-emerald-900/5 bg-emerald-50/50 flex items-center gap-4">
            <span className="text-xl shrink-0">💡</span>
            <p className="text-[13px] text-gray-500">
              Cần hỗ trợ?{' '}
              <Link href="#" className="text-emerald-700 font-semibold hover:underline">
                Xem hướng dẫn đăng sân
              </Link>{' '}
              hoặc liên hệ đội ngũ hỗ trợ của chúng tôi.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}