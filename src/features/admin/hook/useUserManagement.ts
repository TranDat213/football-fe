import { useState } from 'react';
import {
  useGetAllUsersQuery,
  useGetAllOwnersQuery,
  useGetAccountStatisticsQuery,
  useUpdateUserStatusMutation,
} from '../api/admin.api';

export function useUserManagement(role: 'USER' | 'OWNER') {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const usersQuery = useGetAllUsersQuery(
    { page, limit },
    { skip: role !== 'USER' },
  );
  const ownersQuery = useGetAllOwnersQuery(
    { page, limit },
    { skip: role !== 'OWNER' },
  );

  const { data: statsData, isLoading: isLoadingStats } =
    useGetAccountStatisticsQuery();
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateUserStatusMutation();

  const query = role === 'USER' ? usersQuery : ownersQuery;
  const data = query.data?.data;
  const list = role === 'USER' ? data?.users : data?.owners;
  const total = data?.total ?? 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return {
    list: list ?? [],
    total,
    page,
    limit,
    isLoading: query.isLoading || isLoadingStats,
    isFetching: query.isFetching,
    stats: statsData?.data?.statistics,
    handlePageChange,
    handleLimitChange,
    updateStatus,
    isUpdatingStatus,
  };
}
