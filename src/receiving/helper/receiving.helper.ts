import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IReceivingHelper } from '../interfaces/receiving.helper.interface';
import { Receiving, ReceivingStatus } from '../schema/receiving.schema';
import {
  CreateReceivingDto,
  UpdateReceivingDto,
} from '../dto/create-receiving.dto';
import { ReceivingFiltersDto } from '../dto/receiving-filters.dto';

@Injectable()
export class ReceivingHelper implements IReceivingHelper {
  constructor(
    @InjectModel(Receiving.name) private receivingModel: Model<Receiving>,
  ) {}

  async create(dto: CreateReceivingDto): Promise<Receiving> {
    // Validate and convert ObjectIds
    if (!Types.ObjectId.isValid(dto.purchase_order_id)) {
      throw new BadRequestException('Invalid purchase_order_id format');
    }
    if (!Types.ObjectId.isValid(dto.received_by_user_id)) {
      throw new BadRequestException('Invalid received_by_user_id format');
    }
    if (!Types.ObjectId.isValid(dto.vendor_id)) {
      throw new BadRequestException('Invalid vendor_id format');
    }
    if (!Types.ObjectId.isValid(dto.warehouse_id)) {
      throw new BadRequestException('Invalid warehouse_id format');
    }
    if (
      dto.inspected_by_user_id &&
      !Types.ObjectId.isValid(dto.inspected_by_user_id)
    ) {
      throw new BadRequestException('Invalid inspected_by_user_id format');
    }

    const newReceiving = await this.receivingModel.create({
      ...dto,
      purchase_order_id: new Types.ObjectId(dto.purchase_order_id),
      received_by_user_id: new Types.ObjectId(dto.received_by_user_id),
      vendor_id: new Types.ObjectId(dto.vendor_id),
      warehouse_id: new Types.ObjectId(dto.warehouse_id),
      inspected_by_user_id: dto.inspected_by_user_id
        ? new Types.ObjectId(dto.inspected_by_user_id)
        : undefined,
      status: ReceivingStatus.DRAFT, // Default status
      receiving_number: `REC-${Date.now()}`, // Simple auto-generation
    });
    return newReceiving;
  }

  async findAll(filters?: {
    status?: ReceivingStatus;
    vendor_id?: string;
    warehouse_id?: string;
    received_by_user_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: Receiving[];
    total: number;
    page: number;
    limit: number;
  }> {
    const query: Record<string, any> = {};
    if (filters?.status) query.status = filters.status;
    if (filters?.vendor_id) {
      if (!Types.ObjectId.isValid(filters.vendor_id)) {
        throw new BadRequestException('Invalid vendor_id format');
      }
      query.vendor_id = new Types.ObjectId(filters.vendor_id);
    }
    if (filters?.warehouse_id) {
      if (!Types.ObjectId.isValid(filters.warehouse_id)) {
        throw new BadRequestException('Invalid warehouse_id format');
      }
      query.warehouse_id = new Types.ObjectId(filters.warehouse_id);
    }
    if (filters?.received_by_user_id) {
      if (!Types.ObjectId.isValid(filters.received_by_user_id)) {
        throw new BadRequestException('Invalid received_by_user_id format');
      }
      query.received_by_user_id = new Types.ObjectId(
        filters.received_by_user_id,
      );
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.receivingModel.find(query).skip(skip).limit(limit).exec(),
      this.receivingModel.countDocuments(query).exec(),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<Receiving | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.receivingModel.findById(new Types.ObjectId(id)).exec();
  }

  async update(id: string, dto: UpdateReceivingDto): Promise<Receiving | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    // Validate ObjectIds in update data and prepare update object
    const updateData: Record<string, any> = { ...dto };

    if (dto.purchase_order_id) {
      if (!Types.ObjectId.isValid(dto.purchase_order_id)) {
        throw new BadRequestException('Invalid purchase_order_id format');
      }
      updateData.purchase_order_id = new Types.ObjectId(dto.purchase_order_id);
    }
    if (dto.received_by_user_id) {
      if (!Types.ObjectId.isValid(dto.received_by_user_id)) {
        throw new BadRequestException('Invalid received_by_user_id format');
      }
      updateData.received_by_user_id = new Types.ObjectId(
        dto.received_by_user_id,
      );
    }
    if (dto.vendor_id) {
      if (!Types.ObjectId.isValid(dto.vendor_id)) {
        throw new BadRequestException('Invalid vendor_id format');
      }
      updateData.vendor_id = new Types.ObjectId(dto.vendor_id);
    }
    if (dto.warehouse_id) {
      if (!Types.ObjectId.isValid(dto.warehouse_id)) {
        throw new BadRequestException('Invalid warehouse_id format');
      }
      updateData.warehouse_id = new Types.ObjectId(dto.warehouse_id);
    }
    if (dto.inspected_by_user_id) {
      if (!Types.ObjectId.isValid(dto.inspected_by_user_id)) {
        throw new BadRequestException('Invalid inspected_by_user_id format');
      }
      updateData.inspected_by_user_id = new Types.ObjectId(
        dto.inspected_by_user_id,
      );
    }

    return this.receivingModel
      .findByIdAndUpdate(new Types.ObjectId(id), updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    await this.receivingModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }

  async search(query: string, filters?: ReceivingFiltersDto): Promise<Receiving[]> {
    const searchQuery: Record<string, any> = {
      $or: [
        { receiving_number: { $regex: query, $options: 'i' } },
        { reference_number: { $regex: query, $options: 'i' } },
        { 'items.description': { $regex: query, $options: 'i' } },
      ],
    };
    if (filters?.status) searchQuery.status = filters.status;
    if (filters?.vendor_id) {
      if (!Types.ObjectId.isValid(filters.vendor_id)) {
        throw new BadRequestException('Invalid vendor_id format');
      }
      searchQuery.vendor_id = new Types.ObjectId(filters.vendor_id);
    }
    if (filters?.warehouse_id) {
      if (!Types.ObjectId.isValid(filters.warehouse_id)) {
        throw new BadRequestException('Invalid warehouse_id format');
      }
      searchQuery.warehouse_id = new Types.ObjectId(filters.warehouse_id);
    }

    return this.receivingModel.find(searchQuery).exec();
  }
}
