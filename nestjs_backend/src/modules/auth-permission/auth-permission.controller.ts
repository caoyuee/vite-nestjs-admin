import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthPermissionService } from './auth-permission.service';
import { AuthQueryDto } from './dto/auth-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('权限')
@Controller('api/system/user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AuthPermissionController {
  constructor(private readonly authPermissionService: AuthPermissionService) {}

  @Get('getAuthBtns')
  @ApiOperation({ summary: '获取权限按钮列表' })
  async getAuthBtns(@Query() query: AuthQueryDto) {
    return this.authPermissionService.getAuthBtns(query);
  }
}
