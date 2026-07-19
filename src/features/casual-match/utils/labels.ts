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
  ADVANCED: 'Nâng cao',
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
