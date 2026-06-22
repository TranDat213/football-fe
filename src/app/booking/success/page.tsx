'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronRight, Home, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-900">Awesome!</h1>
          <p className="text-gray-500 mt-3 text-lg">Your booking has been confirmed successfully. Get ready for the game!</p>
          
          <div className="mt-8 space-y-4">
            <Link href="/" className="block">
              <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold shadow-lg shadow-emerald-600/10">
                Back to Home <Home className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <Link href="/profile" className="block">
              <Button variant="outline" className="w-full h-12 border-gray-200 rounded-xl font-bold text-gray-700">
                View My Bookings <Calendar className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              A confirmation email has been sent to your inbox. 
              Please present your booking ID at the counter.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
