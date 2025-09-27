import { Injectable, Inject } from '@nestjs/common';
import { IDashboardService } from './interfaces/dashboard.service.interface';
import { IDashboardHelper } from './interfaces/dashboard.helper.interface';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';

@Injectable()
export class DashboardService implements IDashboardService {
  constructor(
    @Inject('IDashboardHelper')
    private readonly dashboardHelper: IDashboardHelper,
  ) {}

  async getStats(): Promise<DashboardStatsDto> {
    return await this.dashboardHelper.getStats();
  }
}
