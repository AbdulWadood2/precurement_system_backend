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
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(@Inject('IUserService') private readonly service: IUserService) {}

  @Get('profile')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
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
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
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
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
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
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
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
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
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

  // Teacher-specific endpoints (must come before :id route)
  @Get('teachers')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all teachers' })
  async getAllTeachers(): Promise<{ data: UserDto[] }> {
    const teachers = await this.service.findAll(UserRole.TEACHER);
    return {
      data: teachers,
    };
  }

  @Post('teachers')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new teacher' })
  async createTeacher(
    @Body() dto: CreateTeacherDto,
  ): Promise<{ data: UserDto }> {
    const teacherData = { ...dto, role: UserRole.TEACHER };
    const teacher = await this.service.createUser(teacherData);
    return {
      data: teacher,
    };
  }

  @Put('teachers/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update teacher by ID' })
  async updateTeacher(
    @Param('id') id: string,
    @Body() dto: UpdateTeacherDto,
  ): Promise<{ data: UserDto }> {
    const teacher = await this.service.updateUser(id, dto);
    return {
      data: teacher,
    };
  }

  @Delete('teachers/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete teacher by ID' })
  async deleteTeacher(@Param('id') id: string): Promise<{ message: string }> {
    await this.service.deleteUser(id);
    return {
      message: 'Teacher deleted successfully',
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
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
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Create new user' })
  async createUser(@Body() dto: CreateUserDto): Promise<{ data: UserDto }> {
    const user = await this.service.createUser(dto);
    return {
      data: user,
    };
  }
}
