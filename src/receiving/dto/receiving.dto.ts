import { Expose, Transform, Type } from 'class-transformer';
import { ReceivingStatus } from '../schema/receiving.schema';

export class ReceivingItemDto {
  item_code: string;
  description: string;
  quantity_ordered: number;
  quantity_received: number;
  uom: string;
  rate: number;
  amount: number;
  batch_number?: string;
  expiry_date?: Date;
  serial_number?: string;
  warehouse_location?: string;
}

export class ReceivingDto {
  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  @Type(() => String)
  _id: string;

  @Expose()
  receiving_number: string;

  @Expose()
  purchase_order_id: string;

  @Expose()
  received_by_user_id: string;

  @Expose()
  receiving_date: Date;

  @Expose()
  vendor_id: string;

  @Expose()
  warehouse_id: string;

  @Expose()
  reference_number?: string;

  @Expose()
  notes?: string;

  @Expose()
  @Type(() => ReceivingItemDto)
  items: ReceivingItemDto[];

  @Expose()
  total_quantity_received?: number;

  @Expose()
  total_amount?: number;

  @Expose()
  status: ReceivingStatus;

  @Expose()
  quality_check_notes?: string;

  @Expose()
  inspection_date?: Date;

  @Expose()
  inspected_by_user_id?: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
