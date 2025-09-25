import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IPurchaseRequestHelper } from '../interfaces/purchase-request.helper.interface';
import {
  PurchaseRequest,
  PurchaseRequestStatus,
  Priority,
} from '../schema/purchase-request.schema';
import {
  CreatePurchaseRequestDto,
  UpdatePurchaseRequestDto,
} from '../dto/create-purchase-request.dto';

@Injectable()
export class PurchaseRequestHelper implements IPurchaseRequestHelper {
  constructor(
    @InjectModel(PurchaseRequest.name)
    private purchaseRequestModel: Model<PurchaseRequest>,
  ) {}

  async create(dto: CreatePurchaseRequestDto): Promise<PurchaseRequest> {
    // Validate and convert ObjectIds
    if (!Types.ObjectId.isValid(dto.requested_by_user_id)) {
      throw new BadRequestException('Invalid requested_by_user_id format');
    }

    const newPR = await this.purchaseRequestModel.create({
      ...dto,
      requested_by_user_id: new Types.ObjectId(dto.requested_by_user_id),
      status: PurchaseRequestStatus.DRAFT,
      pr_number: `PR-${Date.now()}`,
    });
    return newPR;
  }

  async findAll(filters?: {
    status?: PurchaseRequestStatus;
    department?: string;
    priority?: Priority;
    requested_by_user_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: PurchaseRequest[];
    total: number;
    page: number;
    limit: number;
  }> {
    const query: any = {};
    if (filters?.status) query.status = filters.status;
    if (filters?.department) query.department = filters.department;
    if (filters?.priority) query.priority = filters.priority;
    if (filters?.requested_by_user_id) {
      if (!Types.ObjectId.isValid(filters.requested_by_user_id)) {
        throw new BadRequestException('Invalid requested_by_user_id format');
      }
      query.requested_by_user_id = new Types.ObjectId(
        filters.requested_by_user_id,
      );
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.purchaseRequestModel.find(query).skip(skip).limit(limit).exec(),
      this.purchaseRequestModel.countDocuments(query).exec(),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<PurchaseRequest | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.purchaseRequestModel.findById(new Types.ObjectId(id)).exec();
  }

  async update(
    id: string,
    dto: UpdatePurchaseRequestDto,
  ): Promise<PurchaseRequest | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    // Validate ObjectIds in update data and prepare update object
    const updateData: any = { ...dto };

    if (dto.requested_by_user_id) {
      if (!Types.ObjectId.isValid(dto.requested_by_user_id)) {
        throw new BadRequestException('Invalid requested_by_user_id format');
      }
      updateData.requested_by_user_id = new Types.ObjectId(
        dto.requested_by_user_id,
      );
    }

    return this.purchaseRequestModel
      .findByIdAndUpdate(new Types.ObjectId(id), updateData, { new: true })
      .exec();
  }

  async updateStatus(
    id: string,
    status: PurchaseRequestStatus,
    approvedByUserId: string,
  ): Promise<PurchaseRequest | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    if (!Types.ObjectId.isValid(approvedByUserId)) {
      throw new BadRequestException('Invalid approvedByUserId format');
    }

    return this.purchaseRequestModel
      .findByIdAndUpdate(
        new Types.ObjectId(id),
        {
          status,
          approved_by_user_id: new Types.ObjectId(approvedByUserId),
          approved_at: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  async delete(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    await this.purchaseRequestModel
      .findByIdAndDelete(new Types.ObjectId(id))
      .exec();
  }

  async search(query: string, filters?: any): Promise<PurchaseRequest[]> {
    const searchQuery: any = {
      $or: [
        { pr_number: { $regex: query, $options: 'i' } },
        { purpose: { $regex: query, $options: 'i' } },
        { 'items.item_description': { $regex: query, $options: 'i' } },
      ],
    };
    if (filters?.status) searchQuery.status = filters.status;
    if (filters?.department) searchQuery.department = filters.department;
    if (filters?.priority) searchQuery.priority = filters.priority;

    return this.purchaseRequestModel.find(searchQuery).exec();
  }
}
