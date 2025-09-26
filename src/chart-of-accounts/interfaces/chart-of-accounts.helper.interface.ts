import { CreateChartOfAccountsDto } from '../dto/create-chart-of-accounts.dto';
import { ChartOfAccountsDto } from '../dto/chart-of-accounts.dto';
import { ChartOfAccountsFiltersDto } from '../dto/chart-of-accounts-filters.dto';
import { UpdateChartOfAccountsDto } from '../dto/update-chart-of-accounts.dto';
import { AccountHierarchyDto } from '../dto/account-hierarchy.dto';
import { ChartOfAccountsDocument } from '../schema/chart-of-accounts.schema';
import { WrappedResponseDto } from '../../utils/pagination/dto/paginated-response.dto';

export interface IChartOfAccountsHelper {
  create(
    createChartOfAccountsDto: CreateChartOfAccountsDto,
    userId: string,
  ): Promise<ChartOfAccountsDto>;

  findAll(
    page: number,
    limit: number,
    filters?: ChartOfAccountsFiltersDto,
  ): Promise<WrappedResponseDto<ChartOfAccountsDto>>;

  findOne(id: string): Promise<ChartOfAccountsDto>;

  update(
    id: string,
    updateChartOfAccountsDto: UpdateChartOfAccountsDto,
    userId: string,
  ): Promise<ChartOfAccountsDto>;

  remove(id: string): Promise<void>;

  findByAccountType(accountType: string): Promise<ChartOfAccountsDto[]>;

  findByRootType(rootType: string): Promise<ChartOfAccountsDto[]>;

  findByCompany(company: string): Promise<ChartOfAccountsDto[]>;

  getHierarchy(): Promise<AccountHierarchyDto[]>;

  validateChartOfAccounts(chartOfAccounts: CreateChartOfAccountsDto): boolean;

  buildAccountHierarchy(
    accounts: ChartOfAccountsDocument[],
  ): AccountHierarchyDto[];

  generateAccountNumber(accountType: string, parentAccount?: string): string;
}
