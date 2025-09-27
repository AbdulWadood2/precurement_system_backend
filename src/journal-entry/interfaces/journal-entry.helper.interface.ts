import { CreateJournalEntryDto } from '../dto/create-journal-entry.dto';
import { JournalEntryDto } from '../dto/journal-entry.dto';
import { JournalEntryFiltersDto } from '../dto/journal-entry-filters.dto';
import { UpdateJournalEntryDto } from '../dto/update-journal-entry.dto';
import { JournalTotalsDto } from '../dto/journal-totals.dto';
import { JournalEntryDocument } from '../schema/journal-entry.schema';
import { WrappedResponseDto } from '../../utils/pagination/dto/paginated-response.dto';

export interface IJournalEntryHelper {
  create(
    createJournalEntryDto: CreateJournalEntryDto,
    userId: string,
  ): Promise<JournalEntryDto>;

  findAll(
    page: number,
    limit: number,
    filters?: JournalEntryFiltersDto,
  ): Promise<WrappedResponseDto<JournalEntryDto>>;

  findOne(id: string): Promise<JournalEntryDto>;

  update(
    id: string,
    updateJournalEntryDto: UpdateJournalEntryDto,
    userId: string,
  ): Promise<JournalEntryDto>;

  remove(id: string): Promise<void>;

  findByEntryType(entryType: string): Promise<JournalEntryDto[]>;

  findByStatus(status: string): Promise<JournalEntryDto[]>;

  findByCompany(company: string): Promise<JournalEntryDto[]>;

  postEntry(id: string): Promise<JournalEntryDto>;

  validateJournalEntry(journalEntry: CreateJournalEntryDto): boolean;

  generateEntryId(): string;

  calculateTotals(accountingEntries: any[]): JournalTotalsDto;

  validateDebitCreditBalance(totalDebit: number, totalCredit: number): boolean;
  countJournalEntries(): Promise<number>;
}
