import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IReceivingService } from './interfaces/receiving.service.interface';
import { IReceivingHelper } from './interfaces/receiving.helper.interface';
import { ReceivingDto } from './dto/receiving.dto';
import { ReceivingFiltersDto } from './dto/receiving-filters.dto';
import {
  CreateReceivingDto,
  UpdateReceivingDto,
  ReceivingStatus,
} from './dto/create-receiving.dto';
import { plainToInstance } from 'class-transformer';
import { logAndThrowError } from 'src/utils/errors/error.utils';

@Injectable()
export class ReceivingService implements IReceivingService {
  constructor(
    @Inject('IReceivingHelper')
    private readonly helper: IReceivingHelper,
  ) {}

  async create(dto: CreateReceivingDto): Promise<ReceivingDto> {
    try {
      const receiving = await this.helper.create(dto);
      return plainToInstance(
        ReceivingDto,
        JSON.parse(JSON.stringify(receiving)),
      );
    } catch (error) {
      throw logAndThrowError('Failed to create receiving', error);
    }
  }

  async findAll(filters?: {
    status?: ReceivingStatus;
    vendor_id?: string;
    warehouse_id?: string;
    received_by_user_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: ReceivingDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const { data, total, page, limit } = await this.helper.findAll(filters);
      return {
        data: data.map((receiving) =>
          plainToInstance(ReceivingDto, JSON.parse(JSON.stringify(receiving))),
        ),
        total,
        page,
        limit,
      };
    } catch (error) {
      throw logAndThrowError('Failed to fetch receiving records', error);
    }
  }

  async findById(id: string): Promise<ReceivingDto> {
    try {
      const receiving = await this.helper.findById(id);
      if (!receiving) {
        throw new NotFoundException(`Receiving with ID ${id} not found`);
      }
      return plainToInstance(
        ReceivingDto,
        JSON.parse(JSON.stringify(receiving)),
      );
    } catch (error) {
      throw logAndThrowError(`Failed to find receiving with ID ${id}`, error);
    }
  }

  async update(id: string, dto: UpdateReceivingDto): Promise<ReceivingDto> {
    try {
      const receiving = await this.helper.update(id, dto);
      if (!receiving) {
        throw new NotFoundException(`Receiving with ID ${id} not found`);
      }
      return plainToInstance(
        ReceivingDto,
        JSON.parse(JSON.stringify(receiving)),
      );
    } catch (error) {
      throw logAndThrowError(`Failed to update receiving with ID ${id}`, error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.helper.delete(id);
    } catch (error) {
      throw logAndThrowError(`Failed to delete receiving with ID ${id}`, error);
    }
  }

  async search(
    query: string,
    filters?: ReceivingFiltersDto,
  ): Promise<ReceivingDto[]> {
    try {
      const receivingRecords = await this.helper.search(query, filters);
      return receivingRecords.map((receiving) =>
        plainToInstance(ReceivingDto, JSON.parse(JSON.stringify(receiving))),
      );
    } catch (error) {
      throw logAndThrowError(
        `Failed to search receiving records with query "${query}"`,
        error,
      );
    }
  }
}
