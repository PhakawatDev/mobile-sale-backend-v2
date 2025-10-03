import { Request, Response } from "express";

export interface ApiMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  [k: string]: any;
}

export interface ApiSuccess<T> {
  success: true;
  message?: string;
  size?: number;
  data?: T;
  meta?: ApiMeta;
  requestId?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
  details?: any;
  requestId?: string;
  timestamp: string;
}

function base(req?: Request) {
  return {
    requestId: (req as any)?.id,           // ถ้ามี req.id จาก middleware
    timestamp: new Date().toISOString(),
  };
}

export function ok<T>(res: Response, req: Request, data?: T, opts?: { message?: string; size?: number; meta?: ApiMeta }) {
  const payload: ApiSuccess<T> = {
    success: true,
    message: opts?.message ?? 'OK',
    data,
    size: typeof opts?.size === 'number' ? opts!.size : Array.isArray(data) ? data.length : undefined,
    meta: opts?.meta,
    ...base(req),
  };
  return res.status(200).json(payload);
}

export function created<T>(res: Response, req: Request, data?: T, opts?: { message?: string }) {
  const payload: ApiSuccess<T> = {
    success: true,
    message: opts?.message ?? 'Created',
    data,
    ...base(req),
  };
  return res.status(201).json(payload);
}

export function paged<T>(res: Response, req: Request, data: T[], meta: Required<Pick<ApiMeta, 'page'|'pageSize'|'total'|'totalPages'>>, opts?: { message?: string }) {
  const payload: ApiSuccess<T[]> = {
    success: true,
    message: opts?.message ?? 'OK',
    data,
    size: data.length,
    meta,
    ...base(req),
  };
  return res.status(200).json(payload);
}

export function fail(res: Response, req: Request, message: string, status = 400, opts?: { code?: string; details?: any }) {
  const payload: ApiError = {
    success: false,
    message,
    code: opts?.code,
    details: opts?.details,
    ...base(req),
  };
  return res.status(status).json(payload);
}
