import { Injectable, Inject } from '@nestjs/common';
import { IGeneralLedgerService } from './interfaces/general-ledger.service.interface';
import { IGeneralLedgerHelper } from './interfaces/general-ledger.helper.interface';
import { CreateGeneralLedgerDto } from './dto/create-general-ledger.dto';
import { GeneralLedgerDto } from './dto/general-ledger.dto';
import { GeneralLedgerFiltersDto } from './dto/general-ledger-filters.dto';
import { UpdateGeneralLedgerDto } from './dto/update-general-ledger.dto';
import { BalanceSheetDto } from './dto/balance-sheet.dto';
import { IncomeStatementDto } from './dto/income-statement.dto';
import { TrialBalanceDto } from './dto/trial-balance.dto';
import { WrappedResponseDto } from '../utils/pagination/dto/paginated-response.dto';
import { logAndThrowError } from 'src/utils/errors/error.utils';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GeneralLedgerService implements IGeneralLedgerService {
  constructor(
    @Inject('IGeneralLedgerHelper')
    private readonly helper: IGeneralLedgerHelper,
  ) {}

  async create(
    createGeneralLedgerDto: CreateGeneralLedgerDto,
    userId: string,
  ): Promise<GeneralLedgerDto> {
    try {
      const generalLedger = await this.helper.create(
        createGeneralLedgerDto,
        userId,
      );
      return plainToInstance(
        GeneralLedgerDto,
        JSON.parse(JSON.stringify(generalLedger)),
      );
    } catch (error) {
      throw logAndThrowError('Failed to create general ledger entry', error);
    }
  }

  async findAll(
    page: number,
    limit: number,
    filters?: GeneralLedgerFiltersDto,
  ): Promise<WrappedResponseDto<GeneralLedgerDto>> {
    try {
      const result = await this.helper.findAll(page, limit, filters);
      return result;
    } catch (error) {
      throw logAndThrowError('Failed to fetch general ledger entries', error);
    }
  }

  async findOne(id: string): Promise<GeneralLedgerDto> {
    try {
      const generalLedger = await this.helper.findOne(id);
      return plainToInstance(
        GeneralLedgerDto,
        JSON.parse(JSON.stringify(generalLedger)),
      );
    } catch (error) {
      throw logAndThrowError('General ledger entry not found', error);
    }
  }

  async update(
    id: string,
    updateGeneralLedgerDto: UpdateGeneralLedgerDto,
    userId: string,
  ): Promise<GeneralLedgerDto> {
    try {
      const generalLedger = await this.helper.update(
        id,
        updateGeneralLedgerDto,
        userId,
      );
      return plainToInstance(
        GeneralLedgerDto,
        JSON.parse(JSON.stringify(generalLedger)),
      );
    } catch (error) {
      throw logAndThrowError('Failed to update general ledger entry', error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.helper.remove(id);
    } catch (error) {
      throw logAndThrowError('Failed to delete general ledger entry', error);
    }
  }

  async findByAccount(account: string): Promise<GeneralLedgerDto[]> {
    try {
      const entries = await this.helper.findByAccount(account);
      return entries.map((entry) =>
        plainToInstance(GeneralLedgerDto, JSON.parse(JSON.stringify(entry))),
      );
    } catch (error) {
      throw logAndThrowError('Failed to fetch entries by account', error);
    }
  }

  async findByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<GeneralLedgerDto[]> {
    try {
      const entries = await this.helper.findByDateRange(startDate, endDate);
      return entries.map((entry) =>
        plainToInstance(GeneralLedgerDto, JSON.parse(JSON.stringify(entry))),
      );
    } catch (error) {
      throw logAndThrowError('Failed to fetch entries by date range', error);
    }
  }

  async getBalanceSheet(): Promise<{ data: BalanceSheetDto }> {
    try {
      const balanceSheet = await this.helper.getBalanceSheet();
      return { data: balanceSheet };
    } catch (error) {
      throw logAndThrowError('Failed to generate balance sheet', error);
    }
  }

  async getIncomeStatement(): Promise<{ data: IncomeStatementDto }> {
    try {
      const incomeStatement = await this.helper.getIncomeStatement();
      return { data: incomeStatement };
    } catch (error) {
      throw logAndThrowError('Failed to generate income statement', error);
    }
  }

  async getTrialBalance(): Promise<{ data: TrialBalanceDto }> {
    try {
      const trialBalance = await this.helper.getTrialBalance();
      return { data: trialBalance };
    } catch (error) {
      throw logAndThrowError('Failed to generate trial balance', error);
    }
  }
}
