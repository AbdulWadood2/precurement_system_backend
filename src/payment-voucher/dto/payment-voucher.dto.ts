import {
  IsString,
  IsNumber,
  IsDateString,
  IsArray,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class PaymentVoucherDto {
  @IsString()
  pvNumber: string;

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

  @IsEnum(['Draft', 'Submitted', 'Approved', 'Paid', 'Cancelled'])
  status: string;

  @IsOptional()
  @IsString()
  preparedBy?: string;

  @IsOptional()
  @IsString()
  checkedBy?: string;

  @IsOptional()
  @IsString()
  approvedBy?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsArray()
  attachments?: string[];

  @IsString()
  createdBy: string;

  @IsOptional()
  @IsString()
  updatedBy?: string;
}
