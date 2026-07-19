'use client';
import { UserAdmin } from '../type/admin.type';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CheckCircle, Slash, Ban, MoreVertical, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface UserTableProps {
  users: UserAdmin[];
  isLoading: boolean;
  onUpdateStatus?: (
    id: string,
    status: 'ACTIVE' | 'INACTIVE' | 'BANNED',
  ) => void;
  isUpdating?: boolean;
}

export function UserTable({
  users,
  isLoading,
  onUpdateStatus,
  isUpdating,
}: UserTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateStatus = async (
    id: string,
    status: 'ACTIVE' | 'INACTIVE' | 'BANNED',
  ) => {
    if (onUpdateStatus) {
      setUpdatingId(id);
      await onUpdateStatus(id, status);
      setUpdatingId(null);
    }
  };
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 w-full animate-pulse rounded-xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 font-medium">
        Không có dữ liệu người dùng
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Người dùng
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Email & Phone
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Vai trò
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Trạng thái
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Ngày tham gia
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 text-right">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-100">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-sm">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      {user.username}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-700">
                    {user.email}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium italic">
                    {user.phone || 'Chưa cập nhật'}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] uppercase font-bold tracking-tighter border ${
                    user.role === 'OWNER'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : user.role === 'ADMIN'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}
                >
                  {user.role === 'OWNER'
                    ? 'Chủ sân'
                    : user.role === 'ADMIN'
                      ? 'Quản trị'
                      : 'Người dùng'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] uppercase font-bold tracking-tighter ${
                    user.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-600'
                      : user.status === 'BANNED'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {user.status === 'ACTIVE'
                    ? 'Hoạt động'
                    : user.status === 'BANNED'
                      ? 'Đã khóa'
                      : 'Tạm dừng'}
                </span>
              </td>
              <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                {format(new Date(user.createdAt), 'dd MMMM yyyy', {
                  locale: vi,
                })}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {updatingId === user.id ? (
                    <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
                  ) : (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(user.id, 'ACTIVE')}
                        disabled={user.status === 'ACTIVE' || isUpdating}
                        title="Kích hoạt"
                        className={`p-1.5 rounded-lg transition-all ${
                          user.status === 'ACTIVE'
                            ? 'text-emerald-300 cursor-not-allowed'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(user.id, 'INACTIVE')}
                        disabled={user.status === 'INACTIVE' || isUpdating}
                        title="Tạm dừng"
                        className={`p-1.5 rounded-lg transition-all ${
                          user.status === 'INACTIVE'
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <Slash className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(user.id, 'BANNED')}
                        disabled={user.status === 'BANNED' || isUpdating}
                        title="Khóa vĩnh viễn"
                        className={`p-1.5 rounded-lg transition-all ${
                          user.status === 'BANNED'
                            ? 'text-red-300 cursor-not-allowed'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
