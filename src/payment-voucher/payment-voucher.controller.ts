import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  Inject,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { IPaymentVoucherService } from './interfaces/payment-voucher.service.interface';
import { CreatePaymentVoucherDto } from './dto/create-payment-voucher.dto';
import { PaymentVoucherDto } from './dto/payment-voucher.dto';
import { PaymentVoucherFiltersDto } from './dto/payment-voucher-filters.dto';
import { UpdatePaymentVoucherDto } from './dto/update-payment-voucher.dto';
import { WrappedResponseDto } from '../utils/pagination/dto/paginated-response.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../user/roles/roles.enum';

@ApiTags('payment-voucher')
@Controller('payment-voucher')
@UseGuards(AuthGuard, RolesGuard)
export class PaymentVoucherController {
  constructor(
    @Inject('IPaymentVoucherService')
    private readonly service: IPaymentVoucherService,
  ) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create payment voucher (ADMIN, MANAGER)' })
  async create(
    @Body() createPaymentVoucherDto: CreatePaymentVoucherDto,
    @Request() req,
  ): Promise<{ data: PaymentVoucherDto }> {
    const paymentVoucher = await this.service.create(
      createPaymentVoucherDto,
      req['fullUser']._id.toString(),
    );
    return {
      data: paymentVoucher,
    };
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({
    summary: 'Get all payment vouchers (ADMIN, MANAGER, MEMBER)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'vendor', required: false, type: String })
  @ApiQuery({ name: 'paymentType', required: false, type: String })
  @ApiQuery({ name: 'partyType', required: false, type: String })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('vendor') vendor?: string,
    @Query('paymentType') paymentType?: string,
    @Query('partyType') partyType?: string,
  ): Promise<WrappedResponseDto<PaymentVoucherDto>> {
    const filters: PaymentVoucherFiltersDto = {};
    if (status) filters.status = status;
    if (vendor) filters.vendor = vendor;
    if (paymentType) filters.paymentType = paymentType;
    if (partyType) filters.partyType = partyType;

    const result = await this.service.findAll(page, limit, filters);
    return result;
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({
    summary: 'Get payment voucher by ID (ADMIN, MANAGER, MEMBER)',
  })
  async findOne(@Param('id') id: string): Promise<{ data: PaymentVoucherDto }> {
    const paymentVoucher = await this.service.findOne(id);
    return { data: paymentVoucher };
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update payment voucher (ADMIN, MANAGER)' })
  async update(
    @Param('id') id: string,
    @Body() updatePaymentVoucherDto: UpdatePaymentVoucherDto,
    @Request() req,
  ): Promise<{ data: PaymentVoucherDto }> {
    const paymentVoucher = await this.service.update(
      id,
      updatePaymentVoucherDto,
      req['fullUser']._id.toString(),
    );
    return {
      data: paymentVoucher,
    };
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Delete payment voucher (ADMIN, MANAGER)' })
  async remove(@Param('id') id: string): Promise<{ data: string }> {
    await this.service.remove(id);
    return { data: 'Payment voucher deleted successfully' };
  }

  @Get('status/:status')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({
    summary: 'Get payment vouchers by status (ADMIN, MANAGER, MEMBER)',
  })
  async findByStatus(
    @Param('status') status: string,
  ): Promise<{ data: PaymentVoucherDto[] }> {
    const vouchers = await this.service.findByStatus(status);
    return { data: vouchers };
  }

  @Get('vendor/:vendor')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({
    summary: 'Get payment vouchers by vendor (ADMIN, MANAGER, MEMBER)',
  })
  async findByVendor(
    @Param('vendor') vendor: string,
  ): Promise<{ data: PaymentVoucherDto[] }> {
    const vouchers = await this.service.findByVendor(vendor);
    return { data: vouchers };
  }
}
