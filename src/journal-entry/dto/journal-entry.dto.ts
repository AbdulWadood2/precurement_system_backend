import {
  IsString,
  IsNumber,
  IsDateString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export class JournalEntryDto {
  @IsString()
  entryId: string;

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

  @IsNumber()
  totalDebit: number;

  @IsNumber()
  totalCredit: number;

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

  @IsEnum(['Draft', 'Submitted', 'Approved', 'Posted'])
  status: string;

  @IsString()
  createdBy: string;

  @IsOptional()
  @IsString()
  updatedBy?: string;
}
