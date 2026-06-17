"use client";

import { Fragment, useState } from "react";
import Link from "next/link";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { ROUTES } from "@/lib/route.constants";

const STEPS = [
  { id: 1, label: "Information" },
  { id: 2, label: "Review & Submit" },
];

const BENEFITS = [
  "Reach 10,000+ active athletes",
  "Automated scheduling & payments",
  "Professional dashboard analytics",
];

// TODO: thay bằng dữ liệu thật từ bước 1 (context, store, hoặc query params)
// thay vì giá trị mock cố định dưới đây.
const MOCK_REVIEW_DATA = {
  fullName: "John Doe",
  stadiumName: "Wembley Stadium",
  stadiumAddress: "Olympic Way, Wembley, London HA9 0WS",
  email: "john@example.com",
  phone: "+1 (555) 000-0000",
};

function IconArrowLeft({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M19 12H5M11 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCheck({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 12.5l2.5 2.5 5-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPencil({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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
            {idx < STEPS.length - 1 && (
              <div className={`mx-2 h-px flex-1 ${step.id < currentStep ? "bg-emerald-600" : "bg-gray-200"}`} />
            )}
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

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
    </div>
  );
}

function WhyPitchProCard() {
  return (
    <div className="rounded-2xl bg-gray-900 p-6">
      <h3 className="text-base font-bold text-emerald-400">Why PitchPro?</h3>
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
        Elevate your facility to pro level.
      </p>
    </div>
  );
}

export default function HostRegistrationReviewPage() {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!agreed) return;
    setIsSubmitting(true);
    // TODO: gọi API thật ở đây (ví dụ useHostRegistration().submit(data))
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900">Host Registration</h1>
        <p className="mt-1 text-sm text-gray-500">
          Join our network of professional pitch owners and start managing your bookings with ease.
        </p>

        <Stepper currentStep={2} />

        {submitted ? (
          <div className="mt-8 flex flex-col items-center rounded-2xl border border-gray-100 bg-white px-8 py-16 text-center shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <IconCheck className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-gray-900">Application submitted</h2>
            <p className="mt-2 max-w-md text-sm text-gray-500">
              Thanks, {MOCK_REVIEW_DATA.fullName}. Our team will verify your facility and get back to
              you within 2 business days at {MOCK_REVIEW_DATA.email}.
            </p>
            <Link
              href={ROUTES.home}
              className="mt-6 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
            >
              Back to homepage
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Review */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Review Your Information</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Please confirm everything is correct before submitting.
                    </p>
                  </div>
                  <Link
                    href={ROUTES.ownerRegister}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    <IconPencil />
                    Edit
                  </Link>
                </div>

                <div className="mt-6 divide-y divide-gray-100">
                  <ReviewRow label="Full Name" value={MOCK_REVIEW_DATA.fullName} />
                  <ReviewRow label="Stadium Name" value={MOCK_REVIEW_DATA.stadiumName} />
                  <ReviewRow label="Stadium Address" value={MOCK_REVIEW_DATA.stadiumAddress} />
                  <ReviewRow label="Email Address" value={MOCK_REVIEW_DATA.email} />
                  <ReviewRow label="Phone Number" value={MOCK_REVIEW_DATA.phone} />
                </div>

                <label className="mt-6 flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600/30"
                  />
                  <span className="text-[13px] leading-snug text-gray-500">
                    I confirm that all information provided is accurate and I agree to the{" "}
                    <Link href="/terms" className="font-medium text-emerald-700 hover:underline">
                      Host Terms &amp; Conditions
                    </Link>
                    .
                  </span>
                </label>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                  <Link
                    href={ROUTES.ownerRegister}
                    className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 px-5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <IconArrowLeft />
                    Back
                  </Link>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!agreed || isSubmitting}
                    className="flex h-10 items-center gap-2 rounded-lg bg-emerald-700 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner />
                        Submitting…
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 lg:col-span-1">
              <WhyPitchProCard />
              <PromoImageCard />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}