import { CompanyRepository } from './company.repository';
import { UpsertCompanyDto } from './company.dto';
import { AppError } from '../../core/errors/AppError';
import { AppLogger} from '../../core/logger/logger';

export class CompanyService {

    private readonly logger = new AppLogger(CompanyService);
    private readonly repo: CompanyRepository;

    // constructor(private repo: CompanyRepository) { }
    
    constructor(){
        this.repo = new CompanyRepository();
    }
    
    async upsertCompany(payload: UpsertCompanyDto) {
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
        } else {
            return this.repo.create({
                name: payload.name,
                address: payload.address,
                phone: payload.phone,
                email: payload.email ?? '',
                taxCode: payload.taxCode,
            } as any);
        }
    }

    async getCompany() {
        const company = await this.repo.findFirst();
        this.logger.debug(`get Company: ${JSON.stringify(company, null, 2)}`);
        if (!company) {
            throw new AppError('Company not found', 404, 'COMPANY_NOT_FOUND');
        }
        return company;
    }
}
