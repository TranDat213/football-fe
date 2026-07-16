import React from "react";
import Link from "next/link";
import { Calendar, MapPin, DollarSign, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StructuredRendererProps {
  metadata?: {
    type: string;
    items: any[];
  } | null;
}

const FootballFieldList = ({ items }: { items: any[] }) => {
  return (
    <div className="flex flex-col gap-3 mt-3 w-full">
      {items.map((field) => (
        <div key={field.id} className="flex gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-emerald-600/35 transition-all duration-200 group overflow-hidden">
          {field.image && (
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden shrink-0">
              <img src={field.image} alt={field.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            </div>
          )}
          <div className="flex flex-col justify-between flex-1 min-w-0">
            <div>
              <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-emerald-700 transition-colors">{field.name}</h4>
              <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-1">
                <MapPin size={11} className="shrink-0 text-emerald-600" />
                <span className="line-clamp-1">{field.district} {field.address ? `- ${field.address}` : ''}</span>
              </div>
              {field.minPrice !== undefined && (
                <div className="text-[11px] font-semibold text-emerald-700 mt-1.5">
                  Giá từ: {field.minPrice.toLocaleString('vi-VN')} VNĐ/giờ
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <Link href={`/pitch/${field.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-[11px] h-8 border-emerald-600 text-emerald-700 hover:bg-emerald-50 py-1 px-2">
                  Xem chi tiết
                </Button>
              </Link>
              <Link href={`/pitch/${field.id}`} className="flex-1">
                <Button size="sm" className="w-full text-[11px] h-8 bg-emerald-600 hover:bg-emerald-700 text-white py-1 px-2">
                  Đặt sân
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const BookingList = ({ items }: { items: any[] }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-800">Đã xác nhận</span>;
      case "PENDING":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">Chờ thanh toán</span>;
      case "CANCELLED":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-800">Đã hủy</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-3 w-full">
      {items.map((booking) => (
        <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{booking.fieldName}</h4>
            {getStatusBadge(booking.status)}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] text-gray-600">
            <div className="flex items-center gap-1.5">
              <Calendar size={11} className="text-gray-400" />
              <span>{booking.bookingDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={11} className="text-gray-400" />
              <span>{booking.startTime} - {booking.endTime}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
            <span className="text-[10px] text-gray-400 font-mono">ID: {booking.id.substring(0, 8)}...</span>
            <Link href={`/booking/${booking.id}`}>
              <Button size="sm" variant="ghost" className="h-7 text-[11px] text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 px-2 py-1 flex items-center">
                Chi tiết đặt sân <ArrowRight size={11} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

const CasualMatchList = ({ items }: { items: any[] }) => {
  return (
    <div className="flex flex-col gap-3 mt-3 w-full">
      {items.map((match) => (
        <div key={match.id} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group">
          <div className="absolute right-0 top-0 bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-bl-lg">
            Đang mở
          </div>
          <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 pr-14 group-hover:text-emerald-700 transition-colors">
            {match.title || `Giao lưu đá ghép - ${match.fieldName}`}
          </h4>
          <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{match.fieldName}</p>
          
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-2.5 text-[11px] text-gray-600">
            <div className="flex items-center gap-1.5">
              <Calendar size={11} className="text-gray-400" />
              <span>{match.matchDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={11} className="text-gray-400" />
              <span>{match.startTime} - {match.endTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={11} className="text-gray-400" />
              <span>Slot: <strong>{match.currentPlayers}/{match.maxPlayers}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign size={11} className="text-emerald-600" />
              <span className="text-emerald-700 font-semibold">{match.slotPrice.toLocaleString('vi-VN')}đ / slot</span>
            </div>
          </div>

          <div className="flex gap-2 justify-between items-center mt-3 pt-3 border-t border-gray-100">
            {match.level && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold uppercase">
                {match.level}
              </span>
            )}
            <Link href={`/casual-matches/${match.id}`} className="ml-auto">
              <Button size="sm" className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1">
                Xem trận ghép
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export const StructuredRenderer = React.memo(({ metadata }: StructuredRendererProps) => {
  if (!metadata || !metadata.items || metadata.items.length === 0) {
    return null;
  }

  switch (metadata.type) {
    case "football_fields":
      return <FootballFieldList items={metadata.items} />;
    case "bookings":
      return <BookingList items={metadata.items} />;
    case "casual_matches":
      return <CasualMatchList items={metadata.items} />;
    default:
      return null;
  }
});

StructuredRenderer.displayName = "StructuredRenderer";
