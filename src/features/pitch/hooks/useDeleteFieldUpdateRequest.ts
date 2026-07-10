'use client';

import { useAppSelector } from '@/store/store';
import { useState } from 'react';
import {
  useGetOwnerFieldUpdateRequestStatusQuery,
  useSoftDeleteFieldUpdateRequestMutation,
} from '../api/pitchAPI';
import { FootballFieldUpdateRequestStatus } from '../types/pich.types';

const LIMIT = 10;

export function useOwnerFieldUpdateRequestManagement() {
  const [page, setPage] = useState<number>(1);
  const [status, setStatus] = useState<
    FootballFieldUpdateRequestStatus | undefined
  >(undefined);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const currentUser = useAppSelector((state) => state.auth.user);
  const ownerId = currentUser?.id ?? '';

  const listQuery = useGetOwnerFieldUpdateRequestStatusQuery(
    { ownerId, status, page, limit: LIMIT },
    { skip: !ownerId },
  );

  const list = listQuery.data?.data ?? [];
  const selectedDetail = list.find((r) => r.id === selectedId) ?? null;

  const [softDeleteRequest, { isLoading: isDeleting }] =
    useSoftDeleteFieldUpdateRequestMutation();

  const handleDelete = async (id: string) => {
    await softDeleteRequest({ id }).unwrap();
  };

  return {
    list,
    itemsCount: list.length,
    page,
    limit: LIMIT,
    status,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    selectedId,
    selectedDetail,
    setSelectedId,
    setStatus: (s: FootballFieldUpdateRequestStatus | undefined) => {
      setStatus(s);
      setPage(1);
    },
    handlePageChange: (newPage: number) => setPage(newPage),
    handleDelete,
    isDeleting,
  };
}
