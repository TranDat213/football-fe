'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PitchGallery from '@/features/pitch/components/PitchGallery';
import PitchInfo from '@/features/pitch/components/PitchInfo';
import BookingScheduler from '@/features/booking/components/schedule/BookingScheduler';
import { useParams } from 'next/navigation';
import { useGetPitchByIdQuery } from '@/features/pitch/api/pitchAPI';

export default function PitchDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: response, isLoading, error } = useGetPitchByIdQuery(id);

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  if (error || !response)
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Error loading pitch details
      </div>
    );

  const pitch = response.data;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Main Content (Left) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-12">
            <PitchGallery images={pitch.images.map((img) => img.url)} />

            <div className="hidden lg:block">
              <PitchInfo
                name={pitch.name}
                rating={pitch.rating || 4.5}
                reviewCount={100} // Mock review count as it's not in API yet
                address={pitch.address}
                description={pitch.description}
              />
            </div>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 border-l-4 border-emerald-600 pl-4">
                Thông tin sân
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {pitch.description ||
                  'Không có mô tả cho sân này.'}
              </p>
            </section>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-8">
            <div className="lg:hidden">
              <PitchInfo
                name={pitch.name}
                rating={pitch.rating || 4.5}
                reviewCount={100}
                address={pitch.address}
                description={pitch.description}
              />
            </div>

            <BookingScheduler
 pitchId={id}
 yards={pitch.yards}
/>

            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <h4 className="text-sm font-bold text-gray-900">
                Sức khỏe & An toàn
              </h4>
              <ul className="mt-3 space-y-2 text-xs text-gray-500">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Thường xuyên khử trùng bề mặt
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Có sẵn bộ sơ cứu tại chỗ
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
