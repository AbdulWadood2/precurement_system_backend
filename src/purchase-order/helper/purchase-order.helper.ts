import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IPurchaseOrderHelper } from '../interfaces/purchase-order.helper.interface';
import {
  PurchaseOrder,
  PurchaseOrderStatus,
} from '../schema/purchase-order.schema';
import {
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
} from '../dto/create-purchase-order.dto';
import { PurchaseOrderFiltersDto } from '../dto/purchase-order-filters.dto';

@Injectable()
export class PurchaseOrderHelper implements IPurchaseOrderHelper {
  constructor(
    @InjectModel(PurchaseOrder.name)
    private purchaseOrderModel: Model<PurchaseOrder>,
  ) {}

  async create(dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    // Validate and convert ObjectIds
    if (!Types.ObjectId.isValid(dto.vendor_id)) {
      throw new BadRequestException('Invalid vendor_id format');
    }
    if (!Types.ObjectId.isValid(dto.requested_by_user_id)) {
      throw new BadRequestException('Invalid requested_by_user_id format');
    }
    if (!Types.ObjectId.isValid(dto.company_id)) {
      throw new BadRequestException('Invalid company_id format');
    }
    if (dto.price_list_id && !Types.ObjectId.isValid(dto.price_list_id)) {
      throw new BadRequestException('Invalid price_list_id format');
    }
    if (
      dto.target_warehouse_id &&
      !Types.ObjectId.isValid(dto.target_warehouse_id)
    ) {
      throw new BadRequestException('Invalid target_warehouse_id format');
    }
    if (dto.tax_category_id && !Types.ObjectId.isValid(dto.tax_category_id)) {
      throw new BadRequestException('Invalid tax_category_id format');
    }
    if (dto.shipping_rule_id && !Types.ObjectId.isValid(dto.shipping_rule_id)) {
      throw new BadRequestException('Invalid shipping_rule_id format');
    }
    if (
      dto.purchase_taxes_and_charges_template_id &&
      !Types.ObjectId.isValid(dto.purchase_taxes_and_charges_template_id)
    ) {
      throw new BadRequestException(
        'Invalid purchase_taxes_and_charges_template_id format',
      );
    }

    const newPO = await this.purchaseOrderModel.create({
      ...dto,
      vendor_id: new Types.ObjectId(dto.vendor_id),
      requested_by_user_id: new Types.ObjectId(dto.requested_by_user_id),
      company_id: new Types.ObjectId(dto.company_id),
      price_list_id: dto.price_list_id
        ? new Types.ObjectId(dto.price_list_id)
        : undefined,
      target_warehouse_id: dto.target_warehouse_id
        ? new Types.ObjectId(dto.target_warehouse_id)
        : undefined,
      tax_category_id: dto.tax_category_id
        ? new Types.ObjectId(dto.tax_category_id)
        : undefined,
      shipping_rule_id: dto.shipping_rule_id
        ? new Types.ObjectId(dto.shipping_rule_id)
        : undefined,
      purchase_taxes_and_charges_template_id:
        dto.purchase_taxes_and_charges_template_id
          ? new Types.ObjectId(dto.purchase_taxes_and_charges_template_id)
          : undefined,
      status: PurchaseOrderStatus.DRAFT,
      po_number: `PO-${Date.now()}`,
    });
    return newPO;
  }

  async findAll(filters?: {
    status?: PurchaseOrderStatus;
    vendor_id?: string;
    requested_by_user_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: PurchaseOrder[];
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
      this.purchaseOrderModel.find(query).skip(skip).limit(limit).exec(),
      this.purchaseOrderModel.countDocuments(query).exec(),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<PurchaseOrder | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.purchaseOrderModel.findById(new Types.ObjectId(id)).exec();
  }

  async update(
    id: string,
    dto: UpdatePurchaseOrderDto,
  ): Promise<PurchaseOrder | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    // Validate ObjectIds in update data and prepare update object
    const updateData: Record<string, any> = { ...dto };

    if (dto.vendor_id) {
      if (!Types.ObjectId.isValid(dto.vendor_id)) {
        throw new BadRequestException('Invalid vendor_id format');
      }
      updateData.vendor_id = new Types.ObjectId(dto.vendor_id);
    }
    if (dto.requested_by_user_id) {
      if (!Types.ObjectId.isValid(dto.requested_by_user_id)) {
        throw new BadRequestException('Invalid requested_by_user_id format');
      }
      updateData.requested_by_user_id = new Types.ObjectId(
        dto.requested_by_user_id,
      );
    }
    if (dto.company_id) {
      if (!Types.ObjectId.isValid(dto.company_id)) {
        throw new BadRequestException('Invalid company_id format');
      }
      updateData.company_id = new Types.ObjectId(dto.company_id);
    }
    if (dto.price_list_id) {
      if (!Types.ObjectId.isValid(dto.price_list_id)) {
        throw new BadRequestException('Invalid price_list_id format');
      }
      updateData.price_list_id = new Types.ObjectId(dto.price_list_id);
    }
    if (dto.target_warehouse_id) {
      if (!Types.ObjectId.isValid(dto.target_warehouse_id)) {
        throw new BadRequestException('Invalid target_warehouse_id format');
      }
      updateData.target_warehouse_id = new Types.ObjectId(
        dto.target_warehouse_id,
      );
    }
    if (dto.tax_category_id) {
      if (!Types.ObjectId.isValid(dto.tax_category_id)) {
        throw new BadRequestException('Invalid tax_category_id format');
      }
      updateData.tax_category_id = new Types.ObjectId(dto.tax_category_id);
    }
    if (dto.shipping_rule_id) {
      if (!Types.ObjectId.isValid(dto.shipping_rule_id)) {
        throw new BadRequestException('Invalid shipping_rule_id format');
      }
      updateData.shipping_rule_id = new Types.ObjectId(dto.shipping_rule_id);
    }
    if (dto.purchase_taxes_and_charges_template_id) {
      if (!Types.ObjectId.isValid(dto.purchase_taxes_and_charges_template_id)) {
        throw new BadRequestException(
          'Invalid purchase_taxes_and_charges_template_id format',
        );
      }
      updateData.purchase_taxes_and_charges_template_id = new Types.ObjectId(
        dto.purchase_taxes_and_charges_template_id,
      );
    }

    return this.purchaseOrderModel
      .findByIdAndUpdate(new Types.ObjectId(id), updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    await this.purchaseOrderModel
      .findByIdAndDelete(new Types.ObjectId(id))
      .exec();
  }

  async search(
    query: string,
    filters?: PurchaseOrderFiltersDto,
  ): Promise<PurchaseOrder[]> {
    const searchQuery: Record<string, any> = {
      $or: [
        { po_number: { $regex: query, $options: 'i' } },
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

    return this.purchaseOrderModel.find(searchQuery).exec();
  }
}
