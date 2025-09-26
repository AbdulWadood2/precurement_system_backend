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
import { IPurchaseOrderService } from './interfaces/purchase-order.service.interface';
import {
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
  PurchaseOrderStatus,
} from './dto/create-purchase-order.dto';
import { PurchaseOrderDto } from './dto/purchase-order.dto';
import {
  PaginatedResponseDto,
  WrappedResponseDto,
} from 'src/utils/pagination/dto/paginated-response.dto';

@ApiTags('purchase-order')
@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(
    @Inject('IPurchaseOrderService')
    private readonly service: IPurchaseOrderService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new purchase order (ADMIN, MANAGER)' })
  async create(
    @Body() dto: CreatePurchaseOrderDto,
  ): Promise<{ data: PurchaseOrderDto }> {
    const po = await this.service.create(dto);
    return { data: po };
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get all purchase orders (ADMIN, MANAGER, MEMBER)' })
  @ApiQuery({ name: 'status', required: false, enum: PurchaseOrderStatus })
  @ApiQuery({ name: 'vendor_id', required: false, type: String })
  @ApiQuery({ name: 'requested_by_user_id', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('status') status?: PurchaseOrderStatus,
    @Query('vendor_id') vendor_id?: string,
    @Query('requested_by_user_id') requested_by_user_id?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<WrappedResponseDto<PurchaseOrderDto>> {
    const {
      data,
      total,
      page: currentPage,
      limit: currentLimit,
    } = await this.service.findAll({
      status,
      vendor_id,
      requested_by_user_id,
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
  @ApiOperation({ summary: 'Search purchase orders (ADMIN, MANAGER, MEMBER)' })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Search query',
  })
  @ApiQuery({ name: 'status', required: false, enum: PurchaseOrderStatus })
  @ApiQuery({ name: 'vendor_id', required: false, type: String })
  async search(
    @Query('q') query: string,
    @Query('status') status?: PurchaseOrderStatus,
    @Query('vendor_id') vendor_id?: string,
  ): Promise<{ data: PurchaseOrderDto[] }> {
    const pos = await this.service.search(query, { status, vendor_id });
    return { data: pos };
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get a purchase order by ID (ADMIN, MANAGER, MEMBER)' })
  async findById(@Param('id') id: string): Promise<{ data: PurchaseOrderDto }> {
    const po = await this.service.findById(id);
    return { data: po };
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update a purchase order by ID (ADMIN, MANAGER)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePurchaseOrderDto,
  ): Promise<{ data: PurchaseOrderDto }> {
    const po = await this.service.update(id, dto);
    return { data: po };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Delete a purchase order by ID (ADMIN, MANAGER)' })
  async delete(@Param('id') id: string): Promise<{ data: string }> {
    await this.service.delete(id);
    return { data: 'Purchase Order deleted successfully' };
  }
}
