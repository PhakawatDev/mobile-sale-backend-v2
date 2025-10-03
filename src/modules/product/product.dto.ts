import { z } from 'zod';

export const CreateProductDto = z.object({
    serial: z.string(),
    name:z.string().min(1),
    release: z.string().min(1),
    color:z.string().min(1),
    price:z.coerce.number(),
    customerName:z.string().min(1), 
    customerPhone:z.string().min(1),
    customerAddress:z.string().min(1),
    remark: z.string().min(1),
    qty: z.number()
});

export type CreateProductDto = z.infer<typeof CreateProductDto>;

export type ProductInput = Omit<CreateProductDto, 'qty'>;

export interface ProductUpdateDto {
    release: string;
    name: string;
    color: string;
    price: number;
    customerName: string;
    customerAddress: string;
    customerPhone: string;
    remark?: string;
    serial?: string;
  }

  export interface Product {
    id: string; 
    serial?: string | null;
    name: string;
    release: string; 
    color: string;
    price: number;
    customerName: string;
    customerPhone: string;
    customerAddress?: string | null;
    remark?: string | null;
  }

  export interface ExportRequestBody {
    products: Product[];
  }