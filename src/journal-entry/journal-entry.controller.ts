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
import { IJournalEntryService } from './interfaces/journal-entry.service.interface';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { JournalEntryDto } from './dto/journal-entry.dto';
import { JournalEntryFiltersDto } from './dto/journal-entry-filters.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { WrappedResponseDto } from '../utils/pagination/dto/paginated-response.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../user/roles/roles.enum';

@ApiTags('journal-entry')
@Controller('journal-entry')
@UseGuards(AuthGuard, RolesGuard)
export class JournalEntryController {
  constructor(
    @Inject('IJournalEntryService')
    private readonly service: IJournalEntryService,
  ) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create journal entry (ADMIN, MANAGER)' })
  async create(
    @Body() createJournalEntryDto: CreateJournalEntryDto,
    @Request() req,
  ): Promise<{ data: JournalEntryDto }> {
    const journalEntry = await this.service.create(
      createJournalEntryDto,
      req['fullUser']._id.toString(),
    );
    return {
      data: journalEntry,
    };
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get all journal entries (ADMIN, MANAGER, MEMBER)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'entryType', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'company', required: false, type: String })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('entryType') entryType?: string,
    @Query('status') status?: string,
    @Query('company') company?: string,
  ): Promise<WrappedResponseDto<JournalEntryDto>> {
    const filters: JournalEntryFiltersDto = {};
    if (entryType) filters.entryType = entryType;
    if (status) filters.status = status;
    if (company) filters.company = company;

    const result = await this.service.findAll(page, limit, filters);
    return result;
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get journal entry by ID (ADMIN, MANAGER, MEMBER)' })
  async findOne(@Param('id') id: string): Promise<{ data: JournalEntryDto }> {
    const journalEntry = await this.service.findOne(id);
    return { data: journalEntry };
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update journal entry (ADMIN, MANAGER)' })
  async update(
    @Param('id') id: string,
    @Body() updateJournalEntryDto: UpdateJournalEntryDto,
    @Request() req,
  ): Promise<{ data: JournalEntryDto }> {
    const journalEntry = await this.service.update(
      id,
      updateJournalEntryDto,
      req['fullUser']._id.toString(),
    );
    return {
      data: journalEntry
    };
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Delete journal entry (ADMIN, MANAGER)' })
  async remove(@Param('id') id: string): Promise<{ data: string }> {
    await this.service.remove(id);
    return { data: 'Journal entry deleted successfully' };
  }

  @Post(':id/post')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Post journal entry (ADMIN, MANAGER)' })
  async postEntry(
    @Param('id') id: string,
    @Request() req,
  ): Promise<{ data: JournalEntryDto }> {
    const journalEntry = await this.service.postEntry(id);
    return {
      data: journalEntry,
    };
  }

  @Get('entry-type/:entryType')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get entries by type (ADMIN, MANAGER, MEMBER)' })
  async findByEntryType(
    @Param('entryType') entryType: string,
  ): Promise<{ data: JournalEntryDto[] }> {
    const entries = await this.service.findByEntryType(entryType);
    return { data: entries };
  }

  @Get('status/:status')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get entries by status (ADMIN, MANAGER, MEMBER)' })
  async findByStatus(
    @Param('status') status: string,
  ): Promise<{ data: JournalEntryDto[] }> {
    const entries = await this.service.findByStatus(status);
    return { data: entries };
  }

  @Get('company/:company')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get entries by company (ADMIN, MANAGER, MEMBER)' })
  async findByCompany(
    @Param('company') company: string,
  ): Promise<{ data: JournalEntryDto[] }> {
    const entries = await this.service.findByCompany(company);
    return { data: entries };
  }
}
