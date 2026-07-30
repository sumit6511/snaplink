export interface Link {
  id: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  title?: string;
  qrCode?: string;
  clicks: number;
  owner: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  isExpired: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LinkStats {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  expiredLinks: number;
}
