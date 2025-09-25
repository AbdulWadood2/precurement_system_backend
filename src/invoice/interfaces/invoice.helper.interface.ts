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

export interface IInvoiceHelper {
  create(dto: CreateInvoiceDto): Promise<Invoice>;
  findAll(filters?: {
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
  }>;
  findById(id: string): Promise<Invoice | null>;
  update(id: string, dto: UpdateInvoiceDto): Promise<Invoice | null>;
  updateStatus(
    id: string,
    status: InvoiceStatus,
    approvedByUserId: string,
  ): Promise<Invoice | null>;
  recordPayment(id: string, dto: PaymentInvoiceDto): Promise<Invoice | null>;
  delete(id: string): Promise<void>;
  search(query: string, filters?: any): Promise<Invoice[]>;
}
