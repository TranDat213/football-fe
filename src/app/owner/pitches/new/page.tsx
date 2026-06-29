import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FootballFieldStepper from '@/features/pitch/components/FootballFieldStepper';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddPitchPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">

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
              <h1 className="text-2xl font-bold text-gray-900">Thêm sân mới</h1>
              <p className="mt-1 text-sm text-gray-500">Hãy cung cấp thông tin chi tiết về sân bóng đá của bạn để bắt đầu.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <FootballFieldStepper />
          </div>

          {/* Quick Support */}
          <div className="mt-12 p-6 rounded-2xl border-2 border-emerald-900/5 bg-emerald-50/50 flex flex-col md:flex-row items-center gap-6">
            <div className="p-3 rounded-xl bg-white shadow-sm ring-1 ring-emerald-900/5">
                <span className="text-xl">💡</span>
            </div>
            <div className="flex-1 text-center md:text-left">
                <h4 className="font-bold text-gray-900">Cần trợ giúp để đăng ký sân của bạn?</h4>
                <p className="mt-1 text-[13px] text-gray-500">Hãy xem <Link href="#" className="text-emerald-700 font-semibold hover:underline">Hướng dẫn đăng ký</Link> của chúng tôi hoặc liên hệ với nhóm hỗ trợ của chúng tôi để có buổi chụp ảnh chuyên nghiệp.</p>
            </div>
            <button className="text-xs font-bold uppercase tracking-widest text-emerald-700 hover:text-emerald-800">
                Liên hệ hỗ trợ
            </button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
