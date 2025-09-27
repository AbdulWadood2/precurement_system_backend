import { CreatePaymentVoucherDto } from '../dto/create-payment-voucher.dto';
import { PaymentVoucherDto } from '../dto/payment-voucher.dto';
import { PaymentVoucherFiltersDto } from '../dto/payment-voucher-filters.dto';
import { UpdatePaymentVoucherDto } from '../dto/update-payment-voucher.dto';
import { PaymentTotalsDto } from '../dto/payment-totals.dto';
import { PaymentVoucherDocument } from '../schema/payment-voucher.schema';
import { WrappedResponseDto } from '../../utils/pagination/dto/paginated-response.dto';

export interface IPaymentVoucherHelper {
  create(
    createPaymentVoucherDto: CreatePaymentVoucherDto,
    userId: string,
  ): Promise<PaymentVoucherDto>;

  findAll(
    page: number,
    limit: number,
    filters?: PaymentVoucherFiltersDto,
  ): Promise<WrappedResponseDto<PaymentVoucherDto>>;

  findOne(id: string): Promise<PaymentVoucherDto>;

  update(
    id: string,
    updatePaymentVoucherDto: UpdatePaymentVoucherDto,
    userId: string,
  ): Promise<PaymentVoucherDto>;

  remove(id: string): Promise<void>;

  findByStatus(status: string): Promise<PaymentVoucherDto[]>;

  findByVendor(vendor: string): Promise<PaymentVoucherDto[]>;

  generatePvNumber(): string;

  validatePaymentVoucher(paymentVoucher: CreatePaymentVoucherDto): boolean;

  calculateTotals(advanceTaxesAndCharges: any[]): PaymentTotalsDto;
  countPaymentVouchers(): Promise<number>;
}
