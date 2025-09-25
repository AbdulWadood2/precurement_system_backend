import { InvoiceStatus, PaymentStatus } from '../schema/invoice.schema';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsDateString,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export { InvoiceStatus, PaymentStatus };

export class CreateInvoiceItemDto {
  @IsString()
  item_code: string;

  @IsString()
  description: string;

  @IsNumber()
  quantity: number;

  @IsString()
  uom: string;

  @IsNumber()
  rate: number;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  tax_rate?: number;

  @IsOptional()
  @IsNumber()
  tax_amount?: number;
}

export class CreateInvoiceDto {
  @IsMongoId()
  purchase_order_id: string;

  @IsMongoId()
  receiving_id: string;

  @IsMongoId()
  vendor_id: string;

  @IsMongoId()
  created_by_user_id: string;

  @IsDateString()
  invoice_date: string;

  @IsDateString()
  due_date: string;

  @IsOptional()
  @IsString()
  reference_number?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[];

  @IsOptional()
  @IsNumber()
  subtotal?: number;

  @IsOptional()
  @IsNumber()
  total_tax?: number;

  @IsOptional()
  @IsNumber()
  total_amount?: number;

  @IsOptional()
  @IsNumber()
  paid_amount?: number;

  @IsOptional()
  @IsNumber()
  outstanding_amount?: number;

  @IsOptional()
  @IsString()
  payment_terms?: string;

  @IsOptional()
  @IsString()
  payment_method?: string;

  @IsOptional()
  @IsString()
  payment_reference?: string;

  @IsOptional()
  @IsDateString()
  payment_date?: string;

  @IsOptional()
  @IsMongoId()
  approved_by_user_id?: string;

  @IsOptional()
  @IsString()
  approval_notes?: string;
}

export class UpdateInvoiceDto {
  @IsOptional()
  @IsMongoId()
  purchase_order_id?: string;

  @IsOptional()
  @IsMongoId()
  receiving_id?: string;

  @IsOptional()
  @IsMongoId()
  vendor_id?: string;

  @IsOptional()
  @IsMongoId()
  created_by_user_id?: string;

  @IsOptional()
  @IsDateString()
  invoice_date?: string;

  @IsOptional()
  @IsDateString()
  due_date?: string;

  @IsOptional()
  @IsString()
  reference_number?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items?: CreateInvoiceItemDto[];

  @IsOptional()
  @IsNumber()
  subtotal?: number;

  @IsOptional()
  @IsNumber()
  total_tax?: number;

  @IsOptional()
  @IsNumber()
  total_amount?: number;

  @IsOptional()
  @IsNumber()
  paid_amount?: number;

  @IsOptional()
  @IsNumber()
  outstanding_amount?: number;

  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  payment_status?: PaymentStatus;

  @IsOptional()
  @IsString()
  payment_terms?: string;

  @IsOptional()
  @IsString()
  payment_method?: string;

  @IsOptional()
  @IsString()
  payment_reference?: string;

  @IsOptional()
  @IsDateString()
  payment_date?: string;

  @IsOptional()
  @IsMongoId()
  approved_by_user_id?: string;

  @IsOptional()
  @IsString()
  approval_notes?: string;
}

export class ApproveInvoiceDto {
  @IsEnum(InvoiceStatus)
  status: InvoiceStatus;

  @IsOptional()
  @IsString()
  approval_notes?: string;
}

export class PaymentInvoiceDto {
  @IsNumber()
  paid_amount: number;

  @IsOptional()
  @IsString()
  payment_method?: string;

  @IsOptional()
  @IsString()
  payment_reference?: string;

  @IsOptional()
  @IsDateString()
  payment_date?: string;
}
