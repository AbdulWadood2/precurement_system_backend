import { ApiProperty } from '@nestjs/swagger';

export class IncomeStatementItemDto {
  @ApiProperty({ description: 'Account number' })
  accountNumber: string;

  @ApiProperty({ description: 'Account name' })
  accountName: string;

  @ApiProperty({ description: 'Account balance' })
  balance: number;

  @ApiProperty({ description: 'Account type' })
  accountType: string;
}

export class IncomeStatementDto {
  @ApiProperty({ description: 'Revenue', type: [IncomeStatementItemDto] })
  revenue: IncomeStatementItemDto[];

  @ApiProperty({ description: 'Expenses', type: [IncomeStatementItemDto] })
  expenses: IncomeStatementItemDto[];

  @ApiProperty({ description: 'Total revenue' })
  totalRevenue: number;

  @ApiProperty({ description: 'Total expenses' })
  totalExpenses: number;

  @ApiProperty({ description: 'Net income' })
  netIncome: number;
}
