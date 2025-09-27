import { DashboardStatsDto } from '../dto/dashboard-stats.dto';

export interface IDashboardHelper {
  getStats(): Promise<DashboardStatsDto>;
}
