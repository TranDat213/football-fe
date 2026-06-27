'use client';
import { useState } from 'react';
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../api/admin.api';
import { CreateCategoryPayload, UpdateCategoryPayload } from '../type/admin.type';

export function useCategoryManagement() {
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useGetAllCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const list = data?.data ?? [];

  const handleCreate = async (payload: CreateCategoryPayload) => {
    try {
      await createCategory(payload).unwrap();
    } catch (error) {
      console.error('Failed to create category:', error);
      throw error;
    }
  };

  const handleUpdate = async (payload: UpdateCategoryPayload) => {
    try {
      await updateCategory(payload).unwrap();
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory({ id }).unwrap();
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  };

  return {
    list,
    isLoading,
    isFetching,
    editingId,
    setEditingId,
    handleCreate,
    handleUpdate,
    handleDelete,
    isMutating: isCreating || isUpdating || isDeleting,
  };
}