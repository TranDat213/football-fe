'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, Tag, Plus, Pencil, Trash2, Loader2, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useCategoryManagement } from '@/features/admin/hook/useCategoryManagement';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateCategorySchema, UpdateCategorySchema, CreateCategoryFormData, UpdateCategoryFormData } from '@/features/admin/schema/admin.schema';
import { useState } from 'react';
import { FieldCategory } from '@/features/admin/type/admin.type';

export default function CategoryManagementPage() {
  const {
    list,
    isLoading,
    isFetching,
    editingId,
    setEditingId,
    handleCreate,
    handleUpdate,
    handleDelete,
    isMutating,
  } = useCategoryManagement();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Create form
  const createForm = useForm<CreateCategoryFormData>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: { name: '', display_order: 0 },
  });

  // Edit form
  const editForm = useForm<UpdateCategoryFormData>({
    resolver: zodResolver(UpdateCategorySchema),
  });

  const onSubmitCreate = async (data: CreateCategoryFormData) => {
    await handleCreate(data);
    createForm.reset();
  };

  const startEdit = (cat: FieldCategory) => {
    setEditingId(cat.id);
    editForm.reset({ id: cat.id, name: cat.name, display_order: cat.display_order });
  };

  const onSubmitEdit = async (data: UpdateCategoryFormData) => {
    await handleUpdate(data);
  };

  const onDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await handleDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/admin" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                <Link href="/admin">Dashboard</Link>
                <span>/</span>
                <span className="text-indigo-600">Danh mục sân</span>
              </nav>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-indigo-500 inline-block pb-1">
              Danh mục sân
            </h1>
            <p className="text-sm text-gray-400 font-medium mt-2">
              {list.length} danh mục
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Create form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-1.5 rounded-lg bg-indigo-50">
                  <Plus className="h-4 w-4 text-indigo-600" />
                </div>
                <h2 className="text-sm font-bold text-gray-900">Thêm danh mục</h2>
              </div>

              <form onSubmit={createForm.handleSubmit(onSubmitCreate)} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1.5">
                    Tên danh mục
                  </label>
                  <input
                    {...createForm.register('name')}
                    placeholder="VD: Sân 5 người"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-indigo-400 transition-colors"
                  />
                  {createForm.formState.errors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {createForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1.5">
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    {...createForm.register('display_order', { valueAsNumber: true })}
                    placeholder="0"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-indigo-400 transition-colors"
                  />
                  {createForm.formState.errors.display_order && (
                    <p className="text-xs text-red-500 mt-1">
                      {createForm.formState.errors.display_order.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isMutating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isMutating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  Thêm danh mục
                </button>
              </form>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-3">
            <div className={`rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden ${isFetching ? 'opacity-60' : ''}`}>
              {isLoading ? (
                <div className="space-y-3 p-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-14 w-full animate-pulse rounded-xl bg-gray-100" />
                  ))}
                </div>
              ) : list.length === 0 ? (
                <div className="py-16 text-center">
                  <Tag className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-400">Chưa có danh mục nào</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {list.map((cat) => (
                    <li key={cat.id} className="px-5 py-4">
                      {editingId === cat.id ? (
                        // Edit row
                        <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="flex items-center gap-2">
                          <input
                            {...editForm.register('name')}
                            className="flex-1 rounded-lg border border-indigo-300 px-3 py-1.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                          <input
                            type="number"
                            {...editForm.register('display_order', { valueAsNumber: true })}
                            className="w-16 rounded-lg border border-indigo-300 px-2 py-1.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-indigo-500 transition-colors text-center"
                          />
                          <button
                            type="submit"
                            disabled={isMutating}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-all"
                          >
                            {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-all"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </form>
                      ) : (
                        // Display row
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600">
                              {cat.display_order}
                            </span>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{cat.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEdit(cat)}
                              disabled={isMutating}
                              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-indigo-600 transition-all"
                              title="Chỉnh sửa"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => onDelete(cat.id)}
                              disabled={deletingId === cat.id || isMutating}
                              className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
                              title="Xóa"
                            >
                              {deletingId === cat.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}