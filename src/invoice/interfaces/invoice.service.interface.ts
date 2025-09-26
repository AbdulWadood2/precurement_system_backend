import { InvoiceDto } from '../dto/invoice.dto';
import { InvoiceFiltersDto } from '../dto/invoice-filters.dto';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  ApproveInvoiceDto,
  PaymentInvoiceDto,
  InvoiceStatus,
  PaymentStatus,
} from '../dto/create-invoice.dto';

export interface IInvoiceService {
  create(dto: CreateInvoiceDto): Promise<InvoiceDto>;
  findAll(filters?: {
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
  }>;
  findById(id: string): Promise<InvoiceDto>;
  update(id: string, dto: UpdateInvoiceDto): Promise<InvoiceDto>;
  approve(
    id: string,
    dto: ApproveInvoiceDto,
    approvedByUserId: string,
  ): Promise<InvoiceDto>;
  recordPayment(id: string, dto: PaymentInvoiceDto): Promise<InvoiceDto>;
  delete(id: string): Promise<void>;
  search(query: string, filters?: InvoiceFiltersDto): Promise<InvoiceDto[]>;
}
