import { FieldImage } from '@/types/field.types';
import {
  useGetFieldStaticsQuery,
  useGetPendingFieldsQuery,
  useGetAccountStatisticsQuery,
  useGetOwnerRegisterPendingCountQuery,
  useUpdateFieldStatusMutation,
} from '../api/admin.api';
import { toast } from 'sonner';

export function useAdminDashboard() {
  const { data: accountStats, isLoading: isLoadingAccountStats } =
    useGetAccountStatisticsQuery();

  const { data: pendingOwnerCount, isLoading: isLoadingPendingOwner } =
    useGetOwnerRegisterPendingCountQuery();

  const { data: fieldStatics, isLoading: isLoadingFieldStatics } =
    useGetFieldStaticsQuery();

  const { data: pendingFields, isLoading: isLoadingPendingFields } =
    useGetPendingFieldsQuery();

  // Parse field statics: [{ status: 'ACTIVE', _count: { _all: 10 } }, ...]
  const activeFieldCount =
    fieldStatics?.data?.find((f) => f.status === 'ACTIVE')?._count._all ?? 0;

  const pendingFieldCount =
    fieldStatics?.data?.find((f) => f.status === 'PENDING')?._count._all ?? 0;

  const getCoverImage = (images: FieldImage[]) =>
    images.find((img) => img.isCover)?.url ??
    images?.[0]?.url ??
    '/images/field-placeholder.jpg';

  const [updateFieldStatus, { isLoading: isUpdating }] =
    useUpdateFieldStatusMutation();

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
    totalAccounts: accountStats?.data?.statistics?.totalAccounts ?? 0,
    totalUsers: accountStats?.data?.statistics?.totalUsers ?? 0,
    totalOwners: accountStats?.data?.statistics?.totalOwners ?? 0,
    pendingOwnerCount: pendingOwnerCount?.data?.count ?? 0,
    activeFieldCount,
    pendingFieldCount,
    pendingFields: (pendingFields?.data ?? []).map((field) => ({
      ...field,
      coverImage: getCoverImage(field.images),
    })),
    isLoading:
      isLoadingAccountStats ||
      isLoadingPendingOwner ||
      isLoadingFieldStatics ||
      isLoadingPendingFields,
    handleApprove,
    handleReject,
    isUpdating,
  };
}
