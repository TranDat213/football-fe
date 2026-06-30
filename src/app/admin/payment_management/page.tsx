'use client';

import { useState } from 'react';
import { useGetAllPaymentsQuery, useConfirmRefundMutation } from '@/features/admin/api/adminPaymentAPI';
import type { PaymentStatus, PaymentWithBooking } from '@/features/booking/types/payment.types';

const STATUS_OPTIONS: { label: string; value: PaymentStatus | '' }[] = [
  { label: 'Tất cả', value: '' },
  { label: 'Chưa thanh toán', value: 'UNPAID' },
  { label: 'Đã thanh toán', value: 'PAID' },
  { label: 'Chờ hoàn tiền', value: 'REFUND_PENDING' },
  { label: 'Đã hoàn tiền', value: 'REFUNDED' },
];

const STATUS_BADGE: Record<string, { label: string; class: string }> = {
  UNPAID: { label: 'Chưa TT', class: 'bg-slate-700 text-slate-300' },
  PAID: { label: 'Đã TT', class: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
  REFUND_PENDING: { label: 'Chờ hoàn', class: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
  REFUNDED: { label: 'Đã hoàn', class: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
};

export default function AdminPaymentManagementPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PaymentStatus | ''>('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const { data, isLoading, isFetching, refetch } = useGetAllPaymentsQuery({
    page,
    limit: 10,
    status: status || undefined,
    search: search || undefined,
  });

  const [confirmRefund, { isLoading: isConfirming }] = useConfirmRefundMutation();

  const payments = data?.data ?? [];
  const meta = data?.meta;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleConfirmRefund = async (refundId: string) => {
    await confirmRefund({ id: refundId, adminNote });
    setConfirmingId(null);
    setAdminNote('');
    refetch();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Quản lý Thanh toán
        </h1>
        <p className="text-slate-400 mt-1">Theo dõi và xác nhận hoàn tiền cho các đơn đặt sân</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setStatus(opt.value); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                status === opt.value
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 md:ml-auto">
          <input
            type="text"
            placeholder="Tìm theo mã GD, booking ID, email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors w-64"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Tìm
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-lg">Không có dữ liệu</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  <th className="px-5 py-4 text-left text-slate-400 font-medium">Mã GD</th>
                  <th className="px-5 py-4 text-left text-slate-400 font-medium">Người dùng</th>
                  <th className="px-5 py-4 text-left text-slate-400 font-medium">Sân</th>
                  <th className="px-5 py-4 text-right text-slate-400 font-medium">Số tiền</th>
                  <th className="px-5 py-4 text-center text-slate-400 font-medium">Trạng thái</th>
                  <th className="px-5 py-4 text-center text-slate-400 font-medium">Phương thức</th>
                  <th className="px-5 py-4 text-left text-slate-400 font-medium">Ngày</th>
                  <th className="px-5 py-4 text-center text-slate-400 font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p: PaymentWithBooking) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded">
                        {p.transactionCode?.slice(0, 12) ?? 'N/A'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-slate-200 font-medium">{p.booking.user.firstName} {p.booking.user.lastName}</p>
                        <p className="text-slate-500 text-xs">{p.booking.user.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {p.booking.fieldYard.footballField.name}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-white font-semibold">
                        {Number(p.amount).toLocaleString('vi-VN')}đ
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_BADGE[p.status]?.class ?? 'bg-slate-700 text-slate-300'}`}>
                        {STATUS_BADGE[p.status]?.label ?? p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-slate-400 text-xs uppercase tracking-wide">{p.paymentMethod}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs">
                      {p.paidAt ? new Date(p.paidAt).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {p.booking.paymentStatus === 'REFUND_PENDING' && p.booking.refund && (
                        <button
                          onClick={() => setConfirmingId(p.booking.refund!.id)}
                          className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-medium transition-all"
                        >
                          Xác nhận hoàn
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-slate-500 text-sm">
            {meta.total} giao dịch · Trang {meta.page}/{meta.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 rounded-xl text-sm transition-colors"
            >
              ← Trước
            </button>
            <button
              disabled={page >= meta.totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 rounded-xl text-sm transition-colors"
            >
              Tiếp →
            </button>
          </div>
        </div>
      )}

      {/* Confirm Refund Modal */}
      {confirmingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-2">Xác nhận hoàn tiền</h2>
            <p className="text-slate-400 text-sm mb-4">
              Nhập ghi chú của admin (tuỳ chọn) trước khi xác nhận đã hoàn tiền thủ công cho khách.
            </p>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Ghi chú (VD: Đã chuyển khoản, mã GD: ...)"
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmingId(null); setAdminNote(''); }}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-sm font-medium transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={() => handleConfirmRefund(confirmingId)}
                disabled={isConfirming}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                {isConfirming ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
