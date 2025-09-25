import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IPurchaseRequestService } from './interfaces/purchase-request.service.interface';
import { IPurchaseRequestHelper } from './interfaces/purchase-request.helper.interface';
import { PurchaseRequestDto } from './dto/purchase-request.dto';
import {
  CreatePurchaseRequestDto,
  UpdatePurchaseRequestDto,
  ApprovePurchaseRequestDto,
  PurchaseRequestStatus,
  Priority,
} from './dto/create-purchase-request.dto';
import { plainToInstance } from 'class-transformer';
import { logAndThrowError } from 'src/utils/errors/error.utils';

@Injectable()
export class PurchaseRequestService implements IPurchaseRequestService {
  constructor(
    @Inject('IPurchaseRequestHelper')
    private readonly helper: IPurchaseRequestHelper,
  ) {}

  async create(dto: CreatePurchaseRequestDto): Promise<PurchaseRequestDto> {
    try {
      const pr = await this.helper.create(dto);
      return plainToInstance(
        PurchaseRequestDto,
        JSON.parse(JSON.stringify(pr)),
      );
    } catch (error) {
      throw logAndThrowError('Failed to create purchase request', error);
    }
  }

  async findAll(filters?: {
    status?: PurchaseRequestStatus;
    department?: string;
    priority?: Priority;
    requested_by_user_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: PurchaseRequestDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const { data, total, page, limit } = await this.helper.findAll(filters);
      return {
        data: data.map((pr) =>
          plainToInstance(PurchaseRequestDto, JSON.parse(JSON.stringify(pr))),
        ),
        total,
        page,
        limit,
      };
    } catch (error) {
      throw logAndThrowError('Failed to fetch purchase requests', error);
    }
  }

  async findById(id: string): Promise<PurchaseRequestDto> {
    try {
      const pr = await this.helper.findById(id);
      if (!pr) {
        throw new NotFoundException(`Purchase Request with ID ${id} not found`);
      }
      return plainToInstance(
        PurchaseRequestDto,
        JSON.parse(JSON.stringify(pr)),
      );
    } catch (error) {
      throw logAndThrowError(
        `Failed to find purchase request with ID ${id}`,
        error,
      );
    }
  }

  async update(
    id: string,
    dto: UpdatePurchaseRequestDto,
  ): Promise<PurchaseRequestDto> {
    try {
      const pr = await this.helper.update(id, dto);
      if (!pr) {
        throw new NotFoundException(`Purchase Request with ID ${id} not found`);
      }
      return plainToInstance(
        PurchaseRequestDto,
        JSON.parse(JSON.stringify(pr)),
      );
    } catch (error) {
      throw logAndThrowError(
        `Failed to update purchase request with ID ${id}`,
        error,
      );
    }
  }

  async approve(
    id: string,
    dto: ApprovePurchaseRequestDto,
    approvedByUserId: string,
  ): Promise<PurchaseRequestDto> {
    try {
      const pr = await this.helper.updateStatus(
        id,
        dto.status,
        approvedByUserId,
      );
      if (!pr) {
        throw new NotFoundException(`Purchase Request with ID ${id} not found`);
      }
      return plainToInstance(
        PurchaseRequestDto,
        JSON.parse(JSON.stringify(pr)),
      );
    } catch (error) {
      throw logAndThrowError(
        `Failed to approve/reject purchase request with ID ${id}`,
        error,
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.helper.delete(id);
    } catch (error) {
      throw logAndThrowError(
        `Failed to delete purchase request with ID ${id}`,
        error,
      );
    }
  }

  async search(query: string, filters?: any): Promise<PurchaseRequestDto[]> {
    try {
      const prs = await this.helper.search(query, filters);
      return prs.map((pr) =>
        plainToInstance(PurchaseRequestDto, JSON.parse(JSON.stringify(pr))),
      );
    } catch (error) {
      throw logAndThrowError(
        `Failed to search purchase requests with query "${query}"`,
        error,
      );
    }
  }
}
