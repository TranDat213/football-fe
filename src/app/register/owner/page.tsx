"use client";

import { ChangeEvent, FormEvent, Fragment, useState } from "react";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { ROUTES } from "@/lib/route.constants";
import { useRouter } from "next/navigation";

interface HostForm {
  fullName: string;
  stadiumName: string;
  stadiumAddress: string;
  email: string;
  phone: string;
}

const initialForm: HostForm = {
  fullName: "",
  stadiumName: "",
  stadiumAddress: "",
  email: "",
  phone: "",
};

const STEPS = [
  { id: 1, label: "Information" },
  { id: 2, label: "Review & Submit" },
];

const BENEFITS = [
  "Reach 10,000+ active athletes",
  "Automated scheduling & payments",
  "Professional dashboard analytics",
];

function IconArrowRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

interface TextFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

function TextField({ label, name, type = "text", placeholder, value, onChange, className }: TextFieldProps) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-gray-900">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
      />
    </div>
  );
}

function TextAreaField({
  label,
  name,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-900">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
      />
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

export default function HostRegistrationPage() {

    const router = useRouter();

  const [form, setForm] = useState<HostForm>(initialForm);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: nối API thật khi sẵn sàng, hiện tại chỉ mock chuyển sang bước 2
    console.log("Host registration step 1:", form);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900">Host Registration</h1>
        <p className="mt-1 text-sm text-gray-500">
          Join our network of professional pitch owners and start managing your bookings with ease.
        </p>

        <Stepper currentStep={1} />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Host & Facility Details</h2>
              <p className="mt-1 text-sm text-gray-500">
                We need these details to verify your identity as a legal host.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <TextField
                  label="Full Name"
                  name="fullName"
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={handleChange}
                />
                <TextField
                  label="Stadium Name"
                  name="stadiumName"
                  placeholder="Wembley Stadium"
                  value={form.stadiumName}
                  onChange={handleChange}
                />
                <TextAreaField
                  label="Stadium Address"
                  name="stadiumAddress"
                  placeholder="Enter the full physical address of the facility"
                  value={form.stadiumAddress}
                  onChange={handleChange}
                />
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                <TextField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={handleChange}
                  className="max-w-xs"
                />

                <div className="flex justify-end border-t border-gray-100 pt-5">
                  <button
                    type="button"
                    onClick={() => router.push(ROUTES.ownerReview)}
                    className="flex h-10 items-center gap-2 rounded-lg bg-emerald-700 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
                  >
                    Continue
                    <IconArrowRight />
                  </button>
                </div>
              </form>
            </div>
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