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
import { IPurchaseRequestService } from './interfaces/purchase-request.service.interface';
import {
  CreatePurchaseRequestDto,
  UpdatePurchaseRequestDto,
  ApprovePurchaseRequestDto,
  PurchaseRequestStatus,
  Priority,
} from './dto/create-purchase-request.dto';
import { PurchaseRequestDto } from './dto/purchase-request.dto';
import { WrappedResponseDto } from 'src/utils/pagination/dto/paginated-response.dto';

@ApiTags('purchase-request')
@Controller('purchase-request')
export class PurchaseRequestController {
  constructor(
    @Inject('IPurchaseRequestService')
    private readonly service: IPurchaseRequestService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Create a new purchase request (ADMIN, MANAGER, MEMBER)' })
  async create(
    @Body() dto: CreatePurchaseRequestDto,
  ): Promise<{ data: PurchaseRequestDto }> {
    const pr = await this.service.create(dto);
    return { data: pr };
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get all purchase requests (ADMIN, MANAGER, MEMBER)' })
  @ApiQuery({ name: 'status', required: false, enum: PurchaseRequestStatus })
  @ApiQuery({ name: 'department', required: false, type: String })
  @ApiQuery({ name: 'priority', required: false, enum: Priority })
  @ApiQuery({ name: 'requested_by_user_id', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('status') status?: PurchaseRequestStatus,
    @Query('department') department?: string,
    @Query('priority') priority?: Priority,
    @Query('requested_by_user_id') requested_by_user_id?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<WrappedResponseDto<PurchaseRequestDto>> {
    const {
      data,
      total,
      page: currentPage,
      limit: currentLimit,
    } = await this.service.findAll({
      status,
      department,
      priority,
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
  @ApiOperation({ summary: 'Search purchase requests (ADMIN, MANAGER, MEMBER)' })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Search query',
  })
  @ApiQuery({ name: 'status', required: false, enum: PurchaseRequestStatus })
  @ApiQuery({ name: 'department', required: false, type: String })
  @ApiQuery({ name: 'priority', required: false, enum: Priority })
  async search(
    @Query('q') query: string,
    @Query('status') status?: PurchaseRequestStatus,
    @Query('department') department?: string,
    @Query('priority') priority?: Priority,
  ): Promise<{ data: PurchaseRequestDto[] }> {
    const prs = await this.service.search(query, {
      status,
      department,
      priority,
    });
    return { data: prs };
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get a purchase request by ID (ADMIN, MANAGER, MEMBER)' })
  async findById(
    @Param('id') id: string,
  ): Promise<{ data: PurchaseRequestDto }> {
    const pr = await this.service.findById(id);
    return { data: pr };
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Update a purchase request by ID (ADMIN, MANAGER, MEMBER)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePurchaseRequestDto,
  ): Promise<{ data: PurchaseRequestDto }> {
    const pr = await this.service.update(id, dto);
    return { data: pr };
  }

  @Put(':id/approve')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Approve or reject a purchase request by ID (ADMIN, MANAGER)' })
  async approve(
    @Param('id') id: string,
    @Body() dto: ApprovePurchaseRequestDto,
    @Request() req,
  ): Promise<{ data: PurchaseRequestDto }> {
    const approvedByUserId = req['fullUser']._id.toString();
    const pr = await this.service.approve(id, dto, approvedByUserId);
    return { data: pr };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Delete a purchase request by ID (ADMIN, MANAGER)' })
  async delete(@Param('id') id: string): Promise<{ data: string }> {
    await this.service.delete(id);
    return { data: 'Purchase Request deleted successfully' };
  }
}
