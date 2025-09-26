import { ApiProperty } from '@nestjs/swagger';

export class PaymentTotalsDto {
  @ApiProperty({ description: 'Total advance taxes and charges' })
  totalAdvanceTaxesAndCharges: number;

  @ApiProperty({ description: 'Total paid amount' })
  totalPaidAmount: number;

  @ApiProperty({ description: 'Net amount' })
  netAmount: number;
}
