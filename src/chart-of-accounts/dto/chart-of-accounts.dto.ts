import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export class ChartOfAccountsDto {
  @IsString()
  accountNumber: string;

  @IsString()
  accountName: string;

  @IsString()
  accountType: string;

  @IsOptional()
  @IsString()
  parentAccount?: string;

  @IsString()
  rootType: string;

  @IsString()
  company: string;

  @IsOptional()
  @IsString()
  accountCurrency?: string;

  @IsOptional()
  @IsNumber()
  taxRate?: number;

  @IsOptional()
  @IsString()
  balanceMustBe?: string;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  createdBy: string;

  @IsOptional()
  @IsString()
  updatedBy?: string;
}
