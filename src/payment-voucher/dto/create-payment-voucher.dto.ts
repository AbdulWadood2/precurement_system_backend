import {
  IsString,
  IsNumber,
  IsDateString,
  IsArray,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreatePaymentVoucherDto {
  @IsString()
  vendor: string;

  @IsString()
  modeOfPayment: string;

  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsDateString()
  paymentDate: string;

  @IsString()
  paymentType: string;

  @IsString()
  partyType: string;

  @IsString()
  party: string;

  @IsString()
  partyName: string;

  @IsString()
  accountPaidFrom: string;

  @IsString()
  accountCurrency: string;

  @IsNumber()
  accountBalance: number;

  @IsArray()
  advanceTaxesAndCharges: Array<{
    accountHead: string;
    taxRate: string;
    amount: number;
    totalAmount: number;
  }>;

  @IsNumber()
  totalTaxesAndCharges: number;

  @IsNumber()
  grandTotal: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsArray()
  attachments?: string[];
}
