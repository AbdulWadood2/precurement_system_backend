import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IInvoiceHelper } from '../interfaces/invoice.helper.interface';
import {
  Invoice,
  InvoiceStatus,
  PaymentStatus,
} from '../schema/invoice.schema';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  PaymentInvoiceDto,
} from '../dto/create-invoice.dto';
import { InvoiceFiltersDto } from '../dto/invoice-filters.dto';

@Injectable()
export class InvoiceHelper implements IInvoiceHelper {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
  ) {}

  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    // Validate and convert ObjectIds
    if (!Types.ObjectId.isValid(dto.purchase_order_id)) {
      throw new BadRequestException('Invalid purchase_order_id format');
    }
    if (!Types.ObjectId.isValid(dto.receiving_id)) {
      throw new BadRequestException('Invalid receiving_id format');
    }
    if (!Types.ObjectId.isValid(dto.vendor_id)) {
      throw new BadRequestException('Invalid vendor_id format');
    }
    if (!Types.ObjectId.isValid(dto.created_by_user_id)) {
      throw new BadRequestException('Invalid created_by_user_id format');
    }
    if (
      dto.approved_by_user_id &&
      !Types.ObjectId.isValid(dto.approved_by_user_id)
    ) {
      throw new BadRequestException('Invalid approved_by_user_id format');
    }

    const newInvoice = await this.invoiceModel.create({
      ...dto,
      purchase_order_id: new Types.ObjectId(dto.purchase_order_id),
      receiving_id: new Types.ObjectId(dto.receiving_id),
      vendor_id: new Types.ObjectId(dto.vendor_id),
      created_by_user_id: new Types.ObjectId(dto.created_by_user_id),
      approved_by_user_id: dto.approved_by_user_id
        ? new Types.ObjectId(dto.approved_by_user_id)
        : undefined,
      status: InvoiceStatus.DRAFT,
      payment_status: PaymentStatus.UNPAID,
      invoice_number: `INV-${Date.now()}`,
    });
    return newInvoice;
  }

  async findAll(filters?: {
    status?: InvoiceStatus;
    payment_status?: PaymentStatus;
    vendor_id?: string;
    created_by_user_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: Invoice[];
    total: number;
    page: number;
    limit: number;
  }> {
    const query: Record<string, any> = {};
    if (filters?.status) query.status = filters.status;
    if (filters?.payment_status) query.payment_status = filters.payment_status;
    if (filters?.vendor_id) {
      if (!Types.ObjectId.isValid(filters.vendor_id)) {
        throw new BadRequestException('Invalid vendor_id format');
      }
      query.vendor_id = new Types.ObjectId(filters.vendor_id);
    }
    if (filters?.created_by_user_id) {
      if (!Types.ObjectId.isValid(filters.created_by_user_id)) {
        throw new BadRequestException('Invalid created_by_user_id format');
      }
      query.created_by_user_id = new Types.ObjectId(filters.created_by_user_id);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.invoiceModel.find(query).skip(skip).limit(limit).exec(),
      this.invoiceModel.countDocuments(query).exec(),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<Invoice | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.invoiceModel.findById(new Types.ObjectId(id)).exec();
  }

  async update(id: string, dto: UpdateInvoiceDto): Promise<Invoice | null> {
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
    if (dto.receiving_id) {
      if (!Types.ObjectId.isValid(dto.receiving_id)) {
        throw new BadRequestException('Invalid receiving_id format');
      }
      updateData.receiving_id = new Types.ObjectId(dto.receiving_id);
    }
    if (dto.vendor_id) {
      if (!Types.ObjectId.isValid(dto.vendor_id)) {
        throw new BadRequestException('Invalid vendor_id format');
      }
      updateData.vendor_id = new Types.ObjectId(dto.vendor_id);
    }
    if (dto.created_by_user_id) {
      if (!Types.ObjectId.isValid(dto.created_by_user_id)) {
        throw new BadRequestException('Invalid created_by_user_id format');
      }
      updateData.created_by_user_id = new Types.ObjectId(
        dto.created_by_user_id,
      );
    }
    if (dto.approved_by_user_id) {
      if (!Types.ObjectId.isValid(dto.approved_by_user_id)) {
        throw new BadRequestException('Invalid approved_by_user_id format');
      }
      updateData.approved_by_user_id = new Types.ObjectId(
        dto.approved_by_user_id,
      );
    }

    return this.invoiceModel
      .findByIdAndUpdate(new Types.ObjectId(id), updateData, { new: true })
      .exec();
  }

  async updateStatus(
    id: string,
    status: InvoiceStatus,
    approvedByUserId: string,
  ): Promise<Invoice | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    if (!Types.ObjectId.isValid(approvedByUserId)) {
      throw new BadRequestException('Invalid approvedByUserId format');
    }

    return this.invoiceModel
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

  async recordPayment(
    id: string,
    dto: PaymentInvoiceDto,
  ): Promise<Invoice | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const invoice = await this.invoiceModel
      .findById(new Types.ObjectId(id))
      .exec();
    if (!invoice) {
      return null;
    }

    const currentPaidAmount = invoice.paid_amount || 0;
    const newPaidAmount = currentPaidAmount + dto.paid_amount;
    const totalAmount = invoice.total_amount || 0;
    const outstandingAmount = totalAmount - newPaidAmount;

    let paymentStatus = PaymentStatus.PARTIAL;
    if (newPaidAmount >= totalAmount) {
      paymentStatus = PaymentStatus.PAID;
    }

    return this.invoiceModel
      .findByIdAndUpdate(
        new Types.ObjectId(id),
        {
          paid_amount: newPaidAmount,
          outstanding_amount: outstandingAmount,
          payment_status: paymentStatus,
          payment_method: dto.payment_method,
          payment_reference: dto.payment_reference,
          payment_date: dto.payment_date
            ? new Date(dto.payment_date)
            : new Date(),
        },
        { new: true },
      )
      .exec();
  }

  async delete(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    await this.invoiceModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }

  async search(query: string, filters?: InvoiceFiltersDto): Promise<Invoice[]> {
    const searchQuery: Record<string, any> = {
      $or: [
        { invoice_number: { $regex: query, $options: 'i' } },
        { reference_number: { $regex: query, $options: 'i' } },
        { 'items.description': { $regex: query, $options: 'i' } },
      ],
    };
    if (filters?.status) searchQuery.status = filters.status;
    if (filters?.payment_status)
      searchQuery.payment_status = filters.payment_status;
    if (filters?.vendor_id) {
      if (!Types.ObjectId.isValid(filters.vendor_id)) {
        throw new BadRequestException('Invalid vendor_id format');
      }
      searchQuery.vendor_id = new Types.ObjectId(filters.vendor_id);
    }

    return this.invoiceModel.find(searchQuery).exec();
  }
}
