"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRegistrationData } from "../slice/ownerSlice";
import { RootState } from "@/store/store";
import { ROUTES } from "@/lib/route.constants";
import { useRouter } from "next/navigation";
import { OwnerRegisterFormData } from "../schema/user.schema";

// --- Icons ---
function IconArrowRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// --- Field Components ---
interface TextFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
}

function TextField({ label, name, type = "text", placeholder, value, onChange, error, className }: TextFieldProps) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-gray-900">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 ${
          error ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-emerald-600"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function TextAreaField({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-900">{label}</label>
      <textarea
        name={name}
        placeholder={placeholder}
        rows={3}
        value={value}
        onChange={onChange}
        className={`w-full resize-none rounded-lg border bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 ${
          error ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-emerald-600"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function OwnerRegisterForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const savedData = useSelector((state: RootState) => state.owner.registrationData);

  const [form, setForm] = useState<OwnerRegisterFormData>(savedData);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setRegistrationData(form));
    router.push(ROUTES.ownerReview);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">Host & Facility Details</h2>
      <p className="mt-1 text-sm text-gray-500">
        We need these details to verify your identity as a legal host.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextField
            label="First Name"
            name="firstName"
            placeholder="John"
            value={form.firstName}
            onChange={handleChange}
          />
          <TextField
            label="Last Name"
            name="lastName"
            placeholder="Doe"
            value={form.lastName}
            onChange={handleChange}
          />
        </div>

        <TextField
          label="Stadium Name"
          name="stadium_name"
          placeholder="Wembley Stadium"
          value={form.stadium_name}
          onChange={handleChange}
        />

        <TextAreaField
          label="Stadium Address"
          name="address"
          placeholder="Enter the full physical address of the facility"
          value={form.address}
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
          placeholder="0123456789"
          value={form.phone}
          onChange={handleChange}
          className="max-w-xs"
        />

        <div className="flex justify-end border-t border-gray-100 pt-5">
          <button
            type="submit"
            className="flex h-10 items-center gap-2 rounded-lg bg-emerald-700 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
          >
            Continue
            <IconArrowRight />
          </button>
        </div>
      </form>
    </div>
  );
}
