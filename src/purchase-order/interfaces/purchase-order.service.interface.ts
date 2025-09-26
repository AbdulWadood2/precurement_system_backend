import { PurchaseOrderDto } from '../dto/purchase-order.dto';
import { PurchaseOrderFiltersDto } from '../dto/purchase-order-filters.dto';
import {
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
  PurchaseOrderStatus,
} from '../dto/create-purchase-order.dto';

export interface IPurchaseOrderService {
  create(dto: CreatePurchaseOrderDto): Promise<PurchaseOrderDto>;
  findAll(filters?: {
    status?: PurchaseOrderStatus;
    vendor_id?: string;
    requested_by_user_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: PurchaseOrderDto[];
    total: number;
    page: number;
    limit: number;
  }>;
  findById(id: string): Promise<PurchaseOrderDto>;
  update(id: string, dto: UpdatePurchaseOrderDto): Promise<PurchaseOrderDto>;
  delete(id: string): Promise<void>;
  search(
    query: string,
    filters?: PurchaseOrderFiltersDto,
  ): Promise<PurchaseOrderDto[]>;
}
