import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IJournalEntryHelper } from '../interfaces/journal-entry.helper.interface';
import { CreateJournalEntryDto } from '../dto/create-journal-entry.dto';
import { JournalEntryDto } from '../dto/journal-entry.dto';
import { JournalEntryFiltersDto } from '../dto/journal-entry-filters.dto';
import { UpdateJournalEntryDto } from '../dto/update-journal-entry.dto';
import { JournalTotalsDto } from '../dto/journal-totals.dto';
import {
  JournalEntry,
  JournalEntryDocument,
} from '../schema/journal-entry.schema';
import { WrappedResponseDto } from '../../utils/pagination/dto/paginated-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class JournalEntryHelper implements IJournalEntryHelper {
  constructor(
    @InjectModel(JournalEntry.name)
    private journalEntryModel: Model<JournalEntryDocument>,
  ) {}

  async create(
    createJournalEntryDto: CreateJournalEntryDto,
    userId: string,
  ): Promise<JournalEntryDto> {
    if (!this.validateJournalEntry(createJournalEntryDto)) {
      throw new BadRequestException('Invalid journal entry data');
    }

    const { totalDebitAmount, totalCreditAmount } = this.calculateTotals(
      createJournalEntryDto.accountingEntries,
    );

    if (!this.validateDebitCreditBalance(totalDebitAmount, totalCreditAmount)) {
      throw new BadRequestException('Debit and credit totals must be equal');
    }

    const entryId = this.generateEntryId();
    const journalEntry = new this.journalEntryModel({
      ...createJournalEntryDto,
      entryId,
      totalDebit: totalDebitAmount,
      totalCredit: totalCreditAmount,
      createdBy: new Types.ObjectId(userId),
    });

    const savedEntry = await journalEntry.save();
    return plainToInstance(
      JournalEntryDto,
      JSON.parse(JSON.stringify(savedEntry)),
    );
  }

  async findAll(
    page: number,
    limit: number,
    filters?: JournalEntryFiltersDto,
  ): Promise<WrappedResponseDto<JournalEntryDto>> {
    const query: Record<string, any> = {};

    if (filters?.entryType) {
      query.entryType = filters.entryType;
    }

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.company) {
      query.company = filters.company;
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.journalEntryModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ postingDate: -1, createdAt: -1 }),
      this.journalEntryModel.countDocuments(query),
    ]);

    return {
      data: {
        items: data.map((item) =>
          plainToInstance(JournalEntryDto, JSON.parse(JSON.stringify(item))),
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

  async findOne(id: string): Promise<JournalEntryDto> {
    const journalEntry = await this.journalEntryModel.findById(id);
    if (!journalEntry) {
      throw new NotFoundException('Journal entry not found');
    }
    return plainToInstance(
      JournalEntryDto,
      JSON.parse(JSON.stringify(journalEntry)),
    );
  }

  async update(
    id: string,
    updateJournalEntryDto: UpdateJournalEntryDto,
    userId: string,
  ): Promise<JournalEntryDto> {
    const journalEntry = await this.journalEntryModel.findByIdAndUpdate(
      id,
      {
        ...updateJournalEntryDto,
        updatedBy: new Types.ObjectId(userId),
      },
      { new: true },
    );

    if (!journalEntry) {
      throw new NotFoundException('Journal entry not found');
    }

    return plainToInstance(
      JournalEntryDto,
      JSON.parse(JSON.stringify(journalEntry)),
    );
  }

  async remove(id: string): Promise<void> {
    const result = await this.journalEntryModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Journal entry not found');
    }
  }

  async findByEntryType(entryType: string): Promise<JournalEntryDto[]> {
    const entries = await this.journalEntryModel.find({ entryType });
    return entries.map((entry) =>
      plainToInstance(JournalEntryDto, JSON.parse(JSON.stringify(entry))),
    );
  }

  async findByStatus(status: string): Promise<JournalEntryDto[]> {
    const entries = await this.journalEntryModel.find({ status });
    return entries.map((entry) =>
      plainToInstance(JournalEntryDto, JSON.parse(JSON.stringify(entry))),
    );
  }

  async findByCompany(company: string): Promise<JournalEntryDto[]> {
    const entries = await this.journalEntryModel.find({ company });
    return entries.map((entry) =>
      plainToInstance(JournalEntryDto, JSON.parse(JSON.stringify(entry))),
    );
  }

  async postEntry(id: string): Promise<JournalEntryDto> {
    const journalEntry = await this.journalEntryModel.findByIdAndUpdate(
      id,
      { status: 'Posted' },
      { new: true },
    );

    if (!journalEntry) {
      throw new NotFoundException('Journal entry not found');
    }

    return plainToInstance(
      JournalEntryDto,
      JSON.parse(JSON.stringify(journalEntry)),
    );
  }

  validateJournalEntry(journalEntry: CreateJournalEntryDto): boolean {
    if (
      !journalEntry.entryType ||
      !journalEntry.title ||
      !journalEntry.postingDate ||
      !journalEntry.accountingEntries ||
      journalEntry.accountingEntries.length === 0
    ) {
      return false;
    }

    return true;
  }

  generateEntryId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `JE${timestamp}${random}`;
  }

  calculateTotals(accountingEntries: any[]): JournalTotalsDto {
    const totalDebit = accountingEntries.reduce(
      (sum, entry) => sum + (entry.debit || 0),
      0,
    );
    const totalCredit = accountingEntries.reduce(
      (sum, entry) => sum + (entry.credit || 0),
      0,
    );

    return {
      totalDebitAmount: totalDebit,
      totalCreditAmount: totalCredit,
      isBalanced: totalDebit === totalCredit,
    };
  }

  validateDebitCreditBalance(totalDebit: number, totalCredit: number): boolean {
    return Math.abs(totalDebit - totalCredit) < 0.01;
  }
}
