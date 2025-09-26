import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class UpdateGeneralLedgerDto {
  @ApiProperty({ required: false, description: 'Account number' })
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiProperty({ required: false, description: 'Account name' })
  @IsOptional()
  @IsString()
  accountName?: string;

  @ApiProperty({ required: false, description: 'Debit amount' })
  @IsOptional()
  @IsNumber()
  debitAmount?: number;

  @ApiProperty({ required: false, description: 'Credit amount' })
  @IsOptional()
  @IsNumber()
  creditAmount?: number;

  @ApiProperty({ required: false, description: 'Transaction date' })
  @IsOptional()
  @IsDateString()
  transactionDate?: string;

  @ApiProperty({ required: false, description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, description: 'Reference number' })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiProperty({ required: false, description: 'Company' })
  @IsOptional()
  @IsString()
  company?: string;
}
