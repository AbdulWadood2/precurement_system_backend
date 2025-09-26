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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserDto } from './dto/user.dto';
import { IUserService } from './interfaces/user.service.interface';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from './roles/roles.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import {
  UploadProfileImageDto,
  ProfileImageResponseDto,
} from './dto/upload-profile-image.dto';
import { UpdateUserFormDto } from './dto/update-user-form.dto';
import { UpdateProfileFormDto } from './dto/update-profile-form.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(@Inject('IUserService') private readonly service: IUserService) {}

  @Get('profile')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get user profile (All authenticated users)' })
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
  @UseInterceptors(FileInterceptor('profile_image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update user profile with form data including image (All authenticated users)' })
  async updateProfile(
    @Request() req,
    @Body() dto: UpdateProfileFormDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<{ data: UserDto }> {
    const updateData = { ...dto };
    if (file) {
      updateData.profile_image = file;
    }
    const user = await this.service.updateProfileWithForm(
      req['fullUser']._id.toString(),
      updateData,
    );
    return {
      data: user,
    };
  }

  @Put('change-password')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Change user password (All authenticated users)' })
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

  @Post('profile/upload-image')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @UseInterceptors(FileInterceptor('profile_image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload profile image (All authenticated users)' })
  async uploadProfileImage(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ data: ProfileImageResponseDto }> {
    const result = await this.service.uploadProfileImage(
      req['fullUser']._id.toString(),
      file,
    );
    return { data: result };
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all users (OWNER, ADMIN, MANAGER)' })
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
  @ApiOperation({
    summary: 'Search users by name or email (OWNER, ADMIN, MANAGER)',
  })
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
  @ApiOperation({ summary: 'Get all managers (OWNER, ADMIN)' })
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
  @ApiOperation({ summary: 'Create new manager (OWNER, ADMIN)' })
  async createManager(@Body() dto: CreateUserDto): Promise<{ data: UserDto }> {
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
  @UseInterceptors(FileInterceptor('profile_image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update manager with form data including image (OWNER, ADMIN)',
  })
  async updateManager(
    @Param('id') id: string,
    @Body() dto: UpdateUserFormDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<{ data: UserDto }> {
    const updateData = { ...dto };
    if (file) {
      updateData.profile_image = file;
    }
    const manager = await this.service.updateUserWithForm(id, updateData);
    return {
      data: manager,
    };
  }

  @Delete('managers/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete manager by ID (OWNER, ADMIN)' })
  async deleteManager(@Param('id') id: string): Promise<{ data: string }> {
    await this.service.deleteUser(id);
    return {
      data: 'Manager deleted successfully',
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get user by ID (OWNER, ADMIN, MANAGER)' })
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
  @ApiOperation({ summary: 'Create new user (OWNER, ADMIN, MANAGER)' })
  async createUser(@Body() dto: CreateUserDto): Promise<{ data: UserDto }> {
    const user = await this.service.createUser(dto);
    return {
      data: user,
    };
  }
}
