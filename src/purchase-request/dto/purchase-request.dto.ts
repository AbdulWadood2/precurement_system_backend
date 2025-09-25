import { PurchaseRequestStatus, Priority } from '../dto/create-purchase-request.dto';

export class PurchaseRequestItemDto {
  item_code: string;
  item_description: string;
  quantity: number;
  unit_of_measure: string;
  requested_by_user_id?: string;
  estimated_cost?: number;
}

export class PurchaseRequestDto {
  _id: string;
  pr_number: string;
  purpose: string;
  requested_by_user_id: string;
  department: string;
  transaction_date: Date;
  priority: Priority;
  status: PurchaseRequestStatus;
  items: PurchaseRequestItemDto[];
  total_amount?: number;
  notes?: string;
  approved_by_user_id?: string;
  approval_notes?: string;
  approved_at?: Date;
  createdAt: string;
  updatedAt: string;
}