import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IPurchaseOrderService } from './interfaces/purchase-order.service.interface';
import { IPurchaseOrderHelper } from './interfaces/purchase-order.helper.interface';
import { PurchaseOrderDto } from './dto/purchase-order.dto';
import { CreatePurchaseOrderDto, UpdatePurchaseOrderDto, PurchaseOrderStatus } from './dto/create-purchase-order.dto';
import { plainToInstance } from 'class-transformer';
import { logAndThrowError } from 'src/utils/errors/error.utils';

@Injectable()
export class PurchaseOrderService implements IPurchaseOrderService {
  constructor(
    @Inject('IPurchaseOrderHelper') private readonly helper: IPurchaseOrderHelper,
  ) {}

  async create(dto: CreatePurchaseOrderDto): Promise<PurchaseOrderDto> {
    try {
      const po = await this.helper.create(dto);
      return plainToInstance(PurchaseOrderDto, JSON.parse(JSON.stringify(po)));
    } catch (error) {
      throw logAndThrowError('Failed to create purchase order', error);
    }
  }

  async findAll(filters?: {
    status?: PurchaseOrderStatus;
    vendor_id?: string;
    requested_by_user_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: PurchaseOrderDto[]; total: number; page: number; limit: number }> {
    try {
      const { data, total, page, limit } = await this.helper.findAll(filters);
      return {
        data: data.map((po) => plainToInstance(PurchaseOrderDto, JSON.parse(JSON.stringify(po)))),
        total,
        page,
        limit,
      };
    } catch (error) {
      throw logAndThrowError('Failed to fetch purchase orders', error);
    }
  }

  async findById(id: string): Promise<PurchaseOrderDto> {
    try {
      const po = await this.helper.findById(id);
      if (!po) {
        throw new NotFoundException(`Purchase Order with ID ${id} not found`);
      }
      return plainToInstance(PurchaseOrderDto, JSON.parse(JSON.stringify(po)));
    } catch (error) {
      throw logAndThrowError(`Failed to find purchase order with ID ${id}`, error);
    }
  }

  async update(id: string, dto: UpdatePurchaseOrderDto): Promise<PurchaseOrderDto> {
    try {
      const po = await this.helper.update(id, dto);
      if (!po) {
        throw new NotFoundException(`Purchase Order with ID ${id} not found`);
      }
      return plainToInstance(PurchaseOrderDto, JSON.parse(JSON.stringify(po)));
    } catch (error) {
      throw logAndThrowError(`Failed to update purchase order with ID ${id}`, error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.helper.delete(id);
    } catch (error) {
      throw logAndThrowError(`Failed to delete purchase order with ID ${id}`, error);
    }
  }

  async search(query: string, filters?: any): Promise<PurchaseOrderDto[]> {
    try {
      const pos = await this.helper.search(query, filters);
      return pos.map((po) => plainToInstance(PurchaseOrderDto, JSON.parse(JSON.stringify(po))));
    } catch (error) {
      throw logAndThrowError(`Failed to search purchase orders with query "${query}"`, error);
    }
  }
}
