import { PurchaseRequest } from '../schema/purchase-request.schema';
import {
  CreatePurchaseRequestDto,
  UpdatePurchaseRequestDto,
  PurchaseRequestStatus,
  Priority,
} from '../dto/create-purchase-request.dto';
import { PurchaseRequestFiltersDto } from '../dto/purchase-request-filters.dto';

export interface IPurchaseRequestHelper {
  create(dto: CreatePurchaseRequestDto): Promise<PurchaseRequest>;
  findAll(filters?: {
    status?: PurchaseRequestStatus;
    department?: string;
    priority?: Priority;
    requested_by_user_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: PurchaseRequest[];
    total: number;
    page: number;
    limit: number;
  }>;
  findById(id: string): Promise<PurchaseRequest | null>;
  update(
    id: string,
    dto: UpdatePurchaseRequestDto,
  ): Promise<PurchaseRequest | null>;
  updateStatus(
    id: string,
    status: PurchaseRequestStatus,
    approvedByUserId: string,
  ): Promise<PurchaseRequest | null>;
  delete(id: string): Promise<void>;
  search(
    query: string,
    filters?: PurchaseRequestFiltersDto,
  ): Promise<PurchaseRequest[]>;
}
