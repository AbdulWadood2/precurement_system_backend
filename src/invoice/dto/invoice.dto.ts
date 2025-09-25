import { Expose, Transform, Type } from 'class-transformer';
import { InvoiceStatus, PaymentStatus } from '../schema/invoice.schema';

export class InvoiceItemDto {
  item_code: string;
  description: string;
  quantity: number;
  uom: string;
  rate: number;
  amount: number;
  tax_rate?: number;
  tax_amount?: number;
}

export class InvoiceDto {
  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  @Type(() => String)
  _id: string;

  @Expose()
  invoice_number: string;

  @Expose()
  purchase_order_id: string;

  @Expose()
  receiving_id: string;

  @Expose()
  vendor_id: string;

  @Expose()
  created_by_user_id: string;

  @Expose()
  invoice_date: Date;

  @Expose()
  due_date: Date;

  @Expose()
  reference_number?: string;

  @Expose()
  notes?: string;

  @Expose()
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @Expose()
  subtotal?: number;

  @Expose()
  total_tax?: number;

  @Expose()
  total_amount?: number;

  @Expose()
  paid_amount?: number;

  @Expose()
  outstanding_amount?: number;

  @Expose()
  status: InvoiceStatus;

  @Expose()
  payment_status: PaymentStatus;

  @Expose()
  payment_terms?: string;

  @Expose()
  payment_method?: string;

  @Expose()
  payment_reference?: string;

  @Expose()
  payment_date?: Date;

  @Expose()
  approved_by_user_id?: string;

  @Expose()
  approval_notes?: string;

  @Expose()
  approved_at?: Date;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
