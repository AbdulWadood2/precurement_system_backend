import { Inject, Injectable } from '@nestjs/common';
import { IDashboardHelper } from '../interfaces/dashboard.helper.interface';
import {
  DashboardStatsDto,
  UserActivityChartDto,
  ApprovalRateChartDto,
} from '../dto/dashboard-stats.dto';
import { IUserHelper } from '../../user/interfaces/user.helper.interface';
import { IPurchaseRequestHelper } from '../../purchase-request/interfaces/purchase-request.helper.interface';
import { IPurchaseOrderHelper } from '../../purchase-order/interfaces/purchase-order.helper.interface';
import { IInvoiceHelper } from '../../invoice/interfaces/invoice.helper.interface';
import { IReceivingHelper } from '../../receiving/interfaces/receiving.helper.interface';
import { IPaymentVoucherHelper } from '../../payment-voucher/interfaces/payment-voucher.helper.interface';
import { IChartOfAccountsHelper } from '../../chart-of-accounts/interfaces/chart-of-accounts.helper.interface';
import { IJournalEntryHelper } from '../../journal-entry/interfaces/journal-entry.helper.interface';
import { IGeneralLedgerHelper } from '../../general-ledger/interfaces/general-ledger.helper.interface';

@Injectable()
export class DashboardHelper implements IDashboardHelper {
  constructor(
    @Inject('IUserHelper') private userHelper: IUserHelper,
    @Inject('IPurchaseRequestHelper')
    private purchaseRequestHelper: IPurchaseRequestHelper,
    @Inject('IPurchaseOrderHelper')
    private purchaseOrderHelper: IPurchaseOrderHelper,
    @Inject('IInvoiceHelper') private invoiceHelper: IInvoiceHelper,
    @Inject('IReceivingHelper') private receivingHelper: IReceivingHelper,
    @Inject('IPaymentVoucherHelper')
    private paymentVoucherHelper: IPaymentVoucherHelper,
    @Inject('IChartOfAccountsHelper')
    private chartOfAccountsHelper: IChartOfAccountsHelper,
    @Inject('IJournalEntryHelper')
    private journalEntryHelper: IJournalEntryHelper,
    @Inject('IGeneralLedgerHelper')
    private generalLedgerHelper: IGeneralLedgerHelper,
  ) {}

  async getStats(): Promise<DashboardStatsDto> {
    try {
      // Get counts from helpers
      const [
        totalUsers,
        activeUsers,
        totalPurchaseRequests,
        pendingApprovals,
        totalPurchaseOrders,
        totalInvoices,
        totalReceivingRecords,
        totalPaymentVouchers,
        totalChartOfAccounts,
        totalJournalEntries,
        totalGeneralLedgerEntries,
      ] = await Promise.all([
        this.userHelper.countUsers(),
        this.userHelper.countActiveUsers(),
        this.purchaseRequestHelper.countPurchaseRequests(),
        this.purchaseRequestHelper.countPendingApprovals(),
        this.purchaseOrderHelper.countPurchaseOrders(),
        this.invoiceHelper.countInvoices(),
        this.receivingHelper.countReceivingRecords(),
        this.paymentVoucherHelper.countPaymentVouchers(),
        this.chartOfAccountsHelper.countChartOfAccounts(),
        this.journalEntryHelper.countJournalEntries(),
        this.generalLedgerHelper.countGeneralLedgerEntries(),
      ]);

      // Get recent activities and chart data
      const [recentActivities, userActivityOverTime, approvalRateByAuthCount] =
        await Promise.all([
          this.getRecentActivities(),
          this.getUserActivityOverTime(),
          this.getApprovalRateByAuthCount(),
        ]);

      return {
        totalUsers,
        activeUsers,
        pendingApprovals,
        recentActivities,
        userActivityOverTime,
        approvalRateByAuthCount,
        totalPurchaseRequests,
        totalPurchaseOrders,
        totalInvoices,
        totalReceivingRecords,
        totalPaymentVouchers,
        totalChartOfAccounts,
        totalJournalEntries,
        totalGeneralLedgerEntries,
      };
    } catch (error) {
      throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
    }
  }

  private async getRecentActivities(): Promise<string[]> {
    const activities: string[] = [];

    try {
      // Get recent purchase requests
      const recentPurchaseRequests =
        await this.purchaseRequestHelper.getRecentPurchaseRequests(2);
      recentPurchaseRequests.forEach((pr) => {
        activities.push(
          `Purchase Request ${pr.pr_number} created by ${(pr.requested_by_user_id as any)?.display_name || 'Unknown'}`,
        );
      });

      // Get recent purchase orders
      const recentPurchaseOrders =
        await this.purchaseOrderHelper.getRecentPurchaseOrders(1);
      recentPurchaseOrders.forEach((po) => {
        activities.push(
          `Purchase Order ${po.po_number} created for ${(po.vendor_id as any)?.company || 'Unknown Vendor'}`,
        );
      });

      // Get recent invoices
      const recentInvoices = await this.invoiceHelper.getRecentInvoices(1);
      recentInvoices.forEach((invoice) => {
        activities.push(
          `Invoice ${invoice.invoice_number} from ${(invoice.vendor_id as any)?.company || 'Unknown Vendor'}`,
        );
      });

      return activities.slice(0, 5); // Return max 5 activities
    } catch (error) {
      return ['System initialized', 'Dashboard data loaded'];
    }
  }

  private async getUserActivityOverTime(): Promise<UserActivityChartDto> {
    try {
      // Get user activity data from database for the last 30 days
      const activityData: Record<string, number> = {};
      const today = new Date();

      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];

        // Get actual user registrations for this date
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const userCount = await this.userHelper.countUsersByDateRange(
          startOfDay,
          endOfDay,
        );
        activityData[dateKey] = userCount;
      }

      return {
        labels: Object.keys(activityData),
        datasets: [
          {
            label: 'User Activity',
            data: Object.values(activityData),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
          },
        ],
      };
    } catch (error) {
      return {
        labels: [],
        datasets: [
          {
            label: 'User Activity',
            data: [],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
          },
        ],
      };
    }
  }

  private async getApprovalRateByAuthCount(): Promise<ApprovalRateChartDto> {
    try {
      // Get actual approval rate data from purchase requests
      const approvalData =
        await this.purchaseRequestHelper.getApprovalRateByAuthCount();

      const labels = Object.keys(approvalData);
      const approvedData = Object.values(approvalData).map(
        (item) => item.approved,
      );
      const declinedData = Object.values(approvalData).map(
        (item) => item.declined,
      );
      const pendingData = Object.values(approvalData).map(
        (item) => item.pending,
      );

      return {
        labels,
        datasets: [
          {
            label: 'Approved',
            data: approvedData,
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1,
          },
          {
            label: 'Declined',
            data: declinedData,
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 1,
          },
          {
            label: 'Pending',
            data: pendingData,
            backgroundColor: 'rgba(245, 158, 11, 0.8)',
            borderColor: 'rgb(245, 158, 11)',
            borderWidth: 1,
          },
        ],
      };
    } catch (error) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Approved',
            data: [],
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1,
          },
          {
            label: 'Declined',
            data: [],
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 1,
          },
          {
            label: 'Pending',
            data: [],
            backgroundColor: 'rgba(245, 158, 11, 0.8)',
            borderColor: 'rgb(245, 158, 11)',
            borderWidth: 1,
          },
        ],
      };
    }
  }
}
