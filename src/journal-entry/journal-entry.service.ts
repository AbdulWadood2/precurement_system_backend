import { Injectable, Inject } from '@nestjs/common';
import { IJournalEntryService } from './interfaces/journal-entry.service.interface';
import { IJournalEntryHelper } from './interfaces/journal-entry.helper.interface';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { JournalEntryDto } from './dto/journal-entry.dto';
import { JournalEntryFiltersDto } from './dto/journal-entry-filters.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { WrappedResponseDto } from '../utils/pagination/dto/paginated-response.dto';
import { logAndThrowError } from 'src/utils/errors/error.utils';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class JournalEntryService implements IJournalEntryService {
  constructor(
    @Inject('IJournalEntryHelper') private readonly helper: IJournalEntryHelper,
  ) {}

  async create(
    createJournalEntryDto: CreateJournalEntryDto,
    userId: string,
  ): Promise<JournalEntryDto> {
    try {
      const journalEntry = await this.helper.create(
        createJournalEntryDto,
        userId,
      );
      return plainToInstance(
        JournalEntryDto,
        JSON.parse(JSON.stringify(journalEntry)),
      );
    } catch (error) {
      throw logAndThrowError('Failed to create journal entry', error);
    }
  }

  async findAll(
    page: number,
    limit: number,
    filters?: JournalEntryFiltersDto,
  ): Promise<WrappedResponseDto<JournalEntryDto>> {
    try {
      const result = await this.helper.findAll(page, limit, filters);
      return result;
    } catch (error) {
      throw logAndThrowError('Failed to fetch journal entries', error);
    }
  }

  async findOne(id: string): Promise<JournalEntryDto> {
    try {
      const journalEntry = await this.helper.findOne(id);
      return plainToInstance(
        JournalEntryDto,
        JSON.parse(JSON.stringify(journalEntry)),
      );
    } catch (error) {
      throw logAndThrowError('Journal entry not found', error);
    }
  }

  async update(
    id: string,
    updateJournalEntryDto: UpdateJournalEntryDto,
    userId: string,
  ): Promise<JournalEntryDto> {
    try {
      const journalEntry = await this.helper.update(
        id,
        updateJournalEntryDto,
        userId,
      );
      return plainToInstance(
        JournalEntryDto,
        JSON.parse(JSON.stringify(journalEntry)),
      );
    } catch (error) {
      throw logAndThrowError('Failed to update journal entry', error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.helper.remove(id);
    } catch (error) {
      throw logAndThrowError('Failed to delete journal entry', error);
    }
  }

  async findByEntryType(entryType: string): Promise<JournalEntryDto[]> {
    try {
      const entries = await this.helper.findByEntryType(entryType);
      return entries.map((entry) =>
        plainToInstance(JournalEntryDto, JSON.parse(JSON.stringify(entry))),
      );
    } catch (error) {
      throw logAndThrowError('Failed to fetch entries by type', error);
    }
  }

  async findByStatus(status: string): Promise<JournalEntryDto[]> {
    try {
      const entries = await this.helper.findByStatus(status);
      return entries.map((entry) =>
        plainToInstance(JournalEntryDto, JSON.parse(JSON.stringify(entry))),
      );
    } catch (error) {
      throw logAndThrowError('Failed to fetch entries by status', error);
    }
  }

  async findByCompany(company: string): Promise<JournalEntryDto[]> {
    try {
      const entries = await this.helper.findByCompany(company);
      return entries.map((entry) =>
        plainToInstance(JournalEntryDto, JSON.parse(JSON.stringify(entry))),
      );
    } catch (error) {
      throw logAndThrowError('Failed to fetch entries by company', error);
    }
  }

  async postEntry(id: string): Promise<JournalEntryDto> {
    try {
      const journalEntry = await this.helper.postEntry(id);
      return plainToInstance(
        JournalEntryDto,
        JSON.parse(JSON.stringify(journalEntry)),
      );
    } catch (error) {
      throw logAndThrowError('Failed to post journal entry', error);
    }
  }
}
