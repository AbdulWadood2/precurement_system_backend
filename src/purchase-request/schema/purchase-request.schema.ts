import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  PurchaseRequestStatus,
  Priority,
} from '../dto/create-purchase-request.dto';

export { PurchaseRequestStatus, Priority };

export class PurchaseRequestItem {
  @Prop({ required: true })
  item_code: string;

  @Prop({ required: true })
  item_description: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unit_of_measure: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'User' })
  requested_by_user_id?: string;

  @Prop({ required: false })
  estimated_cost?: number;
}

@Schema({ timestamps: true })
export class PurchaseRequest extends Document {
  @Prop({ required: true, unique: true })
  pr_number: string;

  @Prop({ required: true })
  purpose: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  requested_by_user_id: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true, type: Date })
  transaction_date: Date;

  @Prop({ type: String, enum: Priority, default: Priority.MEDIUM })
  priority: Priority;

  @Prop({
    type: String,
    enum: PurchaseRequestStatus,
    default: PurchaseRequestStatus.DRAFT,
  })
  status: PurchaseRequestStatus;

  @Prop({ type: [PurchaseRequestItem], default: [] })
  items: PurchaseRequestItem[];

  @Prop({ required: false })
  total_amount?: number;

  @Prop({ required: false })
  notes?: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'User' })
  approved_by_user_id?: string;

  @Prop({ required: false })
  approval_notes?: string;

  @Prop({ required: false })
  approved_at?: Date;
}

export const PurchaseRequestSchema =
  SchemaFactory.createForClass(PurchaseRequest);
