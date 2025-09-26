import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IInvoiceService } from './interfaces/invoice.service.interface';
import { IInvoiceHelper } from './interfaces/invoice.helper.interface';
import { InvoiceDto } from './dto/invoice.dto';
import { InvoiceFiltersDto } from './dto/invoice-filters.dto';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  ApproveInvoiceDto,
  PaymentInvoiceDto,
  InvoiceStatus,
  PaymentStatus,
} from './dto/create-invoice.dto';
import { plainToInstance } from 'class-transformer';
import { logAndThrowError } from 'src/utils/errors/error.utils';

@Injectable()
export class InvoiceService implements IInvoiceService {
  constructor(
    @Inject('IInvoiceHelper')
    private readonly helper: IInvoiceHelper,
  ) {}

  async create(dto: CreateInvoiceDto): Promise<InvoiceDto> {
    try {
      const invoice = await this.helper.create(dto);
      return plainToInstance(InvoiceDto, JSON.parse(JSON.stringify(invoice)));
    } catch (error) {
      throw logAndThrowError('Failed to create invoice', error);
    }
  }

  async findAll(filters?: {
    status?: InvoiceStatus;
    payment_status?: PaymentStatus;
    vendor_id?: string;
    created_by_user_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: InvoiceDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const { data, total, page, limit } = await this.helper.findAll(filters);
      return {
        data: data.map((invoice) =>
          plainToInstance(InvoiceDto, JSON.parse(JSON.stringify(invoice))),
        ),
        total,
        page,
        limit,
      };
    } catch (error) {
      throw logAndThrowError('Failed to fetch invoices', error);
    }
  }

  async findById(id: string): Promise<InvoiceDto> {
    try {
      const invoice = await this.helper.findById(id);
      if (!invoice) {
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }
      return plainToInstance(InvoiceDto, JSON.parse(JSON.stringify(invoice)));
    } catch (error) {
      throw logAndThrowError(`Failed to find invoice with ID ${id}`, error);
    }
  }

  async update(id: string, dto: UpdateInvoiceDto): Promise<InvoiceDto> {
    try {
      const invoice = await this.helper.update(id, dto);
      if (!invoice) {
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }
      return plainToInstance(InvoiceDto, JSON.parse(JSON.stringify(invoice)));
    } catch (error) {
      throw logAndThrowError(`Failed to update invoice with ID ${id}`, error);
    }
  }

  async approve(
    id: string,
    dto: ApproveInvoiceDto,
    approvedByUserId: string,
  ): Promise<InvoiceDto> {
    try {
      const invoice = await this.helper.updateStatus(
        id,
        dto.status,
        approvedByUserId,
      );
      if (!invoice) {
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }
      return plainToInstance(InvoiceDto, JSON.parse(JSON.stringify(invoice)));
    } catch (error) {
      throw logAndThrowError(`Failed to approve invoice with ID ${id}`, error);
    }
  }

  async recordPayment(id: string, dto: PaymentInvoiceDto): Promise<InvoiceDto> {
    try {
      const invoice = await this.helper.recordPayment(id, dto);
      if (!invoice) {
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }
      return plainToInstance(InvoiceDto, JSON.parse(JSON.stringify(invoice)));
    } catch (error) {
      throw logAndThrowError(
        `Failed to record payment for invoice with ID ${id}`,
        error,
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.helper.delete(id);
    } catch (error) {
      throw logAndThrowError(`Failed to delete invoice with ID ${id}`, error);
    }
  }

  async search(
    query: string,
    filters?: InvoiceFiltersDto,
  ): Promise<InvoiceDto[]> {
    try {
      const invoices = await this.helper.search(query, filters);
      return invoices.map((invoice) =>
        plainToInstance(InvoiceDto, JSON.parse(JSON.stringify(invoice))),
      );
    } catch (error) {
      throw logAndThrowError(
        `Failed to search invoices with query "${query}"`,
        error,
      );
    }
  }
}
