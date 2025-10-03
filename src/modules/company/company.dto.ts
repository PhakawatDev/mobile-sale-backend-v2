import { z } from 'zod';

export const UpsertCompanyDto = z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email().optional().default(''),
    taxCode: z.string().min(1),
});

export type UpsertCompanyDto = z.infer<typeof UpsertCompanyDto>;
