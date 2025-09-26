import { Injectable, Inject } from '@nestjs/common';
import { IPaymentVoucherService } from './interfaces/payment-voucher.service.interface';
import { IPaymentVoucherHelper } from './interfaces/payment-voucher.helper.interface';
import { CreatePaymentVoucherDto } from './dto/create-payment-voucher.dto';
import { PaymentVoucherDto } from './dto/payment-voucher.dto';
import { PaymentVoucherFiltersDto } from './dto/payment-voucher-filters.dto';
import { UpdatePaymentVoucherDto } from './dto/update-payment-voucher.dto';
import { WrappedResponseDto } from '../utils/pagination/dto/paginated-response.dto';
import { logAndThrowError } from 'src/utils/errors/error.utils';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PaymentVoucherService implements IPaymentVoucherService {
  constructor(
    @Inject('IPaymentVoucherHelper')
    private readonly helper: IPaymentVoucherHelper,
  ) {}

  async create(
    createPaymentVoucherDto: CreatePaymentVoucherDto,
    userId: string,
  ): Promise<PaymentVoucherDto> {
    try {
      const paymentVoucher = await this.helper.create(
        createPaymentVoucherDto,
        userId,
      );
      return plainToInstance(
        PaymentVoucherDto,
        JSON.parse(JSON.stringify(paymentVoucher)),
      );
    } catch (error) {
      throw logAndThrowError('Failed to create payment voucher', error);
    }
  }

  async findAll(
    page: number,
    limit: number,
    filters?: PaymentVoucherFiltersDto,
  ): Promise<WrappedResponseDto<PaymentVoucherDto>> {
    try {
      const result = await this.helper.findAll(page, limit, filters);
      return result;
    } catch (error) {
      throw logAndThrowError('Failed to fetch payment vouchers', error);
    }
  }

  async findOne(id: string): Promise<PaymentVoucherDto> {
    try {
      const paymentVoucher = await this.helper.findOne(id);
      return plainToInstance(
        PaymentVoucherDto,
        JSON.parse(JSON.stringify(paymentVoucher)),
      );
    } catch (error) {
      throw logAndThrowError('Payment voucher not found', error);
    }
  }

  async update(
    id: string,
    updatePaymentVoucherDto: UpdatePaymentVoucherDto,
    userId: string,
  ): Promise<PaymentVoucherDto> {
    try {
      const paymentVoucher = await this.helper.update(
        id,
        updatePaymentVoucherDto,
        userId,
      );
      return plainToInstance(
        PaymentVoucherDto,
        JSON.parse(JSON.stringify(paymentVoucher)),
      );
    } catch (error) {
      throw logAndThrowError('Failed to update payment voucher', error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.helper.remove(id);
    } catch (error) {
      throw logAndThrowError('Failed to delete payment voucher', error);
    }
  }

  async findByStatus(status: string): Promise<PaymentVoucherDto[]> {
    try {
      const vouchers = await this.helper.findByStatus(status);
      return vouchers.map((voucher) =>
        plainToInstance(PaymentVoucherDto, JSON.parse(JSON.stringify(voucher))),
      );
    } catch (error) {
      throw logAndThrowError('Failed to fetch vouchers by status', error);
    }
  }

  async findByVendor(vendor: string): Promise<PaymentVoucherDto[]> {
    try {
      const vouchers = await this.helper.findByVendor(vendor);
      return vouchers.map((voucher) =>
        plainToInstance(PaymentVoucherDto, JSON.parse(JSON.stringify(voucher))),
      );
    } catch (error) {
      throw logAndThrowError('Failed to fetch vouchers by vendor', error);
    }
  }
}
