'use client';
import { useAproveFieldUpdateRequestMutation, useGetFieldUpdateRequestStatusQuery, useRejectFieldUpdateRequestMutation } from '@/features/pitch/api/pitchAPI';
import { FootballFieldUpdateRequest } from '@/features/pitch/types/pich.types';
import { useState } from 'react';
import { useAppSelector } from '@/store/store';

const LIMIT =10;

export function useFieldUpdateRequestManagement() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const currentUser = useAppSelector((state) => state.auth.user);

  const listQuery = useGetFieldUpdateRequestStatusQuery({status: 'PENDING', page, limit: LIMIT });

  const list = listQuery.data?.data ?? [];
  const selectedDetail = list.find((r) => r.id === selectedId) ?? null;

  const [approveRequest, { isLoading: isApproving }] =
    useAproveFieldUpdateRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] =
    useRejectFieldUpdateRequestMutation();

  const handleApprove = async (id: string) => {
    await approveRequest({
      id,
    }).unwrap();
  };

  const handleReject = async (id: string, reason: string) => {
    await rejectRequest({
      id,
      body: {
        reason,
      },
    }).unwrap();
  };

  return {
    list,
    itemsCount: list.length,
    page,
    limit: LIMIT,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    selectedId,
    selectedDetail,
    setSelectedId,
    handlePageChange: (newPage: number) => setPage(newPage),
    handleApprove,
    handleReject,
    isUpdating: isApproving || isRejecting,
  };
}