import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  Inject,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from 'src/user/roles/roles.enum';
import { IInvoiceService } from './interfaces/invoice.service.interface';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  ApproveInvoiceDto,
  PaymentInvoiceDto,
  InvoiceStatus,
  PaymentStatus,
} from './dto/create-invoice.dto';
import { InvoiceDto } from './dto/invoice.dto';
import { WrappedResponseDto } from 'src/utils/pagination/dto/paginated-response.dto';

@ApiTags('invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(
    @Inject('IInvoiceService')
    private readonly service: IInvoiceService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new invoice' })
  async create(@Body() dto: CreateInvoiceDto): Promise<{ data: InvoiceDto }> {
    const invoice = await this.service.create(dto);
    return { data: invoice };
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiQuery({ name: 'status', required: false, enum: InvoiceStatus })
  @ApiQuery({ name: 'payment_status', required: false, enum: PaymentStatus })
  @ApiQuery({ name: 'vendor_id', required: false, type: String })
  @ApiQuery({ name: 'created_by_user_id', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('status') status?: InvoiceStatus,
    @Query('payment_status') payment_status?: PaymentStatus,
    @Query('vendor_id') vendor_id?: string,
    @Query('created_by_user_id') created_by_user_id?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<WrappedResponseDto<InvoiceDto>> {
    const {
      data,
      total,
      page: currentPage,
      limit: currentLimit,
    } = await this.service.findAll({
      status,
      payment_status,
      vendor_id,
      created_by_user_id,
      page,
      limit,
    });

    const totalPages = Math.ceil(total / currentLimit);
    const pagination = {
      currentPage: currentPage,
      totalPage: totalPages,
      totalItems: total,
      perpage: currentLimit,
    };

    return {
      data: {
        items: data,
        pagination,
      },
    };
  }

  @Get('search')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Search invoices' })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Search query',
  })
  @ApiQuery({ name: 'status', required: false, enum: InvoiceStatus })
  @ApiQuery({ name: 'payment_status', required: false, enum: PaymentStatus })
  @ApiQuery({ name: 'vendor_id', required: false, type: String })
  async search(
    @Query('q') query: string,
    @Query('status') status?: InvoiceStatus,
    @Query('payment_status') payment_status?: PaymentStatus,
    @Query('vendor_id') vendor_id?: string,
  ): Promise<{ data: InvoiceDto[] }> {
    const invoices = await this.service.search(query, {
      status,
      payment_status,
      vendor_id,
    });
    return { data: invoices };
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get an invoice by ID' })
  async findById(@Param('id') id: string): Promise<{ data: InvoiceDto }> {
    const invoice = await this.service.findById(id);
    return { data: invoice };
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update an invoice by ID' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
  ): Promise<{ data: InvoiceDto }> {
    const invoice = await this.service.update(id, dto);
    return { data: invoice };
  }

  @Put(':id/approve')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Approve or reject an invoice by ID' })
  async approve(
    @Param('id') id: string,
    @Body() dto: ApproveInvoiceDto,
    @Request() req,
  ): Promise<{ data: InvoiceDto }> {
    const approvedByUserId = req['fullUser']._id.toString();
    const invoice = await this.service.approve(id, dto, approvedByUserId);
    return { data: invoice };
  }

  @Put(':id/payment')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Record payment for an invoice by ID' })
  async recordPayment(
    @Param('id') id: string,
    @Body() dto: PaymentInvoiceDto,
  ): Promise<{ data: InvoiceDto }> {
    const invoice = await this.service.recordPayment(id, dto);
    return { data: invoice };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Delete an invoice by ID' })
  async delete(@Param('id') id: string): Promise<{ data: string }> {
    await this.service.delete(id);
    return { data: 'Invoice deleted successfully' };
  }
}
