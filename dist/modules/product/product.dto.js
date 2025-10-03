"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductDto = void 0;
const zod_1 = require("zod");
exports.CreateProductDto = zod_1.z.object({
    serial: zod_1.z.string(),
    name: zod_1.z.string().min(1),
    release: zod_1.z.string().min(1),
    color: zod_1.z.string().min(1),
    price: zod_1.z.coerce.number(),
    customerName: zod_1.z.string().min(1),
    customerPhone: zod_1.z.string().min(1),
    customerAddress: zod_1.z.string().min(1),
    remark: zod_1.z.string().min(1),
    qty: zod_1.z.number()
});
