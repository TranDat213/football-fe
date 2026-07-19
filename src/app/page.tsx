'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useGetPitchesQuery, useGetPitchCategoryQuery } from '@/features/pitch/api/pitchAPI';
import Link from 'next/link';
import { Loader2, MapPin, Star, ArrowRight, Users, Calendar } from 'lucide-react';
import { Suspense } from 'react';
import { Pagination } from '@/features/admin/component/Pagination';

import type { CategoryOption } from '@/components/filter/CategoryFilter';
import { useFilters } from '@/hooks/useFilter';
import { FieldFilterBar } from '@/features/pitch/components/FieldfilterBar';

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
          VNĐ{venue.price}/hr
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
            Đặt chỗ
          </button>
        </Link>
      </div>
    </div>
  );
}

function NearbyVenues() {
  const limit = 10;
  const f = useFilters();

  const { data: categoryResponse } = useGetPitchCategoryQuery();
  // Giả định PitchCategory có { id, name } — chỉnh lại field name nếu khác
  const categories: CategoryOption[] = (categoryResponse?.data ?? []).map((c: any) => ({
    value: c.id,
    label: c.name,
  }));

  const { data: response, isLoading } = useGetPitchesQuery({
    page: f.filters.page,
    limit,
    keyword: f.filters.keyword || undefined,
    category: f.filters.category || undefined,
    province: f.filters.province || undefined,
    district: f.filters.district || undefined,
    minPrice: f.filters.minPrice ? Number(f.filters.minPrice) * 1000 : undefined,
    maxPrice: f.filters.maxPrice ? Number(f.filters.maxPrice) * 1000 : undefined,
    sortBy: f.filters.sortBy || undefined,
    sortOrder: f.filters.sortBy ? f.filters.sortOrder : undefined,
  });

  // field.controller.ts trả về { message, ...toPaginatedResult(...) }
  // => { message, data, pagination } cùng cấp, không có lớp bọc nào khác.
  const pitches = response?.data ?? [];
  const pagination = response?.pagination;

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Sân bóng gần đây</h2>
          <p className="mt-1 text-sm text-gray-500">Các khu đất có đánh giá cao hiện có sẵn tại khu vực của bạn</p>
        </div>
       
      </div>

      <FieldFilterBar
        f={f}
        categories={categories}
        // TODO: gắn nguồn dữ liệu tỉnh/thành (API hoặc constants VN) khi có
        provinces={[]}
        className="mt-4"
      />

      {isLoading ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : pitches.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-200 py-16 text-center text-sm text-gray-500">
          Không tìm thấy sân nào phù hợp với bộ lọc hiện tại.
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pitches.map((venue: any) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
          {/* NOTE: trước đây <Pagination> nằm lẫn trong grid và itemsCount dùng
              pitches.length (số item trên trang hiện tại). Đã tách ra ngoài grid
              và đổi sang pagination.total từ BE — kiểm tra lại prop itemsCount
              của component Pagination có đúng nghĩa "tổng số item" không. */}
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={f.filters.page}
              itemsCount={pagination?.total ?? pitches.length}
              limit={limit}
              onPageChange={f.setPage}
            />
          </div>
        </>
      )}
    </section>
  );
}

export default function Home() {
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
              Tìm sân bóng hoàn hảo cho trận đấu tiếp theo của bạn.
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/80">
              Dùng bộ lọc bên dưới để tìm đúng sân, đúng khu vực, đúng tầm giá.
            </p>
          </div>
        </section>

        {/* Nearby Venues — bọc Suspense vì useFilters dùng useSearchParams */}
        <Suspense
          fallback={
            <div className="mt-12 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          }
        >
          <NearbyVenues />
        </Suspense>

        {/* Spontaneous Match + My Activity */}
        <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="relative col-span-1 overflow-hidden rounded-2xl bg-emerald-500 p-8 lg:col-span-2">
            <Users className="pointer-events-none absolute -bottom-4 right-0 h-40 w-40 text-emerald-400/40" />
            <div className="relative max-w-sm">
              <h3 className="text-2xl font-bold text-emerald-950">Trận đấu ngẫu hứng?</h3>
              <p className="mt-2 text-sm text-emerald-950/80">
                Đặt một chỗ hoặc tham gia để chơi ngay lập tức. Không cần đăng ký cho các đặt chỗ ngẫu hứng.
              </p>
              <Link href="/casual-matches/create" className="mt-5 inline-flex rounded-lg bg-emerald-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900">
                Tạo trận ngẫu hứng
              </Link>
            </div>
          </div>

          <div className="col-span-1 rounded-2xl bg-indigo-50 p-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-indigo-500">
              <Calendar className="h-4 w-4" />
            </div>
            <h4 className="mt-4 font-semibold text-gray-900">Hoạt động của tôi</h4>
            <p className="mt-1 text-sm text-gray-500">Bạn đã đặt dịch vụ trong tháng này</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}