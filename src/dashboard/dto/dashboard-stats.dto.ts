import { ApiProperty } from '@nestjs/swagger';

export class ChartDatasetDto {
  @ApiProperty({ description: 'Dataset label' })
  label: string;

  @ApiProperty({ description: 'Dataset values', type: [Number] })
  data: number[];

  @ApiProperty({ description: 'Border color', required: false })
  borderColor?: string;

  @ApiProperty({ description: 'Background color', required: false })
  backgroundColor?: string;

  @ApiProperty({ description: 'Border width', required: false })
  borderWidth?: number;

  @ApiProperty({ description: 'Line tension', required: false })
  tension?: number;
}

export class UserActivityChartDto {
  @ApiProperty({ description: 'Chart labels (dates)', type: [String] })
  labels: string[];

  @ApiProperty({ description: 'Chart datasets', type: [ChartDatasetDto] })
  datasets: ChartDatasetDto[];
}

export class ApprovalRateDataDto {
  @ApiProperty({ description: 'Number of approved requests' })
  approved: number;

  @ApiProperty({ description: 'Number of declined requests' })
  declined: number;

  @ApiProperty({ description: 'Number of pending requests' })
  pending: number;
}

export class ApprovalRateChartDto {
  @ApiProperty({ description: 'Authorization count labels', type: [String] })
  labels: string[];

  @ApiProperty({ description: 'Chart datasets', type: [ChartDatasetDto] })
  datasets: ChartDatasetDto[];
}

export class DashboardStatsDto {
  @ApiProperty({ description: 'Total number of users' })
  totalUsers: number;

  @ApiProperty({ description: 'Number of active users' })
  activeUsers: number;

  @ApiProperty({ description: 'Number of pending approvals' })
  pendingApprovals: number;

  @ApiProperty({ description: 'List of recent activities', type: [String] })
  recentActivities: string[];

  @ApiProperty({
    description: 'User activity over time chart data',
    type: UserActivityChartDto,
  })
  userActivityOverTime: UserActivityChartDto;

  @ApiProperty({
    description: 'Approval rate by auth count chart data',
    type: ApprovalRateChartDto,
  })
  approvalRateByAuthCount: ApprovalRateChartDto;

  @ApiProperty({ description: 'Total number of purchase requests' })
  totalPurchaseRequests: number;

  @ApiProperty({ description: 'Total number of purchase orders' })
  totalPurchaseOrders: number;

  @ApiProperty({ description: 'Total number of invoices' })
  totalInvoices: number;

  @ApiProperty({ description: 'Total number of receiving records' })
  totalReceivingRecords: number;

  @ApiProperty({ description: 'Total number of payment vouchers' })
  totalPaymentVouchers: number;

  @ApiProperty({ description: 'Total number of chart of accounts' })
  totalChartOfAccounts: number;

  @ApiProperty({ description: 'Total number of journal entries' })
  totalJournalEntries: number;

  @ApiProperty({ description: 'Total number of general ledger entries' })
  totalGeneralLedgerEntries: number;
}
