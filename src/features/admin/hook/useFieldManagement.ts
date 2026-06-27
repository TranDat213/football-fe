import { useState } from 'react';
import {
  useGetPendingFieldsQuery,
  useGetFieldStaticsQuery,
  useUpdateFieldStatusMutation,
} from '../api/admin.api';
import { toast } from 'sonner';

export function useFieldManagement() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const fieldsQuery = useGetPendingFieldsQuery({ page, limit });
  const { data: fieldStatics, isLoading: isLoadingStatics } = useGetFieldStaticsQuery();
  const [updateFieldStatus, { isLoading: isUpdating }] = useUpdateFieldStatusMutation();

  const list = fieldsQuery.data?.data ?? [];

  const activeFieldCount =
    fieldStatics?.data?.find((f) => f.status === 'ACTIVE')?._count._all ?? 0;
  const pendingFieldCount =
    fieldStatics?.data?.find((f) => f.status === 'PENDING')?._count._all ?? 0;
  const inactiveFieldCount =
    fieldStatics?.data?.find((f) => f.status === 'INACTIVE')?._count._all ?? 0;

  const handleApprove = async (id: string) => {
    try {
      await updateFieldStatus({ id, status: 'ACTIVE' }).unwrap();
      toast.success('Đã duyệt sân thành công');
    } catch {
      toast.error('Duyệt sân thất bại');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateFieldStatus({ id, status: 'INACTIVE' }).unwrap();
      toast.success('Đã từ chối sân');
    } catch {
      toast.error('Từ chối sân thất bại');
    }
  };

  return {
    list,
    page,
    limit,
    isLoading: fieldsQuery.isLoading || isLoadingStatics,
    isFetching: fieldsQuery.isFetching,
    stats: { activeFieldCount, pendingFieldCount, inactiveFieldCount },
    handlePageChange: setPage,
    handleApprove,
    handleReject,
    isUpdating,
  };
}