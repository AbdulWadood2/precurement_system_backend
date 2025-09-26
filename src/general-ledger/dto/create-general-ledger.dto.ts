import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateGeneralLedgerDto {
  @IsDateString()
  date: string;

  @IsString()
  account: string;

  @IsString()
  accountNumber: string;

  @IsString()
  accountName: string;

  @IsNumber()
  debit: number;

  @IsNumber()
  credit: number;

  @IsNumber()
  balance: number;

  @IsString()
  voucherType: string;

  @IsOptional()
  @IsString()
  partyType?: string;

  @IsOptional()
  @IsString()
  voucherNo?: string;

  @IsOptional()
  @IsString()
  party?: string;

  @IsOptional()
  @IsString()
  referenceNo?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsString()
  company: string;

  @IsOptional()
  @IsString()
  financeBook?: string;

  @IsOptional()
  @IsString()
  costCenter?: string;

  @IsOptional()
  @IsString()
  project?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsNumber()
  exchangeRate?: number;
}
