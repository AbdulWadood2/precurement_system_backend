import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateInvoiceItemDto {
  @ApiProperty({ required: false, description: 'Item name' })
  @IsOptional()
  @IsString()
  itemName?: string;

  @ApiProperty({ required: false, description: 'Item description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, description: 'Quantity' })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({ required: false, description: 'Unit price' })
  @IsOptional()
  @IsNumber()
  unitPrice?: number;

  @ApiProperty({ required: false, description: 'Total amount' })
  @IsOptional()
  @IsNumber()
  totalAmount?: number;
}

export class UpdateInvoiceDto {
  @ApiProperty({ required: false, description: 'Invoice number' })
  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @ApiProperty({ required: false, description: 'Company' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ required: false, description: 'Invoice date' })
  @IsOptional()
  @IsDateString()
  invoiceDate?: string;

  @ApiProperty({ required: false, description: 'Due date' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ required: false, description: 'Customer name' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiProperty({ required: false, description: 'Customer email' })
  @IsOptional()
  @IsString()
  customerEmail?: string;

  @ApiProperty({ required: false, description: 'Status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false, description: 'Total amount' })
  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @ApiProperty({ required: false, description: 'Tax amount' })
  @IsOptional()
  @IsNumber()
  taxAmount?: number;

  @ApiProperty({ required: false, description: 'Grand total' })
  @IsOptional()
  @IsNumber()
  grandTotal?: number;

  @ApiProperty({
    required: false,
    description: 'Invoice items',
    type: [UpdateInvoiceItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateInvoiceItemDto)
  items?: UpdateInvoiceItemDto[];
}
