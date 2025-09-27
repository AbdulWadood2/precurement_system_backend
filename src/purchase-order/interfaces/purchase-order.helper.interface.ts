import {
  PurchaseOrder,
  PurchaseOrderStatus,
} from '../schema/purchase-order.schema';
import {
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
} from '../dto/create-purchase-order.dto';
import { PurchaseOrderFiltersDto } from '../dto/purchase-order-filters.dto';

export interface IPurchaseOrderHelper {
  create(dto: CreatePurchaseOrderDto): Promise<PurchaseOrder>;
  findAll(filters?: {
    status?: PurchaseOrderStatus;
    vendor_id?: string;
    requested_by_user_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: PurchaseOrder[];
    total: number;
    page: number;
    limit: number;
  }>;
  findById(id: string): Promise<PurchaseOrder | null>;
  update(
    id: string,
    dto: UpdatePurchaseOrderDto,
  ): Promise<PurchaseOrder | null>;
  delete(id: string): Promise<void>;
  search(
    query: string,
    filters?: PurchaseOrderFiltersDto,
  ): Promise<PurchaseOrder[]>;
  countPurchaseOrders(): Promise<number>;
  getRecentPurchaseOrders(limit: number): Promise<PurchaseOrder[]>;
}
