import { PurchaseRequestDto } from '../dto/purchase-request.dto';
import { CreatePurchaseRequestDto, UpdatePurchaseRequestDto, ApprovePurchaseRequestDto, PurchaseRequestStatus, Priority } from '../dto/create-purchase-request.dto';

export interface IPurchaseRequestService {
  create(dto: CreatePurchaseRequestDto): Promise<PurchaseRequestDto>;
  findAll(filters?: {
    status?: PurchaseRequestStatus;
    department?: string;
    priority?: Priority;
    requested_by_user_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: PurchaseRequestDto[]; total: number; page: number; limit: number }>;
  findById(id: string): Promise<PurchaseRequestDto>;
  update(id: string, dto: UpdatePurchaseRequestDto): Promise<PurchaseRequestDto>;
  approve(id: string, dto: ApprovePurchaseRequestDto, approvedByUserId: string): Promise<PurchaseRequestDto>;
  delete(id: string): Promise<void>;
  search(query: string, filters?: any): Promise<PurchaseRequestDto[]>;
}