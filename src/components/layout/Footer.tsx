// components/layout/Footer.tsx
'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const FOOTER_COLUMNS = [
  {
    heading: 'KHÁM PHÁ',
    links: [
      { label: 'Tìm sân bóng', href: '/' },
      { label: 'Trận đấu ngẫu hứng', href: '/casual-matches' },
      { label: 'Đặt lịch của tôi', href: '/my-booking' },
      { label: 'Hồ sơ cá nhân', href: '/profile' },
    ],
  },
  {
    heading: 'DÀNH CHO CHỦ SÂN',
    links: [
      { label: 'Đăng ký làm chủ sân', href: '/register' },
      { label: 'Quản lý sân', href: '/owner' },
      { label: 'Hướng dẫn chủ sân', href: '/help' },
    ],
  },
  {
    heading: 'PHÁP LÝ & HỖ TRỢ',
    links: [
      { label: 'Trung Tâm Trợ Giúp', href: '/help' },
      { label: 'Điều Khoản Dịch Vụ', href: '/terms' },
      { label: 'Chính Sách Bảo Mật', href: '/privacy' },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
  { icon: YoutubeIcon, href: 'https://youtube.com', label: 'YouTube' },
  { icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
];

function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <div
      className={`${className} flex items-center justify-center rounded-full bg-emerald-600 text-white`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 7l3 2.2-1.1 3.5h-3.8L9 9.2 12 7z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-12 text-gray-400">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <LogoMark />
              <span className="text-lg font-bold text-white">
                ChanDen<span className="text-emerald-500">Club</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Kết nối người chơi với các cơ sở thể thao chất lượng cao. Cách chuyên nghiệp để đặt
              trận đấu tiếp theo của bạn.
            </p>

            {/* Thông tin liên hệ */}
            <ul className="mt-5 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                123 Nguyễn Văn Linh, Q.7, TP.HCM
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                1800 1234
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                support@chandenclub.vn
              </li>
            </ul>

            {/* Mạng xã hội */}
            <div className="mt-6 flex gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-colors hover:border-emerald-500 hover:text-emerald-400"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Các cột link */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h5 className="text-xs font-semibold tracking-wider text-gray-300">{col.heading}</h5>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-white hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-6 sm:flex-row">
          <p className="text-xs text-gray-500">© 2026 ChanDenClub. Bảo lưu mọi quyền.</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="/terms" className="transition-colors hover:text-gray-300">
              Điều khoản
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-gray-300">
              Bảo mật
            </Link>
            <Link href="/help" className="transition-colors hover:text-gray-300">
              Trợ giúp
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}