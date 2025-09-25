import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ReceivingStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  RECEIVED = 'Received',
  PARTIAL = 'Partial',
  CANCELLED = 'Cancelled',
}

export class ReceivingItem {
  @Prop({ required: true })
  item_code: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  quantity_ordered: number;

  @Prop({ required: true })
  quantity_received: number;

  @Prop({ required: true })
  uom: string;

  @Prop({ required: true })
  rate: number;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: false })
  batch_number?: string;

  @Prop({ required: false })
  expiry_date?: Date;

  @Prop({ required: false })
  serial_number?: string;

  @Prop({ required: false })
  warehouse_location?: string;
}

@Schema({ timestamps: true })
export class Receiving extends Document {
  @Prop({ required: true, unique: true })
  receiving_number: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'PurchaseOrder' })
  purchase_order_id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  received_by_user_id: string;

  @Prop({ required: true })
  receiving_date: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Vendor' })
  vendor_id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Warehouse' })
  warehouse_id: string;

  @Prop({ required: false })
  reference_number?: string;

  @Prop({ required: false })
  notes?: string;

  @Prop({ type: [ReceivingItem], default: [] })
  items: ReceivingItem[];

  @Prop({ required: false })
  total_quantity_received?: number;

  @Prop({ required: false })
  total_amount?: number;

  @Prop({
    type: String,
    enum: ReceivingStatus,
    default: ReceivingStatus.DRAFT,
  })
  status: ReceivingStatus;

  @Prop({ required: false })
  quality_check_notes?: string;

  @Prop({ required: false })
  inspection_date?: Date;

  @Prop({ required: false, type: Types.ObjectId, ref: 'User' })
  inspected_by_user_id?: string;
}

export const ReceivingSchema = SchemaFactory.createForClass(Receiving);
