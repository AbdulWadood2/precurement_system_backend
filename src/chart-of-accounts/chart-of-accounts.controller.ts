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
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { IChartOfAccountsService } from './interfaces/chart-of-accounts.service.interface';
import { CreateChartOfAccountsDto } from './dto/create-chart-of-accounts.dto';
import { ChartOfAccountsDto } from './dto/chart-of-accounts.dto';
import { ChartOfAccountsFiltersDto } from './dto/chart-of-accounts-filters.dto';
import { UpdateChartOfAccountsDto } from './dto/update-chart-of-accounts.dto';
import { AccountHierarchyDto } from './dto/account-hierarchy.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../user/roles/roles.enum';
import { WrappedResponseDto } from 'src/utils/pagination/dto/paginated-response.dto';

@ApiTags('chart-of-accounts')
@Controller('chart-of-accounts')
@UseGuards(AuthGuard, RolesGuard)
export class ChartOfAccountsController {
  constructor(
    @Inject('IChartOfAccountsService')
    private readonly service: IChartOfAccountsService,
  ) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({
    summary: 'Create chart of accounts (ADMIN, MANAGER)',
    description:
      'Create a new chart of accounts entry. Only ADMIN and MANAGER roles can create accounts.',
  })
  @ApiBody({ type: CreateChartOfAccountsDto })
  @ApiResponse({
    status: 201,
    description: 'Chart of accounts created successfully',
    type: ChartOfAccountsDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  async create(
    @Body() createChartOfAccountsDto: CreateChartOfAccountsDto,
    @Request() req,
  ): Promise<{ data: ChartOfAccountsDto }> {
    const chartOfAccounts = await this.service.create(
      createChartOfAccountsDto,
      req['fullUser']._id.toString(),
    );
    return {
      data: chartOfAccounts
    };
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({
    summary: 'Get all chart of accounts (ADMIN, MANAGER, MEMBER)',
    description:
      'Retrieve all chart of accounts with pagination and filtering. Available to ADMIN, MANAGER, and MEMBER roles.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'accountType',
    required: false,
    type: String,
    description: 'Filter by account type',
  })
  @ApiQuery({
    name: 'rootType',
    required: false,
    type: String,
    description: 'Filter by root type',
  })
  @ApiQuery({
    name: 'company',
    required: false,
    type: String,
    description: 'Filter by company',
  })
  @ApiResponse({
    status: 200,
    description: 'Chart of accounts retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('accountType') accountType?: string,
    @Query('rootType') rootType?: string,
    @Query('company') company?: string,
  ): Promise<WrappedResponseDto<ChartOfAccountsDto>> {
    const filters: ChartOfAccountsFiltersDto = {};
    if (accountType) filters.accountType = accountType;
    if (rootType) filters.rootType = rootType;
    if (company) filters.company = company;

    const result = await this.service.findAll(page, limit, filters);
    return result;
  }

  @Get('hierarchy')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({
    summary: 'Get chart of accounts hierarchy (ADMIN, MANAGER, MEMBER)',
    description:
      'Retrieve the hierarchical structure of chart of accounts. Available to ADMIN, MANAGER, and MEMBER roles.',
  })
  @ApiResponse({
    status: 200,
    description: 'Chart of accounts hierarchy retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  async getHierarchy(): Promise<{ data: AccountHierarchyDto[] }> {
    const result = await this.service.getHierarchy();
    return result;
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({
    summary: 'Get chart of accounts by ID (ADMIN, MANAGER, MEMBER)',
    description:
      'Retrieve a specific chart of accounts entry by its ID. Available to ADMIN, MANAGER, and MEMBER roles.',
  })
  @ApiParam({ name: 'id', description: 'Chart of accounts ID' })
  @ApiResponse({
    status: 200,
    description: 'Chart of accounts retrieved successfully',
    type: ChartOfAccountsDto,
  })
  @ApiResponse({ status: 404, description: 'Chart of accounts not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  async findOne(
    @Param('id') id: string,
  ): Promise<{ data: ChartOfAccountsDto }> {
    const chartOfAccounts = await this.service.findOne(id);
    return { data: chartOfAccounts };
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({
    summary: 'Update chart of accounts (ADMIN, MANAGER)',
    description:
      'Update an existing chart of accounts entry. Only ADMIN and MANAGER roles can update accounts.',
  })
  @ApiParam({ name: 'id', description: 'Chart of accounts ID' })
  @ApiBody({ type: UpdateChartOfAccountsDto })
  @ApiResponse({
    status: 200,
    description: 'Chart of accounts updated successfully',
    type: ChartOfAccountsDto,
  })
  @ApiResponse({ status: 404, description: 'Chart of accounts not found' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  async update(
    @Param('id') id: string,
    @Body() updateChartOfAccountsDto: UpdateChartOfAccountsDto,
    @Request() req,
  ): Promise<{ data: ChartOfAccountsDto }> {
    const chartOfAccounts = await this.service.update(
      id,
      updateChartOfAccountsDto,
      req['fullUser']._id.toString(),
    );
    return {
      data: chartOfAccounts,
    };
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({
    summary: 'Delete chart of accounts (ADMIN, MANAGER)',
    description:
      'Delete a chart of accounts entry. Only ADMIN and MANAGER roles can delete accounts.',
  })
  @ApiParam({ name: 'id', description: 'Chart of accounts ID' })
  @ApiResponse({
    status: 200,
    description: 'Chart of accounts deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Chart of accounts not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.service.remove(id);
    return { message: 'Chart of accounts deleted successfully' };
  }

  @Get('account-type/:accountType')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({
    summary: 'Get accounts by type (ADMIN, MANAGER, MEMBER)',
    description:
      'Retrieve chart of accounts filtered by account type. Available to ADMIN, MANAGER, and MEMBER roles.',
  })
  @ApiParam({ name: 'accountType', description: 'Account type to filter by' })
  @ApiResponse({ status: 200, description: 'Accounts retrieved successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  async findByAccountType(
    @Param('accountType') accountType: string,
  ): Promise<{ data: ChartOfAccountsDto[] }> {
    const accounts = await this.service.findByAccountType(accountType);
    return { data: accounts };
  }

  @Get('root-type/:rootType')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({
    summary: 'Get accounts by root type (ADMIN, MANAGER, MEMBER)',
    description:
      'Retrieve chart of accounts filtered by root type. Available to ADMIN, MANAGER, and MEMBER roles.',
  })
  @ApiParam({ name: 'rootType', description: 'Root type to filter by' })
  @ApiResponse({ status: 200, description: 'Accounts retrieved successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  async findByRootType(
    @Param('rootType') rootType: string,
  ): Promise<{ data: ChartOfAccountsDto[] }> {
    const accounts = await this.service.findByRootType(rootType);
    return { data: accounts };
  }

  @Get('company/:company')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({
    summary: 'Get accounts by company (ADMIN, MANAGER, MEMBER)',
    description:
      'Retrieve chart of accounts filtered by company. Available to ADMIN, MANAGER, and MEMBER roles.',
  })
  @ApiParam({ name: 'company', description: 'Company to filter by' })
  @ApiResponse({ status: 200, description: 'Accounts retrieved successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  async findByCompany(
    @Param('company') company: string,
  ): Promise<{ data: ChartOfAccountsDto[] }> {
    const accounts = await this.service.findByCompany(company);
    return { data: accounts };
  }
}
