import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IGeneralLedgerHelper } from '../interfaces/general-ledger.helper.interface';
import { CreateGeneralLedgerDto } from '../dto/create-general-ledger.dto';
import { GeneralLedgerDto } from '../dto/general-ledger.dto';
import { GeneralLedgerFiltersDto } from '../dto/general-ledger-filters.dto';
import { UpdateGeneralLedgerDto } from '../dto/update-general-ledger.dto';
import { BalanceSheetDto } from '../dto/balance-sheet.dto';
import { IncomeStatementDto } from '../dto/income-statement.dto';
import { TrialBalanceDto } from '../dto/trial-balance.dto';
import {
  GeneralLedger,
  GeneralLedgerDocument,
} from '../schema/general-ledger.schema';
import { WrappedResponseDto } from '../../utils/pagination/dto/paginated-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GeneralLedgerHelper implements IGeneralLedgerHelper {
  constructor(
    @InjectModel(GeneralLedger.name)
    private generalLedgerModel: Model<GeneralLedgerDocument>,
  ) {}

  async create(
    createGeneralLedgerDto: CreateGeneralLedgerDto,
    userId: string,
  ): Promise<GeneralLedgerDto> {
    if (!this.validateGeneralLedger(createGeneralLedgerDto)) {
      throw new BadRequestException('Invalid general ledger data');
    }

    const generalLedger = new this.generalLedgerModel({
      ...createGeneralLedgerDto,
      createdBy: new Types.ObjectId(userId),
    });

    const savedEntry = await generalLedger.save();
    return plainToInstance(
      GeneralLedgerDto,
      JSON.parse(JSON.stringify(savedEntry)),
    );
  }

  async findAll(
    page: number,
    limit: number,
    filters?: GeneralLedgerFiltersDto,
  ): Promise<WrappedResponseDto<GeneralLedgerDto>> {
    const query: Record<string, any> = {};

    if (filters?.account) {
      query.account = filters.account;
    }

    if (filters?.date) {
      query.date = filters.date;
    }

    if (filters?.company) {
      query.company = filters.company;
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.generalLedgerModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ date: -1, createdAt: -1 }),
      this.generalLedgerModel.countDocuments(query),
    ]);

    return {
      data: {
        items: data.map((item) =>
          plainToInstance(GeneralLedgerDto, JSON.parse(JSON.stringify(item))),
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

  async findOne(id: string): Promise<GeneralLedgerDto> {
    const generalLedger = await this.generalLedgerModel.findById(id);
    if (!generalLedger) {
      throw new NotFoundException('General ledger entry not found');
    }
    return plainToInstance(
      GeneralLedgerDto,
      JSON.parse(JSON.stringify(generalLedger)),
    );
  }

  async update(
    id: string,
    updateGeneralLedgerDto: UpdateGeneralLedgerDto,
    userId: string,
  ): Promise<GeneralLedgerDto> {
    const generalLedger = await this.generalLedgerModel.findByIdAndUpdate(
      id,
      {
        ...updateGeneralLedgerDto,
        updatedBy: new Types.ObjectId(userId),
      },
      { new: true },
    );

    if (!generalLedger) {
      throw new NotFoundException('General ledger entry not found');
    }

    return plainToInstance(
      GeneralLedgerDto,
      JSON.parse(JSON.stringify(generalLedger)),
    );
  }

  async remove(id: string): Promise<void> {
    const result = await this.generalLedgerModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('General ledger entry not found');
    }
  }

  async findByAccount(account: string): Promise<GeneralLedgerDto[]> {
    const entries = await this.generalLedgerModel.find({ account });
    return entries.map((entry) =>
      plainToInstance(GeneralLedgerDto, JSON.parse(JSON.stringify(entry))),
    );
  }

  async findByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<GeneralLedgerDto[]> {
    const entries = await this.generalLedgerModel.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });
    return entries.map((entry) =>
      plainToInstance(GeneralLedgerDto, JSON.parse(JSON.stringify(entry))),
    );
  }

  async getBalanceSheet(): Promise<BalanceSheetDto> {
    const entries = await this.generalLedgerModel.find({});
    return this.generateBalanceSheet(entries);
  }

  async getIncomeStatement(): Promise<IncomeStatementDto> {
    const entries = await this.generalLedgerModel.find({});
    return this.generateIncomeStatement(entries);
  }

  async getTrialBalance(): Promise<TrialBalanceDto> {
    const entries = await this.generalLedgerModel.find({});
    return this.generateTrialBalance(entries);
  }

  validateGeneralLedger(generalLedger: CreateGeneralLedgerDto): boolean {
    if (
      !generalLedger.date ||
      !generalLedger.account ||
      !generalLedger.accountNumber
    ) {
      return false;
    }

    if (
      generalLedger.debit === undefined &&
      generalLedger.credit === undefined
    ) {
      return false;
    }

    return true;
  }

  calculateBalance(
    previousBalance: number,
    debit: number,
    credit: number,
  ): number {
    return previousBalance + debit - credit;
  }

  generateBalanceSheet(entries: GeneralLedgerDocument[]): BalanceSheetDto {
    const assets = entries.filter(
      (entry) => (entry as any).accountType === 'Asset',
    );
    const liabilities = entries.filter(
      (entry) => (entry as any).accountType === 'Liability',
    );
    const equity = entries.filter(
      (entry) => (entry as any).accountType === 'Equity',
    );

    const assetsBalances = this.calculateAccountBalances(assets);
    const liabilitiesBalances = this.calculateAccountBalances(liabilities);
    const equityBalances = this.calculateAccountBalances(equity);

    return {
      assets: assetsBalances,
      liabilities: liabilitiesBalances,
      equity: equityBalances,
      totalAssets: assetsBalances.reduce((sum, item) => sum + item.balance, 0),
      totalLiabilities: liabilitiesBalances.reduce(
        (sum, item) => sum + item.balance,
        0,
      ),
      totalEquity: equityBalances.reduce((sum, item) => sum + item.balance, 0),
    };
  }

  generateIncomeStatement(
    entries: GeneralLedgerDocument[],
  ): IncomeStatementDto {
    const revenue = entries.filter(
      (entry) => (entry as any).accountType === 'Revenue',
    );
    const expenses = entries.filter(
      (entry) => (entry as any).accountType === 'Expense',
    );

    const revenueBalances = this.calculateAccountBalances(revenue);
    const expensesBalances = this.calculateAccountBalances(expenses);

    return {
      revenue: revenueBalances,
      expenses: expensesBalances,
      totalRevenue: revenueBalances.reduce(
        (sum, item) => sum + item.balance,
        0,
      ),
      totalExpenses: expensesBalances.reduce(
        (sum, item) => sum + item.balance,
        0,
      ),
      netIncome:
        revenueBalances.reduce((sum, item) => sum + item.balance, 0) -
        expensesBalances.reduce((sum, item) => sum + item.balance, 0),
    };
  }

  generateTrialBalance(entries: GeneralLedgerDocument[]): TrialBalanceDto {
    const accountBalances = this.calculateAccountBalances(entries);
    return {
      items: accountBalances,
      totalDebitBalance: accountBalances.reduce(
        (sum, account) => sum + account.debitBalance,
        0,
      ),
      totalCreditBalance: accountBalances.reduce(
        (sum, account) => sum + account.creditBalance,
        0,
      ),
      isBalanced:
        Math.abs(
          accountBalances.reduce(
            (sum, account) => sum + account.debitBalance,
            0,
          ) -
            accountBalances.reduce(
              (sum, account) => sum + account.creditBalance,
              0,
            ),
        ) < 0.01,
    };
  }

  private calculateAccountBalances(entries: GeneralLedgerDocument[]): any[] {
    const accountMap = new Map();

    entries.forEach((entry) => {
      const accountNumber = entry.accountNumber;
      if (!accountMap.has(accountNumber)) {
        accountMap.set(accountNumber, {
          accountNumber,
          accountName: entry.account,
          balance: 0,
          debitBalance: 0,
          creditBalance: 0,
          accountType: (entry as any).accountType || 'Unknown',
        });
      }

      const account = accountMap.get(accountNumber);
      account.debitBalance += entry.debit || 0;
      account.creditBalance += entry.credit || 0;
      account.balance = account.debitBalance - account.creditBalance;
    });

    return Array.from(accountMap.values());
  }

  async countGeneralLedgerEntries(): Promise<number> {
    return await this.generalLedgerModel.countDocuments();
  }
}
