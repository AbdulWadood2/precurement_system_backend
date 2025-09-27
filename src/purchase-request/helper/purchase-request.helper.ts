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
import { PurchaseRequestFiltersDto } from '../dto/purchase-request-filters.dto';

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
    const query: Record<string, any> = {};
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
    const updateData: Record<string, any> = { ...dto };

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

  async search(
    query: string,
    filters?: PurchaseRequestFiltersDto,
  ): Promise<PurchaseRequest[]> {
    const searchQuery: Record<string, any> = {
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

  async countPurchaseRequests(): Promise<number> {
    return await this.purchaseRequestModel.countDocuments();
  }

  async countPendingApprovals(): Promise<number> {
    return await this.purchaseRequestModel.countDocuments({
      status: 'pending',
    });
  }

  async getRecentPurchaseRequests(limit: number): Promise<PurchaseRequest[]> {
    return await this.purchaseRequestModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('requested_by_user_id', 'display_name')
      .exec();
  }

  async getApprovalRateByAuthCount(): Promise<Record<string, { approved: number; declined: number; pending: number }>> {
    try {
      // Get approval rate data grouped by authorization count
      const pipeline = [
        {
          $group: {
            _id: '$authorization_count',
            approved: {
              $sum: {
                $cond: [{ $eq: ['$status', 'approved'] }, 1, 0]
              }
            },
            declined: {
              $sum: {
                $cond: [{ $eq: ['$status', 'declined'] }, 1, 0]
              }
            },
            pending: {
              $sum: {
                $cond: [{ $eq: ['$status', 'pending'] }, 1, 0]
              }
            }
          }
        },
        {
          $sort: { _id: 1 as 1 }
        }
      ];

      const results = await this.purchaseRequestModel.aggregate(pipeline).exec();
      
      const approvalData: Record<string, { approved: number; declined: number; pending: number }> = {};
      
      results.forEach(result => {
        const authCount = result._id?.toString() || '0';
        approvalData[authCount] = {
          approved: result.approved || 0,
          declined: result.declined || 0,
          pending: result.pending || 0
        };
      });

      // Ensure we have data for common authorization counts
      const defaultData = { approved: 0, declined: 0, pending: 0 };
      for (let i = 1; i <= 5; i++) {
        if (!approvalData[i.toString()]) {
          approvalData[i.toString()] = { ...defaultData };
        }
      }

      // Group 5+ together
      const fivePlus = { approved: 0, declined: 0, pending: 0 };
      Object.keys(approvalData).forEach(key => {
        const num = parseInt(key);
        if (num >= 5) {
          fivePlus.approved += approvalData[key].approved;
          fivePlus.declined += approvalData[key].declined;
          fivePlus.pending += approvalData[key].pending;
        }
      });

      // Remove individual 5+ entries and add combined
      Object.keys(approvalData).forEach(key => {
        const num = parseInt(key);
        if (num >= 5) {
          delete approvalData[key];
        }
      });
      approvalData['5+'] = fivePlus;

      return approvalData;
    } catch (error) {
      // Return default data if aggregation fails
      return {
        '1': { approved: 0, declined: 0, pending: 0 },
        '2': { approved: 0, declined: 0, pending: 0 },
        '3': { approved: 0, declined: 0, pending: 0 },
        '4': { approved: 0, declined: 0, pending: 0 },
        '5+': { approved: 0, declined: 0, pending: 0 },
      };
    }
  }
}
