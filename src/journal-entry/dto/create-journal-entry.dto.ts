import {
  IsString,
  IsNumber,
  IsDateString,
  IsArray,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateJournalEntryDto {
  @IsString()
  entryType: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  referenceNo?: string;

  @IsDateString()
  postingDate: string;

  @IsString()
  company: string;

  @IsOptional()
  @IsString()
  financeBook?: string;

  @IsArray()
  accountingEntries: Array<{
    account: string;
    partyType?: string;
    party?: string;
    debit: number;
    credit: number;
    description?: string;
  }>;

  @IsOptional()
  @IsString()
  userRemarks?: string;

  @IsOptional()
  @IsString()
  billNo?: string;

  @IsOptional()
  @IsDateString()
  referenceDate?: string;

  @IsOptional()
  @IsDateString()
  billDate?: string;

  @IsOptional()
  @IsBoolean()
  multiCurrency?: boolean;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
