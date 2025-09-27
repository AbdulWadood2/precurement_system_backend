import { Receiving, ReceivingStatus } from '../schema/receiving.schema';
import {
  CreateReceivingDto,
  UpdateReceivingDto,
} from '../dto/create-receiving.dto';
import { ReceivingFiltersDto } from '../dto/receiving-filters.dto';

export interface IReceivingHelper {
  create(dto: CreateReceivingDto): Promise<Receiving>;
  findAll(filters?: {
    status?: ReceivingStatus;
    vendor_id?: string;
    warehouse_id?: string;
    received_by_user_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: Receiving[];
    total: number;
    page: number;
    limit: number;
  }>;
  findById(id: string): Promise<Receiving | null>;
  update(id: string, dto: UpdateReceivingDto): Promise<Receiving | null>;
  delete(id: string): Promise<void>;
  search(query: string, filters?: ReceivingFiltersDto): Promise<Receiving[]>;
  countReceivingRecords(): Promise<number>;
}
