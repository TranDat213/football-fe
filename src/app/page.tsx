'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useGetPitchesQuery } from '@/features/pitch/api/pitchAPI';
import Link from 'next/link';
import { Loader2, MapPin, Star, ArrowRight, Users, Calendar, Check } from 'lucide-react';
// ... icons simplified/standardized ...

function VenueCard({ venue }: { venue: any }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-44 w-full">
        <img 
          src={venue.images?.[0]?.url || "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80"} 
          alt={venue.name} 
          className="h-full w-full object-cover" 
        />
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-emerald-900/85 px-2.5 py-1 text-xs font-semibold text-white">
          <Star className="h-3 w-3 text-amber-400 fill-current" />
          {venue.rating || 4.5}
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
          ${venue.price}/hr
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900">{venue.name}</h3>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            1.2 km
          </span>
        </div>
        <p className="mt-1.5 text-sm text-gray-500 line-clamp-1">{venue.description || 'No description'}</p>
        <Link href={`/pitch/${venue.id}`} className="mt-4 block">
          <button className="w-full rounded-lg bg-emerald-700 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800">
            Book Reservation
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: response, isLoading } = useGetPitchesQuery({ limit: 10 });
  const pitches = response?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />

      <main className="mx-auto max-w-7xl px-6 pb-16">
        {/* Hero */}
        <section className="relative mt-6 overflow-hidden rounded-3xl">
          <img
            src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1600&q=80"
            alt="Football pitch at night"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/85 via-gray-900/55 to-emerald-950/30" />

          <div className="relative px-6 py-20 text-center sm:px-12">
            <h1 className="mx-auto max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl">
              Find the perfect pitch for your next match.
            </h1>

            <div className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-xl sm:flex-row sm:items-center sm:gap-0 sm:divide-x sm:divide-gray-200 sm:rounded-full">
              <div className="flex flex-1 items-center gap-2 px-4 py-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by city or club"
                  className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <div className="flex flex-1 items-center gap-2 px-4 py-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Select date and time"
                  className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <button className="m-1 shrink-0 rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800">
                Search Now
              </button>
            </div>
          </div>
        </section>

        {/* Nearby Venues */}
        <section className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Nearby Venues</h2>
              <p className="mt-1 text-sm text-gray-500">Highly rated pitches available in your area</p>
            </div>
            <a
              href="#"
              className="flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              View all venues
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {isLoading ? (
            <div className="mt-12 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pitches.map((venue: any) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}
        </section>

        {/* Spontaneous Match + My Activity */}
        <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="relative col-span-1 overflow-hidden rounded-2xl bg-emerald-500 p-8 lg:col-span-2">
            <Users className="pointer-events-none absolute -bottom-4 right-0 h-40 w-40 text-emerald-400/40" />
            <div className="relative max-w-sm">
              <h3 className="text-2xl font-bold text-emerald-950">Spontaneous Match?</h3>
              <p className="mt-2 text-sm text-emerald-950/80">
                Book a slot or join in for instant play. No subscription needed for spontaneous bookings.
              </p>
              <button className="mt-5 rounded-lg bg-emerald-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900">
                Find Open Slots
              </button>
            </div>
          </div>

          <div className="col-span-1 rounded-2xl bg-indigo-50 p-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-indigo-500">
              <Calendar className="h-4 w-4" />
            </div>
            <h4 className="mt-4 font-semibold text-gray-900">My Activity</h4>
            <p className="mt-1 text-sm text-gray-500">You&apos;ve booked services this month</p>

            <div className="mt-4 rounded-xl bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">12</span>
                <Check className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="mt-1 text-xs text-gray-500">Confirmed reservations</p>
              <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100">
                <div className="h-1.5 w-3/5 rounded-full bg-emerald-500" />
              </div>
              <p className="mt-2 text-xs text-gray-400">8 more to reach this month&apos;s goal</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}