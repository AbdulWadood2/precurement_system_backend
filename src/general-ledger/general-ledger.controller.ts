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
import { IGeneralLedgerService } from './interfaces/general-ledger.service.interface';
import { CreateGeneralLedgerDto } from './dto/create-general-ledger.dto';
import { GeneralLedgerDto } from './dto/general-ledger.dto';
import { GeneralLedgerFiltersDto } from './dto/general-ledger-filters.dto';
import { UpdateGeneralLedgerDto } from './dto/update-general-ledger.dto';
import { BalanceSheetDto } from './dto/balance-sheet.dto';
import { IncomeStatementDto } from './dto/income-statement.dto';
import { TrialBalanceDto } from './dto/trial-balance.dto';
import { WrappedResponseDto } from '../utils/pagination/dto/paginated-response.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../user/roles/roles.enum';

@ApiTags('general-ledger')
@Controller('general-ledger')
@UseGuards(AuthGuard, RolesGuard)
export class GeneralLedgerController {
  constructor(
    @Inject('IGeneralLedgerService')
    private readonly service: IGeneralLedgerService,
  ) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create general ledger entry (ADMIN, MANAGER)' })
  async create(
    @Body() createGeneralLedgerDto: CreateGeneralLedgerDto,
    @Request() req,
  ): Promise<{ data: GeneralLedgerDto; message: string }> {
    const generalLedger = await this.service.create(
      createGeneralLedgerDto,
      req['fullUser']._id.toString(),
    );
    return {
      data: generalLedger,
      message: 'General ledger entry created successfully',
    };
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({
    summary: 'Get all general ledger entries (ADMIN, MANAGER, MEMBER)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'account', required: false, type: String })
  @ApiQuery({ name: 'date', required: false, type: String })
  @ApiQuery({ name: 'company', required: false, type: String })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('account') account?: string,
    @Query('date') date?: string,
    @Query('company') company?: string,
  ): Promise<{ data: WrappedResponseDto<GeneralLedgerDto> }> {
    const filters: GeneralLedgerFiltersDto = {};
    if (account) filters.account = account;
    if (date) filters.date = date;
    if (company) filters.company = company;

    const result = await this.service.findAll(page, limit, filters);
    return { data: result };
  }

  @Get('balance-sheet')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get balance sheet (ADMIN, MANAGER, MEMBER)' })
  async getBalanceSheet(): Promise<{ data: BalanceSheetDto }> {
    const result = await this.service.getBalanceSheet();
    return result;
  }

  @Get('income-statement')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get income statement (ADMIN, MANAGER, MEMBER)' })
  async getIncomeStatement(): Promise<{ data: IncomeStatementDto }> {
    const result = await this.service.getIncomeStatement();
    return result;
  }

  @Get('trial-balance')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get trial balance (ADMIN, MANAGER, MEMBER)' })
  async getTrialBalance(): Promise<{ data: TrialBalanceDto }> {
    const result = await this.service.getTrialBalance();
    return result;
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({
    summary: 'Get general ledger entry by ID (ADMIN, MANAGER, MEMBER)',
  })
  async findOne(@Param('id') id: string): Promise<{ data: GeneralLedgerDto }> {
    const generalLedger = await this.service.findOne(id);
    return { data: generalLedger };
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update general ledger entry (ADMIN, MANAGER)' })
  async update(
    @Param('id') id: string,
    @Body() updateGeneralLedgerDto: UpdateGeneralLedgerDto,
    @Request() req,
  ): Promise<{ data: GeneralLedgerDto; message: string }> {
    const generalLedger = await this.service.update(
      id,
      updateGeneralLedgerDto,
      req['fullUser']._id.toString(),
    );
    return {
      data: generalLedger,
      message: 'General ledger entry updated successfully',
    };
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Delete general ledger entry (ADMIN, MANAGER)' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.service.remove(id);
    return { message: 'General ledger entry deleted successfully' };
  }

  @Get('account/:account')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get entries by account (ADMIN, MANAGER, MEMBER)' })
  async findByAccount(
    @Param('account') account: string,
  ): Promise<{ data: GeneralLedgerDto[] }> {
    const entries = await this.service.findByAccount(account);
    return { data: entries };
  }

  @Get('date-range/:startDate/:endDate')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({
    summary: 'Get entries by date range (ADMIN, MANAGER, MEMBER)',
  })
  async findByDateRange(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
  ): Promise<{ data: GeneralLedgerDto[] }> {
    const entries = await this.service.findByDateRange(startDate, endDate);
    return { data: entries };
  }
}
