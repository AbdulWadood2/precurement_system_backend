import { ReceivingStatus } from '../schema/receiving.schema';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsDateString,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export { ReceivingStatus };

export class CreateReceivingItemDto {
  @IsString()
  item_code: string;

  @IsString()
  description: string;

  @IsNumber()
  quantity_ordered: number;

  @IsNumber()
  quantity_received: number;

  @IsString()
  uom: string;

  @IsNumber()
  rate: number;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  batch_number?: string;

  @IsOptional()
  @IsDateString()
  expiry_date?: string;

  @IsOptional()
  @IsString()
  serial_number?: string;

  @IsOptional()
  @IsString()
  warehouse_location?: string;
}

export class CreateReceivingDto {
  @IsMongoId()
  purchase_order_id: string;

  @IsMongoId()
  received_by_user_id: string;

  @IsDateString()
  receiving_date: string;

  @IsMongoId()
  vendor_id: string;

  @IsMongoId()
  warehouse_id: string;

  @IsOptional()
  @IsString()
  reference_number?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReceivingItemDto)
  items: CreateReceivingItemDto[];

  @IsOptional()
  @IsNumber()
  total_quantity_received?: number;

  @IsOptional()
  @IsNumber()
  total_amount?: number;

  @IsOptional()
  @IsString()
  quality_check_notes?: string;

  @IsOptional()
  @IsDateString()
  inspection_date?: string;

  @IsOptional()
  @IsMongoId()
  inspected_by_user_id?: string;
}

export class UpdateReceivingDto {
  @IsOptional()
  @IsMongoId()
  purchase_order_id?: string;

  @IsOptional()
  @IsMongoId()
  received_by_user_id?: string;

  @IsOptional()
  @IsDateString()
  receiving_date?: string;

  @IsOptional()
  @IsMongoId()
  vendor_id?: string;

  @IsOptional()
  @IsMongoId()
  warehouse_id?: string;

  @IsOptional()
  @IsString()
  reference_number?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReceivingItemDto)
  items?: CreateReceivingItemDto[];

  @IsOptional()
  @IsNumber()
  total_quantity_received?: number;

  @IsOptional()
  @IsNumber()
  total_amount?: number;

  @IsOptional()
  status?: ReceivingStatus;

  @IsOptional()
  @IsString()
  quality_check_notes?: string;

  @IsOptional()
  @IsDateString()
  inspection_date?: string;

  @IsOptional()
  @IsMongoId()
  inspected_by_user_id?: string;
}
