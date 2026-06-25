'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  MapPin, 
  DollarSign, 
  Users, 
  Type, 
  FileText, 
  ShieldCheck,
  Plus
} from 'lucide-react';

const FACILITIES = [
  'Indoor', 'Floodlights', 'Changing Rooms', 'Showers', 
  'Parking', 'Water Dispenser', 'Wifi', 'Lounge'
];

export default function PitchForm() {
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  const toggleFacility = (facility: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facility) 
        ? prev.filter(f => f !== facility) 
        : [...prev, facility]
    );
  };

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      {/* Image Upload Placeholder */}
      <div className="space-y-3">
        <label className="text-sm font-bold uppercase tracking-wider text-gray-400">Ảnh sân</label>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <button className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50 flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all group">
            <Camera className="h-6 w-6 text-gray-400 group-hover:text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Thêm ảnh</span>
          </button>
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-square rounded-2xl bg-gray-100 border border-gray-100" />
          ))}
        </div>
        <p className="text-[11px] text-gray-400 italic">Khuyến nghị: 1200x800px, tối đa 5MB cho mỗi hình ảnh.</p>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
            <Type className="h-3.5 w-3.5" /> Tên sân
          </label>
          <input
            type="text"
            placeholder="e.g. San Siro Premium"
            className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium transition-all focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/5 ring-0"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
            <MapPin className="h-3.5 w-3.5" /> Địa chỉ
          </label>
          <input
            type="text"
            placeholder="Địa chỉ hoặc Quận"
            className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium transition-all focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/5 ring-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="space-y-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          <label className="flex items-center gap-2">
            <DollarSign className="h-3.5 w-3.5" /> Giá / Giờ
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="35"
              className="w-full rounded-xl border border-gray-100 bg-white py-3 pl-8 pr-4 text-sm font-medium transition-all focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/5 ring-0"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">VNĐ</span>
          </div>
        </div>
        <div className="space-y-2 text-xs font-bold uppercase tracking-widest text-gray-500 text-end">
          <label className="flex items-center gap-2 justify-end">
            <Users className="h-3.5 w-3.5" /> Sức chứa
          </label>
          <select className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium transition-all focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/5 ring-0 appearance-none">
            <option>5v5</option>
            <option>7v7</option>
            <option>11v11</option>
          </select>
        </div>
         <div className="space-y-2 text-xs font-bold uppercase tracking-widest text-gray-500 text-end">
          <label className="flex items-center gap-2 justify-end">
            <Plus className="h-3.5 w-3.5" /> Trạng thái
          </label>
          <select className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium transition-all focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/5 ring-0 appearance-none">
            <option>Hoạt động</option>
            <option>Ẩn</option>
            <option>Bảo trì</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          <FileText className="h-3.5 w-3.5" /> Mô tả
        </label>
        <textarea
          rows={4}
          placeholder="Mô tả sân của bạn, chất lượng sân và các ưu đãi đặc biệt..."
          className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium transition-all focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/5 ring-0 resize-none"
        />
      </div>

      {/* Facilities */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          <ShieldCheck className="h-3.5 w-3.5" /> Tiện ích
        </label>
        <div className="flex flex-wrap gap-2">
          {FACILITIES.map((facility) => {
            const isSelected = selectedFacilities.includes(facility);
            return (
              <button
                key={facility}
                type="button"
                onClick={() => toggleFacility(facility)}
                className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
                  isSelected 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/10' 
                    : 'bg-white border-gray-100 text-gray-500 hover:border-emerald-600 hover:text-emerald-600'
                }`}
              >
                {facility}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
        <Button variant="ghost" className="rounded-xl px-8 h-12 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-900">
          Hủy
        </Button>
        <Button className="rounded-xl bg-emerald-700 hover:bg-emerald-800 px-12 h-12 text-sm font-bold shadow-lg shadow-emerald-700/10 active:scale-95 transition-all">
          Lưu thông tin sân
        </Button>
      </div>
    </form>
  );
}
