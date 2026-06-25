'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/route.constants';

export default function PasswordSection() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900">Mật khẩu</h3>
      <p className="mt-0.5 text-xs text-gray-500">Giữ cho tài khoản của bạn an toàn với mật khẩu mạnh.</p>

      <div className="mt-5 flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="password"
              value="••••••••"
              readOnly
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none cursor-not-allowed"
            />
          </div>
          <Link
            href={ROUTES.login}
            className="shrink-0 rounded-lg border border-emerald-600 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
          >
            Thay đổi
          </Link>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        Để thay đổi mật khẩu, bạn sẽ được chuyển hướng đến trang đăng nhập nơi bạn có thể sử dụng quy trình &quot;Quên mật khẩu&quot;.
      </p>
    </div>
  );
}
