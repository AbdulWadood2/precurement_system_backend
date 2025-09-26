import { ApiProperty } from '@nestjs/swagger';

export class JournalTotalsDto {
  @ApiProperty({ description: 'Total debit amount' })
  totalDebitAmount: number;

  @ApiProperty({ description: 'Total credit amount' })
  totalCreditAmount: number;

  @ApiProperty({ description: 'Is balanced' })
  isBalanced: boolean;
}
