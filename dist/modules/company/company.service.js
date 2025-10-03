"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const company_repository_1 = require("./company.repository");
const AppError_1 = require("../../core/errors/AppError");
const logger_1 = require("../../core/logger/logger");
class CompanyService {
    // constructor(private repo: CompanyRepository) { }
    constructor() {
        this.logger = new logger_1.AppLogger(CompanyService);
        this.repo = new company_repository_1.CompanyRepository();
    }
    async upsertCompany(payload) {
        this.logger.debug('UPSERT_COMPANY', { payload: { ...payload, } });
        const existed = await this.repo.findFirst();
        if (existed) {
            return this.repo.updateById(existed.id, {
                name: payload.name,
                address: payload.address,
                phone: payload.phone,
                email: payload.email ?? '',
                taxCode: payload.taxCode,
            });
        }
        else {
            return this.repo.create({
                name: payload.name,
                address: payload.address,
                phone: payload.phone,
                email: payload.email ?? '',
                taxCode: payload.taxCode,
            });
        }
    }
    async getCompany() {
        const company = await this.repo.findFirst();
        this.logger.debug(`get Company: ${JSON.stringify(company, null, 2)}`);
        if (!company) {
            throw new AppError_1.AppError('Company not found', 404, 'COMPANY_NOT_FOUND');
        }
        return company;
    }
}
exports.CompanyService = CompanyService;
