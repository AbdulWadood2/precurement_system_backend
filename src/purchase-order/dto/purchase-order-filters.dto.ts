import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';

export class PurchaseOrderFiltersDto {
  @ApiProperty({ required: false, description: 'PO number filter' })
  @IsOptional()
  @IsString()
  poNumber?: string;

  @ApiProperty({ required: false, description: 'Company filter' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ required: false, description: 'Status filter' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false, description: 'Vendor ID filter' })
  @IsOptional()
  @IsString()
  vendor_id?: string;

  @ApiProperty({ required: false, description: 'Start date filter' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false, description: 'End date filter' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false, description: 'Minimum amount filter' })
  @IsOptional()
  @IsNumber()
  minAmount?: number;

  @ApiProperty({ required: false, description: 'Maximum amount filter' })
  @IsOptional()
  @IsNumber()
  maxAmount?: number;
}
