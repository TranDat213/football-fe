export interface ApiResponse<T = any> {
  succeeded: boolean;
  message: string;
  code: string;
  data: T;
  meta: any | null;
  errors: any | null;
}

export type PaginationMeta = {
  total: number;
  pageNum: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: number | null;
  prevPage: number | null;
};

export type CodeResponse = {
  code: string;
  displayAs: string;
};

export type ApiData<T> = T extends ApiResponse<infer D> ? D : never;