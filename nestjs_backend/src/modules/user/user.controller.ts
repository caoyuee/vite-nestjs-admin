import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserListQueryDto } from './dto/user-list-query.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import type { JwtPayload } from '../../common/interfaces/response.interface';

@ApiTags('用户')
@Controller('api/system/user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('userInfo')
  @ApiOperation({ summary: '获取当前用户信息' })
  async getUserInfo(@CurrentUser() user: JwtPayload) {
    return this.userService.getUserInfo(user.sub);
  }

  @Public()
  @Post('addUser')
  @ApiOperation({ summary: '创建新用户' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put('editUser')
  @ApiOperation({ summary: '编辑用户信息' })
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto);
  }

  @Delete('deleteUser/:id')
  @ApiOperation({ summary: '删除用户' })
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Get('userList')
  @ApiOperation({ summary: '获取用户列表' })
  async getUserList(@Query() query: UserListQueryDto) {
    return this.userService.getUserList(query);
  }

  @Put('ResetPwd')
  @ApiOperation({ summary: '重置密码' })
  async resetPassword(
    @CurrentUser() user: JwtPayload,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.userService.resetPassword(user.sub, resetPasswordDto);
  }
}
