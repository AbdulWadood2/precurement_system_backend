import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IChartOfAccountsHelper } from '../interfaces/chart-of-accounts.helper.interface';
import { CreateChartOfAccountsDto } from '../dto/create-chart-of-accounts.dto';
import { ChartOfAccountsDto } from '../dto/chart-of-accounts.dto';
import { ChartOfAccountsFiltersDto } from '../dto/chart-of-accounts-filters.dto';
import { UpdateChartOfAccountsDto } from '../dto/update-chart-of-accounts.dto';
import { AccountHierarchyDto } from '../dto/account-hierarchy.dto';
import {
  ChartOfAccounts,
  ChartOfAccountsDocument,
} from '../schema/chart-of-accounts.schema';
import { WrappedResponseDto } from '../../utils/pagination/dto/paginated-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ChartOfAccountsHelper implements IChartOfAccountsHelper {
  constructor(
    @InjectModel(ChartOfAccounts.name)
    private chartOfAccountsModel: Model<ChartOfAccountsDocument>,
  ) {}

  async create(
    createChartOfAccountsDto: CreateChartOfAccountsDto,
    userId: string,
  ): Promise<ChartOfAccountsDto> {
    if (!this.validateChartOfAccounts(createChartOfAccountsDto)) {
      throw new BadRequestException('Invalid chart of accounts data');
    }

    // Check if account number already exists
    const existingAccount = await this.chartOfAccountsModel.findOne({
      accountNumber: createChartOfAccountsDto.accountNumber,
    });

    if (existingAccount) {
      throw new BadRequestException('Account number already exists');
    }

    const chartOfAccounts = new this.chartOfAccountsModel({
      ...createChartOfAccountsDto,
      createdBy: new Types.ObjectId(userId),
    });

    const savedAccount = await chartOfAccounts.save();
    return plainToInstance(
      ChartOfAccountsDto,
      JSON.parse(JSON.stringify(savedAccount)),
    );
  }

  async findAll(
    page: number,
    limit: number,
    filters?: ChartOfAccountsFiltersDto,
  ): Promise<WrappedResponseDto<ChartOfAccountsDto>> {
    const query: Record<string, any> = {};

    if (filters?.accountType) {
      query.accountType = filters.accountType;
    }

    if (filters?.rootType) {
      query.rootType = filters.rootType;
    }

    if (filters?.company) {
      query.company = filters.company;
    }

    if (filters?.isEnabled !== undefined) {
      query.isEnabled = filters.isEnabled;
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.chartOfAccountsModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ accountNumber: 1 }),
      this.chartOfAccountsModel.countDocuments(query),
    ]);

    return {
      data: {
        items: data.map((item) =>
          plainToInstance(ChartOfAccountsDto, JSON.parse(JSON.stringify(item))),
        ),
        pagination: {
          currentPage: page,
          totalPage: Math.ceil(total / limit),
          totalItems: total,
          perpage: limit,
        },
      },
    };
  }

  async findOne(id: string): Promise<ChartOfAccountsDto> {
    const chartOfAccounts = await this.chartOfAccountsModel.findById(id);
    if (!chartOfAccounts) {
      throw new NotFoundException('Chart of accounts not found');
    }
    return plainToInstance(
      ChartOfAccountsDto,
      JSON.parse(JSON.stringify(chartOfAccounts)),
    );
  }

  async update(
    id: string,
    updateChartOfAccountsDto: UpdateChartOfAccountsDto,
    userId: string,
  ): Promise<ChartOfAccountsDto> {
    const chartOfAccounts = await this.chartOfAccountsModel.findByIdAndUpdate(
      id,
      {
        ...updateChartOfAccountsDto,
        updatedBy: new Types.ObjectId(userId),
      },
      { new: true },
    );

    if (!chartOfAccounts) {
      throw new NotFoundException('Chart of accounts not found');
    }

    return plainToInstance(
      ChartOfAccountsDto,
      JSON.parse(JSON.stringify(chartOfAccounts)),
    );
  }

  async remove(id: string): Promise<void> {
    const result = await this.chartOfAccountsModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Chart of accounts not found');
    }
  }

  async findByAccountType(accountType: string): Promise<ChartOfAccountsDto[]> {
    const accounts = await this.chartOfAccountsModel.find({ accountType });
    return accounts.map((account) =>
      plainToInstance(ChartOfAccountsDto, JSON.parse(JSON.stringify(account))),
    );
  }

  async findByRootType(rootType: string): Promise<ChartOfAccountsDto[]> {
    const accounts = await this.chartOfAccountsModel.find({ rootType });
    return accounts.map((account) =>
      plainToInstance(ChartOfAccountsDto, JSON.parse(JSON.stringify(account))),
    );
  }

  async findByCompany(company: string): Promise<ChartOfAccountsDto[]> {
    const accounts = await this.chartOfAccountsModel.find({ company });
    return accounts.map((account) =>
      plainToInstance(ChartOfAccountsDto, JSON.parse(JSON.stringify(account))),
    );
  }

  async getHierarchy(): Promise<AccountHierarchyDto[]> {
    const accounts = await this.chartOfAccountsModel.find({ isEnabled: true });
    return this.buildAccountHierarchy(accounts);
  }

  validateChartOfAccounts(chartOfAccounts: CreateChartOfAccountsDto): boolean {
    if (
      !chartOfAccounts.accountNumber ||
      !chartOfAccounts.accountName ||
      !chartOfAccounts.accountType
    ) {
      return false;
    }

    if (!chartOfAccounts.rootType || !chartOfAccounts.company) {
      return false;
    }

    return true;
  }

  buildAccountHierarchy(
    accounts: ChartOfAccountsDocument[],
  ): AccountHierarchyDto[] {
    const accountMap = new Map<string, AccountHierarchyDto>();
    const rootAccounts: AccountHierarchyDto[] = [];

    // First pass: create account objects
    accounts.forEach((account) => {
      accountMap.set(account.accountNumber, {
        ...plainToInstance(
          ChartOfAccountsDto,
          JSON.parse(JSON.stringify(account)),
        ),
        children: [],
      });
    });

    // Second pass: build hierarchy
    accounts.forEach((account) => {
      const accountObj = accountMap.get(account.accountNumber);
      if (accountObj) {
        if (account.parentAccount && accountMap.has(account.parentAccount)) {
          const parent = accountMap.get(account.parentAccount);
          if (parent) {
            parent.children.push(accountObj);
          }
        } else {
          rootAccounts.push(accountObj);
        }
      }
    });

    return rootAccounts;
  }

  generateAccountNumber(accountType: string, parentAccount?: string): string {
    const prefix = accountType.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  }
}
