import { ApiProperty } from '@nestjs/swagger';

export class TrialBalanceItemDto {
  @ApiProperty({ description: 'Account number' })
  accountNumber: string;

  @ApiProperty({ description: 'Account name' })
  accountName: string;

  @ApiProperty({ description: 'Debit balance' })
  debitBalance: number;

  @ApiProperty({ description: 'Credit balance' })
  creditBalance: number;

  @ApiProperty({ description: 'Account type' })
  accountType: string;
}

export class TrialBalanceDto {
  @ApiProperty({
    description: 'Trial balance items',
    type: [TrialBalanceItemDto],
  })
  items: TrialBalanceItemDto[];

  @ApiProperty({ description: 'Total debit balance' })
  totalDebitBalance: number;

  @ApiProperty({ description: 'Total credit balance' })
  totalCreditBalance: number;

  @ApiProperty({ description: 'Is balanced' })
  isBalanced: boolean;
}
