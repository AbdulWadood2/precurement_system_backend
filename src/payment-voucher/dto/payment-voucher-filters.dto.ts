import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';

export class PaymentVoucherFiltersDto {
  @ApiProperty({ required: false, description: 'Voucher number filter' })
  @IsOptional()
  @IsString()
  voucherNumber?: string;

  @ApiProperty({ required: false, description: 'Company filter' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ required: false, description: 'Status filter' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false, description: 'Vendor filter' })
  @IsOptional()
  @IsString()
  vendor?: string;

  @ApiProperty({ required: false, description: 'Payment type filter' })
  @IsOptional()
  @IsString()
  paymentType?: string;

  @ApiProperty({ required: false, description: 'Party type filter' })
  @IsOptional()
  @IsString()
  partyType?: string;

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
