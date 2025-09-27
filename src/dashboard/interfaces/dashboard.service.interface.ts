import { DashboardStatsDto } from '../dto/dashboard-stats.dto';

export interface IDashboardService {
  getStats(): Promise<DashboardStatsDto>;
}
