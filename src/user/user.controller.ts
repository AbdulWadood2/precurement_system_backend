import {
  Body,
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
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
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserDto } from './dto/user.dto';
import { IUserService } from './interfaces/user.service.interface';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from './roles/roles.enum';
import { CreateUserDto } from './dto/create-user.dto';
import {} from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(@Inject('IUserService') private readonly service: IUserService) {}

  @Get('profile')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@Request() req): Promise<{ data: UserDto }> {
    const user = await this.service.findById(req['fullUser']._id.toString());
    return {
      data: user,
    };
  }

  @Put('profile')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(
    @Request() req,
    @Body() dto: UpdateProfileDto,
  ): Promise<{ data: UserDto }> {
    const user = await this.service.updateProfile(
      req['fullUser']._id.toString(),
      dto,
    );
    return {
      data: user,
    };
  }

  @Put('change-password')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Change user password' })
  async changePassword(
    @Request() req,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ data: UserDto }> {
    const user = await this.service.changePassword(
      req['fullUser']._id.toString(),
      dto,
    );
    return {
      data: user,
    };
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  async getAllUsers(
    @Query('role') role?: UserRole,
  ): Promise<{ data: UserDto[] }> {
    const users = await this.service.findAll(role);
    return {
      data: users,
    };
  }

  @Get('search')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Search users by name or email' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit results' })
  async searchUsers(
    @Query('q') query?: string,
    @Query('role') role?: UserRole,
    @Query('limit') limit?: number,
  ): Promise<{ data: UserDto[] }> {
    const users = await this.service.searchUsers(query, role, limit);
    return {
      data: users,
    };
  }

  // Manager-specific endpoints (must come before :id route)
  @Get('managers')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all managers' })
  async getAllManagers(): Promise<{ data: UserDto[] }> {
    const managers = await this.service.findAll(UserRole.MANAGER);
    return {
      data: managers,
    };
  }

  @Post('managers')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new manager' })
  async createManager(
    @Body() dto: CreateUserDto,
  ): Promise<{ data: UserDto }> {
    const managerData = { ...dto, role: UserRole.MANAGER };
    const manager = await this.service.createUser(managerData);
    return {
      data: manager,
    };
  }

  @Put('managers/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update manager by ID' })
  async updateManager(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<{ data: UserDto }> {
    const manager = await this.service.updateUser(id, dto);
    return {
      data: manager,
    };
  }

  @Delete('managers/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete manager by ID' })
  async deleteManager(@Param('id') id: string): Promise<{ message: string }> {
    await this.service.deleteUser(id);
    return {
      message: 'Manager deleted successfully',
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get user by ID' })
  async getUserById(@Param('id') id: string): Promise<{ data: UserDto }> {
    const user = await this.service.findById(id);
    return {
      data: user,
    };
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create new user' })
  async createUser(@Body() dto: CreateUserDto): Promise<{ data: UserDto }> {
    const user = await this.service.createUser(dto);
    return {
      data: user,
    };
  }
}
