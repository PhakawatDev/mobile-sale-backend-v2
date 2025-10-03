"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpsertCompanyDto = void 0;
const zod_1 = require("zod");
exports.UpsertCompanyDto = zod_1.z.object({
    name: zod_1.z.string().min(1),
    address: zod_1.z.string().min(1),
    phone: zod_1.z.string().min(1),
    email: zod_1.z.string().email().optional().default(''),
    taxCode: zod_1.z.string().min(1),
});
