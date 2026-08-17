import type {
  CasualMatchSkillLevel,
  CasualMatchStatus,
  CasualMatchTeamMode,
  CasualMatchVisibility,
} from '../types/casual-match.types';

export const statusLabels: Record<CasualMatchStatus, string> = {
  OPEN: 'Đang mở',
  FULL: 'Đã đủ',
  CLOSED: 'Đã đóng',
  CANCELLED: 'Đã huỷ',
  STARTED: 'Đang diễn ra',
  FINISHED: 'Đã kết thúc',
};

export const statusColors: Record<CasualMatchStatus, { active: string; inactive: string }> = {
  OPEN:      { active: 'bg-emerald-600 text-white',   inactive: 'border border-emerald-300 text-emerald-700 hover:bg-emerald-50' },
  FULL:      { active: 'bg-blue-600 text-white',      inactive: 'border border-blue-300 text-blue-700 hover:bg-blue-50' },
  STARTED:   { active: 'bg-amber-500 text-white',     inactive: 'border border-amber-300 text-amber-700 hover:bg-amber-50' },
  FINISHED:  { active: 'bg-gray-600 text-white',      inactive: 'border border-gray-300 text-gray-600 hover:bg-gray-50' },
  CLOSED:    { active: 'bg-slate-600 text-white',     inactive: 'border border-slate-300 text-slate-600 hover:bg-slate-50' },
  CANCELLED: { active: 'bg-red-500 text-white',       inactive: 'border border-red-300 text-red-600 hover:bg-red-50' },
};

export const visibilityLabels: Record<CasualMatchVisibility, string> = {
  PUBLIC: 'Công khai',
  PRIVATE: 'Riêng tư',
};

export const teamModeLabels: Record<CasualMatchTeamMode, string> = {
  NO_TEAM: 'Không chia đội',
  OPTIONAL_TEAM: 'Có thể chọn đội',
  REQUIRED_TEAM: 'Bắt buộc chọn đội',
};

export const skillLevelLabels: Record<CasualMatchSkillLevel, string> = {
  ANY: 'Mọi trình độ',
  BEGINNER: 'Mới chơi',
  INTERMEDIATE: 'Trung bình',
  PRO: 'Nâng cao',
};

export const yardSlots: Record<string, number> = {
  FIVE_A_SIDE: 9,
  SEVEN_A_SIDE: 13,
  ELEVEN_A_SIDE: 21,
};

export const yardLabel: Record<string, string> = {
  FIVE_A_SIDE: '5v5',
  SEVEN_A_SIDE: '7v7',
  ELEVEN_A_SIDE: '11v11',
};

export const formatMatchTime = (timeStr?: string) => {
  if (!timeStr) return '';
  if (timeStr.includes('T')) {
    try {
      const date = new Date(timeStr);
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return timeStr;
    }
  }
  return timeStr;
};
