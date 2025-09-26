import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IPaymentVoucherHelper } from '../interfaces/payment-voucher.helper.interface';
import { CreatePaymentVoucherDto } from '../dto/create-payment-voucher.dto';
import { PaymentVoucherDto } from '../dto/payment-voucher.dto';
import { PaymentVoucherFiltersDto } from '../dto/payment-voucher-filters.dto';
import { UpdatePaymentVoucherDto } from '../dto/update-payment-voucher.dto';
import { PaymentTotalsDto } from '../dto/payment-totals.dto';
import {
  PaymentVoucher,
  PaymentVoucherDocument,
} from '../schema/payment-voucher.schema';
import { WrappedResponseDto } from '../../utils/pagination/dto/paginated-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PaymentVoucherHelper implements IPaymentVoucherHelper {
  constructor(
    @InjectModel(PaymentVoucher.name)
    private paymentVoucherModel: Model<PaymentVoucherDocument>,
  ) {}

  async create(
    createPaymentVoucherDto: CreatePaymentVoucherDto,
    userId: string,
  ): Promise<PaymentVoucherDto> {
    if (!this.validatePaymentVoucher(createPaymentVoucherDto)) {
      throw new BadRequestException('Invalid payment voucher data');
    }

    const pvNumber = this.generatePvNumber();
    const { totalAdvanceTaxesAndCharges, totalPaidAmount } = this.calculateTotals(
      createPaymentVoucherDto.advanceTaxesAndCharges,
    );

    const paymentVoucher = new this.paymentVoucherModel({
      ...createPaymentVoucherDto,
      pvNumber,
      totalAdvanceTaxesAndCharges,
      totalPaidAmount,
      createdBy: new Types.ObjectId(userId),
    });

    const savedVoucher = await paymentVoucher.save();
    return plainToInstance(
      PaymentVoucherDto,
      JSON.parse(JSON.stringify(savedVoucher)),
    );
  }

  async findAll(
    page: number,
    limit: number,
    filters?: PaymentVoucherFiltersDto,
  ): Promise<WrappedResponseDto<PaymentVoucherDto>> {
    const query: Record<string, any> = {};

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.vendor) {
      query.vendor = filters.vendor;
    }

    if (filters?.paymentType) {
      query.paymentType = filters.paymentType;
    }

    if (filters?.partyType) {
      query.partyType = filters.partyType;
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.paymentVoucherModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.paymentVoucherModel.countDocuments(query),
    ]);

    return {
      data: {
        items: data.map((item) =>
          plainToInstance(PaymentVoucherDto, JSON.parse(JSON.stringify(item))),
        ),
        pagination: {
          currentPage: page,
          totalPage: Math.ceil(total / limit),
          totalItems: total,
          perpage: limit,
        },
      },
    };
  }

  async findOne(id: string): Promise<PaymentVoucherDto> {
    const paymentVoucher = await this.paymentVoucherModel.findById(id);
    if (!paymentVoucher) {
      throw new NotFoundException('Payment voucher not found');
    }
    return plainToInstance(
      PaymentVoucherDto,
      JSON.parse(JSON.stringify(paymentVoucher)),
    );
  }

  async update(
    id: string,
    updatePaymentVoucherDto: UpdatePaymentVoucherDto,
    userId: string,
  ): Promise<PaymentVoucherDto> {
    const paymentVoucher = await this.paymentVoucherModel.findByIdAndUpdate(
      id,
      {
        ...updatePaymentVoucherDto,
        updatedBy: new Types.ObjectId(userId),
      },
      { new: true },
    );

    if (!paymentVoucher) {
      throw new NotFoundException('Payment voucher not found');
    }

    return plainToInstance(
      PaymentVoucherDto,
      JSON.parse(JSON.stringify(paymentVoucher)),
    );
  }

  async remove(id: string): Promise<void> {
    const result = await this.paymentVoucherModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Payment voucher not found');
    }
  }

  async findByStatus(status: string): Promise<PaymentVoucherDto[]> {
    const vouchers = await this.paymentVoucherModel.find({ status });
    return vouchers.map((voucher) =>
      plainToInstance(PaymentVoucherDto, JSON.parse(JSON.stringify(voucher))),
    );
  }

  async findByVendor(vendor: string): Promise<PaymentVoucherDto[]> {
    const vouchers = await this.paymentVoucherModel.find({ vendor });
    return vouchers.map((voucher) =>
      plainToInstance(PaymentVoucherDto, JSON.parse(JSON.stringify(voucher))),
    );
  }

  generatePvNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PV${timestamp}${random}`;
  }

  validatePaymentVoucher(paymentVoucher: CreatePaymentVoucherDto): boolean {
    if (
      !paymentVoucher.vendor ||
      !paymentVoucher.modeOfPayment ||
      !paymentVoucher.paymentDate ||
      !paymentVoucher.paymentType ||
      !paymentVoucher.partyType ||
      !paymentVoucher.party ||
      !paymentVoucher.partyName ||
      !paymentVoucher.accountPaidFrom ||
      !paymentVoucher.accountCurrency ||
      paymentVoucher.accountBalance === undefined
    ) {
      return false;
    }

    if (
      !paymentVoucher.advanceTaxesAndCharges ||
      paymentVoucher.advanceTaxesAndCharges.length === 0
    ) {
      return false;
    }

    return true;
  }

  calculateTotals(advanceTaxesAndCharges: any[]): PaymentTotalsDto {
    const totalTaxesAndCharges = advanceTaxesAndCharges.reduce(
      (sum, item) => sum + (item.totalAmount || 0),
      0,
    );
    const grandTotal = totalTaxesAndCharges;

    return {
      totalAdvanceTaxesAndCharges: totalTaxesAndCharges,
      totalPaidAmount: grandTotal,
      netAmount: grandTotal,
    };
  }
}
