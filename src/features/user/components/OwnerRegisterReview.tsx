"use client";

import { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useOwnerRegister } from "../hooks/useOwnerRegister";
import { ROUTES } from "@/lib/route.constants";

// --- Icons ---
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

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
    </div>
  );
}

export default function OwnerRegisterReview() {
  const { registrationData: data } = useSelector((state: RootState) => state.owner);
  const { registerOwner, isLoading } = useOwnerRegister();
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!agreed) return;
    try {
        await registerOwner(data);
        setSubmitted(true);
    } catch (err) {
        // useOwnerRegister handles toasts and errors
    }
  };

  if (submitted) {
    return (
      <div className="mt-8 flex flex-col items-center rounded-2xl border border-gray-100 bg-white px-8 py-16 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <IconCheck className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-gray-900">Application submitted</h2>
        <p className="mt-2 max-w-md text-sm text-gray-500">
          Thanks, {data.firstName} {data.lastName}. Our team will verify your facility and get back to
          you within 2 business days at {data.email}.
        </p>
        <Link
          href={ROUTES.home}
          className="mt-6 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
        >
          Back to homepage
        </Link>
      </div>
    );
  }

  return (
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
        <ReviewRow label="Full Name" value={`${data.firstName} ${data.lastName}`} />
        <ReviewRow label="Stadium Name" value={data.stadium_name} />
        <ReviewRow label="Stadium Address" value={data.address} />
        <ReviewRow label="Email Address" value={data.email} />
        <ReviewRow label="Phone Number" value={data.phone} />
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
          disabled={!agreed || isLoading}
          className="flex h-10 items-center gap-2 rounded-lg bg-emerald-700 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
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
  );
}
