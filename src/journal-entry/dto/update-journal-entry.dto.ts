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

export class UpdateAccountingEntryDto {
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

  @ApiProperty({ required: false, description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateJournalEntryDto {
  @ApiProperty({ required: false, description: 'Entry number' })
  @IsOptional()
  @IsString()
  entryNumber?: string;

  @ApiProperty({ required: false, description: 'Company' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ required: false, description: 'Entry date' })
  @IsOptional()
  @IsDateString()
  entryDate?: string;

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
    description: 'Accounting entries',
    type: [UpdateAccountingEntryDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAccountingEntryDto)
  accountingEntries?: UpdateAccountingEntryDto[];
}
