import { ReceivingDto } from '../dto/receiving.dto';
import { ReceivingFiltersDto } from '../dto/receiving-filters.dto';
import {
  CreateReceivingDto,
  UpdateReceivingDto,
  ReceivingStatus,
} from '../dto/create-receiving.dto';

export interface IReceivingService {
  create(dto: CreateReceivingDto): Promise<ReceivingDto>;
  findAll(filters?: {
    status?: ReceivingStatus;
    vendor_id?: string;
    warehouse_id?: string;
    received_by_user_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: ReceivingDto[];
    total: number;
    page: number;
    limit: number;
  }>;
  findById(id: string): Promise<ReceivingDto>;
  update(id: string, dto: UpdateReceivingDto): Promise<ReceivingDto>;
  delete(id: string): Promise<void>;
  search(query: string, filters?: ReceivingFiltersDto): Promise<ReceivingDto[]>;
}
