"use client";

import { Fragment } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OwnerRegisterForm from "@/features/user/components/OwnerRegisterForm";

const STEPS = [
  { id: 1, label: "Information" },
  { id: 2, label: "Review & Submit" },
];

const BENEFITS = [
  "Reach 10,000+ active athletes",
  "Automated scheduling & payments",
  "Professional dashboard analytics",
];

function IconCheck({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 12.5l2.5 2.5 5-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="mt-8">
      <div className="flex items-center">
        {STEPS.map((step, idx) => (
          <Fragment key={step.id}>
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                step.id <= currentStep ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400"
              }`}
            >
              {step.id}
            </div>
            {idx < STEPS.length - 1 && <div className="mx-2 h-px flex-1 bg-gray-200" />}
          </Fragment>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs">
        {STEPS.map((step) => (
          <span
            key={step.id}
            className={step.id === currentStep ? "font-medium text-gray-900" : "text-gray-400"}
          >
            {step.id}. {step.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function WhyPitchProCard() {
  return (
    <div className="rounded-2xl bg-gray-900 p-6">
      <h3 className="text-base font-bold text-emerald-400">Tại sao chọn Chân Đèn Club</h3>
      <ul className="mt-4 space-y-3">
        {BENEFITS.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2.5">
            <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <span className="text-[13px] text-gray-300">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PromoImageCard() {
  return (
    <div className="relative h-56 overflow-hidden rounded-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80"
        alt="Football pitch at night"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/80" />
      <p className="absolute bottom-4 left-4 right-4 text-[15px] font-bold leading-snug text-emerald-400">
        Nâng tầm cơ sở của bạn lên đẳng cấp chuyên nghiệp.
      </p>
    </div>
  );
}

export default function HostRegistrationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900">Đăng ký chủ sân</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tham gia mạng lưới chủ sân chuyên nghiệp của chúng tôi và bắt đầu quản lý đặt chỗ của bạn một cách dễ dàng.
        </p>

        <Stepper currentStep={1} />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <OwnerRegisterForm />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <WhyPitchProCard />
            <PromoImageCard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
