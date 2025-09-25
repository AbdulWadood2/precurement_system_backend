import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum InvoiceStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  APPROVED = 'Approved',
  PAID = 'Paid',
  OVERDUE = 'Overdue',
  CANCELLED = 'Cancelled',
}

export enum PaymentStatus {
  UNPAID = 'Unpaid',
  PARTIAL = 'Partial',
  PAID = 'Paid',
  OVERDUE = 'Overdue',
}

export class InvoiceItem {
  @Prop({ required: true })
  item_code: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  uom: string;

  @Prop({ required: true })
  rate: number;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: false })
  tax_rate?: number;

  @Prop({ required: false })
  tax_amount?: number;
}

@Schema({ timestamps: true })
export class Invoice extends Document {
  @Prop({ required: true, unique: true })
  invoice_number: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'PurchaseOrder' })
  purchase_order_id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Receiving' })
  receiving_id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Vendor' })
  vendor_id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  created_by_user_id: string;

  @Prop({ required: true })
  invoice_date: Date;

  @Prop({ required: true })
  due_date: Date;

  @Prop({ required: false })
  reference_number?: string;

  @Prop({ required: false })
  notes?: string;

  @Prop({ type: [InvoiceItem], default: [] })
  items: InvoiceItem[];

  @Prop({ required: false })
  subtotal?: number;

  @Prop({ required: false })
  total_tax?: number;

  @Prop({ required: false })
  total_amount?: number;

  @Prop({ required: false })
  paid_amount?: number;

  @Prop({ required: false })
  outstanding_amount?: number;

  @Prop({
    type: String,
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
  })
  status: InvoiceStatus;

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  payment_status: PaymentStatus;

  @Prop({ required: false })
  payment_terms?: string;

  @Prop({ required: false })
  payment_method?: string;

  @Prop({ required: false })
  payment_reference?: string;

  @Prop({ required: false })
  payment_date?: Date;

  @Prop({ required: false, type: Types.ObjectId, ref: 'User' })
  approved_by_user_id?: string;

  @Prop({ required: false })
  approval_notes?: string;

  @Prop({ required: false })
  approved_at?: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
