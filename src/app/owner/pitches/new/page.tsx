import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OwnerSidebar from '@/components/layout/OwnerSidebar';
import PitchForm from '@/features/pitch/components/PitchForm';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddPitchPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        {/* Sidebar */}
        <OwnerSidebar />

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <Link 
            href="/owner/pitches" 
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700 hover:text-emerald-800 transition-colors mb-6 group"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to My Pitches
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Pitch</h1>
              <p className="mt-1 text-sm text-gray-500">Provide details about your football facility to start receiving bookings.</p>
            </div>
            <div className="hidden sm:block text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Step 1 of 2</p>
                <div className="mt-2 h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-emerald-600 rounded-full" />
                </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <PitchForm />
          </div>

          {/* Quick Support */}
          <div className="mt-12 p-6 rounded-2xl border-2 border-emerald-900/5 bg-emerald-50/50 flex flex-col md:flex-row items-center gap-6">
            <div className="p-3 rounded-xl bg-white shadow-sm ring-1 ring-emerald-900/5">
                <span className="text-xl">💡</span>
            </div>
            <div className="flex-1 text-center md:text-left">
                <h4 className="font-bold text-gray-900">Need help listing your pitch?</h4>
                <p className="mt-1 text-[13px] text-gray-500">Check out our <Link href="#" className="text-emerald-700 font-semibold hover:underline">Listing Guide</Link> or contact our support team for a professional photography session.</p>
            </div>
            <button className="text-xs font-bold uppercase tracking-widest text-emerald-700 hover:text-emerald-800">
                Contact Support
            </button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
