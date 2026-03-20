export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
}

export interface PaginationParams {
  pageNum?: number;
  pageSize?: number;
}

export interface PaginationResult<T> {
  list: T[];
  total: number;
}

export interface JwtPayload {
  sub: string;
  username: string;
  roles: string[] | number[];
  iat?: number;
  exp?: number;
}

export type JwtPayloadType = JwtPayload;
