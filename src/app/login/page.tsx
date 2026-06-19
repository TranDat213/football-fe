'use client';

import Link from 'next/link';
import { useState } from 'react';

import SignInForm from '@/features/auth/components/signInForm';
import ForgotPasswordForm from '@/features/auth/components/forgotPasswordForm';

export default function SignInPage() {
  const [showForgot, setShowForgot] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F9F7] flex flex-col">
      <div className="flex-1 grid lg:grid-cols-2">
        {/* ─── Cột trái: Marketing ─────────────────────────── */}
        <div className="hidden lg:flex flex-col justify-center px-16 py-12">
          <div className="max-w-[420px]">
            <span className="text-[15px] font-bold text-[#40916C] tracking-tight">
              ChanDenclub
            </span>

            <h1 className="mt-4 text-[34px] font-bold text-[#1B3A2D] leading-[1.15]">
              Chào mừng <span className="text-[#40916C]">trở lại.</span>
            </h1>

            <p className="mt-3 text-[14px] text-[#6B8C7A] leading-relaxed">
              Đăng nhập để tiếp tục đặt sân, theo dõi giải đấu và kết nối với
              đội của bạn. Trận đấu tiếp theo đang chờ.
            </p>

            <div className="relative mt-8 rounded-2xl overflow-hidden h-[220px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=900&q=80"
                alt="Sân vận động về đêm"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#52D98B] opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#52D98B]" />
                </span>
                <span className="text-[11px] font-semibold text-white tracking-wide">
                  24 trận đang diễn ra
                </span>
              </div>

              <div className="absolute bottom-4 left-4 flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-white border-2 border-black/20" />
                  <div className="w-7 h-7 rounded-full bg-[#40916C] border-2 border-black/20" />
                  <div className="w-7 h-7 rounded-full bg-[#1B3A2D] border-2 border-black/20" />
                </div>
                <span className="text-[13px] font-semibold text-white">
                  Hơn 10.000+ người chơi đang hoạt động
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Cột phải: Form ──────────────────────────────── */}
        <div className="flex items-center justify-center px-4 py-12 sm:px-6">
          <div className="w-full max-w-[440px]">
            {/* Logo — mobile only */}
            <div className="flex lg:hidden items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-lg bg-[#40916C] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z"
                    fill="white"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <span className="text-[15px] font-semibold text-[#1B3A2D] tracking-tight">
                Chân đèn club
              </span>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl border border-[#E2EDE8] px-8 py-9 shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
              {showForgot ? (
                <ForgotPasswordForm onClose={() => setShowForgot(false)} />
              ) : (
                <SignInForm onForgot={() => setShowForgot(true)} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E2EDE8] bg-white px-6 py-5 lg:px-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-[#9CB8A9]">
          <span>© 2026 Chân đèn club. Quản lý sân chuyên nghiệp.</span>
          <div className="flex items-center gap-5">
            <Link href="/support" className="hover:text-[#40916C]">Hỗ trợ</Link>
            <Link href="/terms" className="hover:text-[#40916C]">Điều khoản</Link>
            <Link href="/privacy" className="hover:text-[#40916C]">Bảo mật</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}