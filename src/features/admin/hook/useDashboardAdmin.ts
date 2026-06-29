import {
  useGetFieldStaticsQuery,
  useGetAccountStatisticsQuery,
  useGetOwnerRegisterPendingCountQuery,
} from '../api/admin.api';

export function useAdminDashboard() {
  const { data: accountStats, isLoading: isLoadingAccountStats } =
    useGetAccountStatisticsQuery();

  const { data: pendingOwnerCount, isLoading: isLoadingPendingOwner } =
    useGetOwnerRegisterPendingCountQuery();

  const { data: fieldStatics, isLoading: isLoadingFieldStatics } =
    useGetFieldStaticsQuery();

  const activeFieldCount =
    fieldStatics?.data?.find((f) => f.status === 'ACTIVE')?._count._all ?? 0;
  const pendingFieldCount =
    fieldStatics?.data?.find((f) => f.status === 'PENDING')?._count._all ?? 0;

  return {
    totalAccounts: accountStats?.data?.statistics?.totalAccounts ?? 0,
    totalUsers:    accountStats?.data?.statistics?.totalUsers ?? 0,
    totalOwners:   accountStats?.data?.statistics?.totalOwners ?? 0,
    pendingOwnerCount: pendingOwnerCount?.data?.count ?? 0,
    activeFieldCount,
    pendingFieldCount,
    isLoading:
      isLoadingAccountStats ||
      isLoadingPendingOwner ||
      isLoadingFieldStatics,
  };
}