import { Injectable, Inject } from '@nestjs/common';
import { IChartOfAccountsService } from './interfaces/chart-of-accounts.service.interface';
import { IChartOfAccountsHelper } from './interfaces/chart-of-accounts.helper.interface';
import { CreateChartOfAccountsDto } from './dto/create-chart-of-accounts.dto';
import { ChartOfAccountsDto } from './dto/chart-of-accounts.dto';
import { ChartOfAccountsFiltersDto } from './dto/chart-of-accounts-filters.dto';
import { UpdateChartOfAccountsDto } from './dto/update-chart-of-accounts.dto';
import { AccountHierarchyDto } from './dto/account-hierarchy.dto';
import { WrappedResponseDto } from '../utils/pagination/dto/paginated-response.dto';
import { logAndThrowError } from 'src/utils/errors/error.utils';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ChartOfAccountsService implements IChartOfAccountsService {
  constructor(
    @Inject('IChartOfAccountsHelper')
    private readonly helper: IChartOfAccountsHelper,
  ) {}

  async create(
    createChartOfAccountsDto: CreateChartOfAccountsDto,
    userId: string,
  ): Promise<ChartOfAccountsDto> {
    try {
      const chartOfAccounts = await this.helper.create(
        createChartOfAccountsDto,
        userId,
      );
      return plainToInstance(
        ChartOfAccountsDto,
        JSON.parse(JSON.stringify(chartOfAccounts)),
      );
    } catch (error) {
      throw logAndThrowError('Failed to create chart of accounts', error);
    }
  }

  async findAll(
    page: number,
    limit: number,
    filters?: ChartOfAccountsFiltersDto,
  ): Promise<WrappedResponseDto<ChartOfAccountsDto>> {
    try {
      const result = await this.helper.findAll(page, limit, filters);
      return result;
    } catch (error) {
      throw logAndThrowError('Failed to fetch chart of accounts', error);
    }
  }

  async findOne(id: string): Promise<ChartOfAccountsDto> {
    try {
      const chartOfAccounts = await this.helper.findOne(id);
      return plainToInstance(
        ChartOfAccountsDto,
        JSON.parse(JSON.stringify(chartOfAccounts)),
      );
    } catch (error) {
      throw logAndThrowError('Chart of accounts not found', error);
    }
  }

  async update(
    id: string,
    updateChartOfAccountsDto: UpdateChartOfAccountsDto,
    userId: string,
  ): Promise<ChartOfAccountsDto> {
    try {
      const chartOfAccounts = await this.helper.update(
        id,
        updateChartOfAccountsDto,
        userId,
      );
      return plainToInstance(
        ChartOfAccountsDto,
        JSON.parse(JSON.stringify(chartOfAccounts)),
      );
    } catch (error) {
      throw logAndThrowError('Failed to update chart of accounts', error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.helper.remove(id);
    } catch (error) {
      throw logAndThrowError('Failed to delete chart of accounts', error);
    }
  }

  async findByAccountType(accountType: string): Promise<ChartOfAccountsDto[]> {
    try {
      const accounts = await this.helper.findByAccountType(accountType);
      return accounts.map((account) =>
        plainToInstance(
          ChartOfAccountsDto,
          JSON.parse(JSON.stringify(account)),
        ),
      );
    } catch (error) {
      throw logAndThrowError('Failed to fetch accounts by type', error);
    }
  }

  async findByRootType(rootType: string): Promise<ChartOfAccountsDto[]> {
    try {
      const accounts = await this.helper.findByRootType(rootType);
      return accounts.map((account) =>
        plainToInstance(
          ChartOfAccountsDto,
          JSON.parse(JSON.stringify(account)),
        ),
      );
    } catch (error) {
      throw logAndThrowError('Failed to fetch accounts by root type', error);
    }
  }

  async findByCompany(company: string): Promise<ChartOfAccountsDto[]> {
    try {
      const accounts = await this.helper.findByCompany(company);
      return accounts.map((account) =>
        plainToInstance(
          ChartOfAccountsDto,
          JSON.parse(JSON.stringify(account)),
        ),
      );
    } catch (error) {
      throw logAndThrowError('Failed to fetch accounts by company', error);
    }
  }

  async getHierarchy(): Promise<{ data: AccountHierarchyDto[] }> {
    try {
      const hierarchy = await this.helper.getHierarchy();
      return { data: hierarchy };
    } catch (error) {
      throw logAndThrowError('Failed to fetch account hierarchy', error);
    }
  }
}
