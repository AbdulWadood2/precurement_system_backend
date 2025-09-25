import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum PurchaseOrderStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  SENT = 'Sent',
  INVOICED = 'Invoiced',
  RECEIVED = 'Received',
  CANCELLED = 'Cancelled',
}

export class PurchaseOrderItem {
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
}

@Schema({ timestamps: true })
export class PurchaseOrder extends Document {
  @Prop({ required: true, unique: true })
  po_number: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Vendor' })
  vendor_id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  requested_by_user_id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Company' })
  company_id: string;

  @Prop({ default: false })
  apply_tax_without_holding: boolean;

  @Prop({ default: false })
  is_subcontracted: boolean;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'PriceList' })
  price_list_id?: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Warehouse' })
  target_warehouse_id?: string;

  @Prop({ type: [PurchaseOrderItem], default: [] })
  items: PurchaseOrderItem[];

  @Prop({ required: false })
  total_quantity?: number;

  @Prop({ required: false, type: Types.ObjectId, ref: 'TaxCategory' })
  tax_category_id?: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'ShippingRule' })
  shipping_rule_id?: string;

  @Prop({
    required: false,
    type: Types.ObjectId,
    ref: 'PurchaseTaxesAndChargesTemplate',
  })
  purchase_taxes_and_charges_template_id?: string;

  @Prop({ required: false })
  total_taxes_and_charges?: number;

  @Prop({ required: false })
  grand_total?: number;

  @Prop({
    type: String,
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.DRAFT,
  })
  status: PurchaseOrderStatus;
}

export const PurchaseOrderSchema = SchemaFactory.createForClass(PurchaseOrder);
