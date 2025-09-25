import { PurchaseOrderStatus } from '../schema/purchase-order.schema';

export { PurchaseOrderStatus };

export class CreatePurchaseOrderItemDto {
  item_code: string;
  description: string;
  quantity: number;
  uom: string;
  rate: number;
  amount: number;
}

export class CreatePurchaseOrderDto {
  date: Date;
  vendor_id: string;
  requested_by_user_id: string;
  company_id: string;
  apply_tax_without_holding?: boolean;
  is_subcontracted?: boolean;
  currency: string;
  price_list_id?: string;
  target_warehouse_id?: string;
  items: CreatePurchaseOrderItemDto[];
  total_quantity?: number;
  tax_category_id?: string;
  shipping_rule_id?: string;
  purchase_taxes_and_charges_template_id?: string;
  total_taxes_and_charges?: number;
  grand_total?: number;
}

export class UpdatePurchaseOrderDto {
  date?: Date;
  vendor_id?: string;
  requested_by_user_id?: string;
  company_id?: string;
  apply_tax_without_holding?: boolean;
  is_subcontracted?: boolean;
  currency?: string;
  price_list_id?: string;
  target_warehouse_id?: string;
  items?: CreatePurchaseOrderItemDto[];
  total_quantity?: number;
  tax_category_id?: string;
  shipping_rule_id?: string;
  purchase_taxes_and_charges_template_id?: string;
  total_taxes_and_charges?: number;
  grand_total?: number;
  status?: PurchaseOrderStatus;
}
