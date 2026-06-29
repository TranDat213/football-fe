'use client';
import { useState } from 'react';
import {
  useGetOwnerRegisterPendingQuery,
  useUpdateOwnerRegisterStatusMutation,
  useGetOwnerRegisterByIdQuery,
  useCreateOwnerMutation,
  useCountOwnerRegisterPendingQuery,
} from '../api/admin.api';
import { OwnerRegisterPending } from '../type/admin.type';

export function useOwnerRegisterManagement() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const listQuery = useGetOwnerRegisterPendingQuery({ page, limit });
  const { data: countData } = useCountOwnerRegisterPendingQuery();
  const detailQuery = useGetOwnerRegisterByIdQuery(selectedId ?? '', {
    skip: !selectedId,
  });

  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOwnerRegisterStatusMutation();
  const [createOwner, { isLoading: isCreatingOwner }] =
    useCreateOwnerMutation();

  const data = listQuery.data?.data;
  const list = data?.ownerRegistrations ?? [];
  const total = countData?.data?.count ?? 0;

  const handleApprove = async (record: OwnerRegisterPending) => {
    await updateStatus({ id: record.id, status: 'APPROVED' }).unwrap();
    await createOwner({
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      phone: record.phone ?? '',
    }).unwrap();
  };

  const handleUpdateStatus = async (
    id: string,
    status: 'PENDING' | 'CONTACTING' | 'APPROVED' | 'REJECTED',
  ) => {
    await updateStatus({ id, status }).unwrap();
  };

  return {
    list,
    total,
    page,
    limit,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    selectedId,
    selectedDetail: detailQuery.data?.data?.ownerRegistrations?.[0] ?? null,
    isLoadingDetail: detailQuery.isLoading,
    setSelectedId,
    handlePageChange: (newPage: number) => setPage(newPage),
    handleLimitChange: (newLimit: number) => {
      setLimit(newLimit);
      setPage(1);
    },
    handleApprove,
    handleUpdateStatus,
    isUpdatingStatus: isUpdatingStatus || isCreatingOwner,
  };
}