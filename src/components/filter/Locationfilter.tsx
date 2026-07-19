'use client';

export interface LocationOption {
  value: string;
  label: string;
}

interface LocationFilterProps {
  province: string;
  district: string;
  onChange: (province: string, district: string) => void;
  provinces: LocationOption[];
  /** Danh sách quận/huyện tương ứng với province đang chọn — lọc từ component cha */
  districts?: LocationOption[];
  className?: string;
}

export function LocationFilter({
  province,
  district,
  onChange,
  provinces,
  districts = [],
  className = '',
}: LocationFilterProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <select
        value={province}
        onChange={(e) => onChange(e.target.value, '')}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      >
        <option value="">Tất cả tỉnh/thành</option>
        {provinces.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
      <select
        value={district}
        onChange={(e) => onChange(province, e.target.value)}
        disabled={!province || districts.length === 0}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
      >
        <option value="">Tất cả quận/huyện</option>
        {districts.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>
    </div>
  );
}