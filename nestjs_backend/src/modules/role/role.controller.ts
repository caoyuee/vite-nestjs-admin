import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleListQueryDto } from './dto/role-list-query.dto';
import { RolePermissionDto } from './dto/role-permission.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/interfaces/response.interface';

@ApiTags('角色')
@Controller('api/system/user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('addRole')
  @ApiOperation({ summary: '新增角色' })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Get('getRoleList')
  @ApiOperation({ summary: '获取角色列表' })
  async getRoleList(@Query() query: RoleListQueryDto) {
    return this.roleService.getRoleList(query);
  }

  @Get('getRoleInfo')
  @ApiOperation({ summary: '获取角色授权信息' })
  async getRoleInfo(@CurrentUser() user: JwtPayload) {
    return this.roleService.getRoleInfo(user.sub);
  }

  @Delete('deleteRole')
  @ApiOperation({ summary: '删除角色' })
  async deleteRole(@Query('id') id: string) {
    return this.roleService.deleteRole(id);
  }

  @Post('putRolePermission')
  @ApiOperation({ summary: '角色授权' })
  async setRolePermission(@Body() rolePermissionDto: RolePermissionDto) {
    return this.roleService.setRolePermission(rolePermissionDto);
  }
}
