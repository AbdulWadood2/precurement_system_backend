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
import { IReceivingService } from './interfaces/receiving.service.interface';
import {
  CreateReceivingDto,
  UpdateReceivingDto,
  ReceivingStatus,
} from './dto/create-receiving.dto';
import { ReceivingDto } from './dto/receiving.dto';
import { WrappedResponseDto } from 'src/utils/pagination/dto/paginated-response.dto';

@ApiTags('receiving')
@Controller('receiving')
export class ReceivingController {
  constructor(
    @Inject('IReceivingService')
    private readonly service: IReceivingService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new receiving record (ADMIN, MANAGER)' })
  async create(
    @Body() dto: CreateReceivingDto,
  ): Promise<{ data: ReceivingDto }> {
    const receiving = await this.service.create(dto);
    return { data: receiving };
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get all receiving records (ADMIN, MANAGER, MEMBER)' })
  @ApiQuery({ name: 'status', required: false, enum: ReceivingStatus })
  @ApiQuery({ name: 'vendor_id', required: false, type: String })
  @ApiQuery({ name: 'warehouse_id', required: false, type: String })
  @ApiQuery({ name: 'received_by_user_id', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('status') status?: ReceivingStatus,
    @Query('vendor_id') vendor_id?: string,
    @Query('warehouse_id') warehouse_id?: string,
    @Query('received_by_user_id') received_by_user_id?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<WrappedResponseDto<ReceivingDto>> {
    const {
      data,
      total,
      page: currentPage,
      limit: currentLimit,
    } = await this.service.findAll({
      status,
      vendor_id,
      warehouse_id,
      received_by_user_id,
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
  @ApiOperation({ summary: 'Search receiving records (ADMIN, MANAGER, MEMBER)' })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Search query',
  })
  @ApiQuery({ name: 'status', required: false, enum: ReceivingStatus })
  @ApiQuery({ name: 'vendor_id', required: false, type: String })
  @ApiQuery({ name: 'warehouse_id', required: false, type: String })
  async search(
    @Query('q') query: string,
    @Query('status') status?: ReceivingStatus,
    @Query('vendor_id') vendor_id?: string,
    @Query('warehouse_id') warehouse_id?: string,
  ): Promise<{ data: ReceivingDto[] }> {
    const receivingRecords = await this.service.search(query, {
      status,
      vendor_id,
      warehouse_id,
    });
    return { data: receivingRecords };
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get a receiving record by ID (ADMIN, MANAGER, MEMBER)' })
  async findById(@Param('id') id: string): Promise<{ data: ReceivingDto }> {
    const receiving = await this.service.findById(id);
    return { data: receiving };
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update a receiving record by ID (ADMIN, MANAGER)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateReceivingDto,
  ): Promise<{ data: ReceivingDto }> {
    const receiving = await this.service.update(id, dto);
    return { data: receiving };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Delete a receiving record by ID (ADMIN, MANAGER)' })
  async delete(@Param('id') id: string): Promise<{ data: string }> {
    await this.service.delete(id);
    return { data: 'Receiving record deleted successfully' };
  }
}
