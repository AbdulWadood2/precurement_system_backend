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

export class UpdateAdvanceTaxesAndChargesDto {
  @ApiProperty({ required: false, description: 'Tax/charge type' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ required: false, description: 'Tax/charge name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, description: 'Tax/charge amount' })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ required: false, description: 'Tax/charge rate' })
  @IsOptional()
  @IsNumber()
  rate?: number;
}

export class UpdatePaymentVoucherDto {
  @ApiProperty({ required: false, description: 'Voucher number' })
  @IsOptional()
  @IsString()
  voucherNumber?: string;

  @ApiProperty({ required: false, description: 'Company' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ required: false, description: 'Payment date' })
  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @ApiProperty({ required: false, description: 'Paid to' })
  @IsOptional()
  @IsString()
  paidTo?: string;

  @ApiProperty({ required: false, description: 'Paid amount' })
  @IsOptional()
  @IsNumber()
  paidAmount?: number;

  @ApiProperty({ required: false, description: 'Mode of payment' })
  @IsOptional()
  @IsString()
  modeOfPayment?: string;

  @ApiProperty({ required: false, description: 'Reference number' })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiProperty({ required: false, description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, description: 'Status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    required: false,
    description: 'Advance taxes and charges',
    type: [UpdateAdvanceTaxesAndChargesDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAdvanceTaxesAndChargesDto)
  advanceTaxesAndCharges?: UpdateAdvanceTaxesAndChargesDto[];
}
