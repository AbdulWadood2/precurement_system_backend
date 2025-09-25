export enum PurchaseRequestStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled',
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export class CreatePurchaseRequestItemDto {
  item_code: string;
  item_description: string;
  quantity: number;
  unit_of_measure: string;
  requested_by_user_id?: string;
  estimated_cost?: number;
}

export class CreatePurchaseRequestDto {
  purpose: string;
  requested_by_user_id: string;
  department: string;
  transaction_date: string;
  priority?: Priority;
  items: CreatePurchaseRequestItemDto[];
  total_amount?: number;
  notes?: string;
}

export class UpdatePurchaseRequestDto {
  purpose?: string;
  requested_by_user_id?: string;
  department?: string;
  transaction_date?: string;
  priority?: Priority;
  items?: CreatePurchaseRequestItemDto[];
  total_amount?: number;
  notes?: string;
}

export class ApprovePurchaseRequestDto {
  status: PurchaseRequestStatus;
  approval_notes?: string;
}
