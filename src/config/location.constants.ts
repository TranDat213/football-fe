import type { LocationOption } from '@/components/filter/Locationfilter';

export const HCMC_PROVINCE: LocationOption = { value: 'Hồ Chí Minh', label: 'TP. Hồ Chí Minh' };

export const PROVINCES: LocationOption[] = [HCMC_PROVINCE];

export const HCMC_DISTRICTS: LocationOption[] = [
  { value: 'Quận 1', label: 'Quận 1' },
  { value: 'Quận 3', label: 'Quận 3' },
  { value: 'Quận 4', label: 'Quận 4' },
  { value: 'Quận 5', label: 'Quận 5' },
  { value: 'Quận 6', label: 'Quận 6' },
  { value: 'Quận 7', label: 'Quận 7' },
  { value: 'Quận 8', label: 'Quận 8' },
  { value: 'Quận 10', label: 'Quận 10' },
  { value: 'Quận 11', label: 'Quận 11' },
  { value: 'Quận 12', label: 'Quận 12' },
  { value: 'Bình Thạnh', label: 'Bình Thạnh' },
  { value: 'Gò Vấp', label: 'Gò Vấp' },
  { value: 'Phú Nhuận', label: 'Phú Nhuận' },
  { value: 'Tân Bình', label: 'Tân Bình' },
  { value: 'Tân Phú', label: 'Tân Phú' },
  { value: 'Bình Tân', label: 'Bình Tân' },
  { value: 'Thủ Đức', label: 'Thủ Đức (TP)' },
  { value: 'Bình Chánh', label: 'Bình Chánh' },
  { value: 'Hóc Môn', label: 'Hóc Môn' },
  { value: 'Củ Chi', label: 'Củ Chi' },
  { value: 'Nhà Bè', label: 'Nhà Bè' },
  { value: 'Cần Giờ', label: 'Cần Giờ' },
];

/** Trả về danh sách quận dựa trên province đang chọn. */
export function getDistrictsForProvince(province: string): LocationOption[] {
  if (province === HCMC_PROVINCE.value) return HCMC_DISTRICTS;
  return [];
}
