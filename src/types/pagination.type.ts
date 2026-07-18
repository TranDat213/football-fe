export interface PaginatedQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginatedApiResponse<T> extends Paginated<T> {
  message: string;
}