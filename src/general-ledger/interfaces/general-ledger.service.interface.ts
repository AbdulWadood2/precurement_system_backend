import { CreateGeneralLedgerDto } from '../dto/create-general-ledger.dto';
import { GeneralLedgerDto } from '../dto/general-ledger.dto';
import { GeneralLedgerFiltersDto } from '../dto/general-ledger-filters.dto';
import { UpdateGeneralLedgerDto } from '../dto/update-general-ledger.dto';
import { BalanceSheetDto } from '../dto/balance-sheet.dto';
import { IncomeStatementDto } from '../dto/income-statement.dto';
import { TrialBalanceDto } from '../dto/trial-balance.dto';
import { WrappedResponseDto } from '../../utils/pagination/dto/paginated-response.dto';

export interface IGeneralLedgerService {
  create(
    createGeneralLedgerDto: CreateGeneralLedgerDto,
    userId: string,
  ): Promise<GeneralLedgerDto>;

  findAll(
    page: number,
    limit: number,
    filters?: GeneralLedgerFiltersDto,
  ): Promise<WrappedResponseDto<GeneralLedgerDto>>;

  findOne(id: string): Promise<GeneralLedgerDto>;

  update(
    id: string,
    updateGeneralLedgerDto: UpdateGeneralLedgerDto,
    userId: string,
  ): Promise<GeneralLedgerDto>;

  remove(id: string): Promise<void>;

  findByAccount(account: string): Promise<GeneralLedgerDto[]>;

  findByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<GeneralLedgerDto[]>;

  getBalanceSheet(): Promise<{ data: BalanceSheetDto }>;

  getIncomeStatement(): Promise<{ data: IncomeStatementDto }>;

  getTrialBalance(): Promise<{ data: TrialBalanceDto }>;
}
