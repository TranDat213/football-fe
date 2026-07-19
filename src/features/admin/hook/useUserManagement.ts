import { useState } from 'react';
import {
  useGetAllUsersQuery,
  useGetAllOwnersQuery,
  useGetAllAccountsQuery,
  useGetAccountStatisticsQuery,
  useUpdateUserStatusMutation,
} from '../api/admin.api';

export function useUserManagement(role: 'USER' | 'OWNER' | 'ALL' = 'ALL') {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState('');

  const usersQuery = useGetAllUsersQuery(
    { page, limit, keyword },
    { skip: role !== 'USER' },
  );
  const ownersQuery = useGetAllOwnersQuery(
    { page, limit, keyword },
    { skip: role !== 'OWNER' },
  );
  const accountsQuery = useGetAllAccountsQuery(
    { page, limit, keyword },
    { skip: role !== 'ALL' },
  );

  const { data: statsData, isLoading: isLoadingStats } =
    useGetAccountStatisticsQuery();
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateUserStatusMutation();

  const query =
    role === 'USER'
      ? usersQuery
      : role === 'OWNER'
      ? ownersQuery
      : accountsQuery;

  const list = query.data?.data ?? [];
  const total = query.data?.pagination?.total ?? 0;
  const totalPages = query.data?.pagination?.totalPages ?? 1;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleKeywordChange = (newKeyword: string) => {
    setKeyword(newKeyword);
    setPage(1);
  };

  return {
    list,
    total,
    totalPages,
    page,
    limit,
    keyword,
    isLoading: query.isLoading || isLoadingStats,
    isFetching: query.isFetching,
    stats: statsData?.data?.statistics,
    handlePageChange,
    handleLimitChange,
    handleKeywordChange,
    updateStatus,
    isUpdatingStatus,
  };
}
