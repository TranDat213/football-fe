'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/features/user/types/user.type';
import { useUpdateProfile, UpdateProfileValues } from '@/features/user/hooks/useUpdateProfile';

interface PersonalInfoFormProps {
  profile: UserProfile;
}

function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  icon,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-lg border border-gray-200 bg-white py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${icon ? 'pl-9 pr-4' : 'px-4'}`}
        />
      </div>
    </div>
  );
}

export default function PersonalInfoForm({ profile }: PersonalInfoFormProps) {
  const { submit, isLoading, success, error } = useUpdateProfile(profile);

  const [form, setForm] = useState<UpdateProfileValues>({
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    username: profile.username ?? '',
    email: profile.email ?? '',
    phone: profile.phone ?? '',
  });

  // Sync form if profile refreshes from outside
  useEffect(() => {
    setForm({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      username: profile.username ?? '',
      email: profile.email ?? '',
      phone: profile.phone ?? '',
    });
  }, [profile]);

  const handleChange = (field: keyof UpdateProfileValues) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Personal Information</h3>
          <p className="mt-0.5 text-xs text-gray-500">Update your personal details below.</p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-400">
          <svg className="h-3.5 w-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Secure form
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          id="firstName"
          label="First Name"
          value={form.firstName}
          onChange={handleChange('firstName')}
        />
        <InputField
          id="lastName"
          label="Last Name"
          value={form.lastName}
          onChange={handleChange('lastName')}
        />
        <InputField
          id="username"
          label="Username"
          value={form.username}
          onChange={handleChange('username')}
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          }
        />
        <InputField
          id="email"
          label="Email Address"
          type="email"
          value={form.email}
          onChange={handleChange('email')}
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 8 10 6 10-6"/>
            </svg>
          }
        />
        <InputField
          id="phone"
          label="Phone Number"
          type="tel"
          value={form.phone}
          onChange={handleChange('phone')}
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7 12.7 12.7 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.8.7A2 2 0 0 1 22 16.9z"/>
            </svg>
          }
        />
      </div>

      {/* Feedback */}
      {success && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 border border-emerald-200">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
          Profile updated successfully!
        </div>
      )}
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 8v4m0 4h.01"/>
          </svg>
          {error}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
              </svg>
              Saving…
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}
