export type PaginateOptions = {
  limit?: number;
  page?: number;
  populate?: string;
  sortBy?: string;
};

export type PaginatedData<Doc> = {
  limi: number;
  page: number;
  results: Doc[];
  totalPages: number;
  totalResults: number;
};
