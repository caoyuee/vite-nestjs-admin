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
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuListQueryDto } from './dto/menu-list-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/interfaces/response.interface';
import { Role } from '../../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

@ApiTags('菜单')
@Controller('api/system/user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  @Post('addMenu')
  @ApiOperation({ summary: '新增菜单' })
  async createMenu(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }

  @Put('editMenu')
  @ApiOperation({ summary: '编辑菜单' })
  async updateMenu(@Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.updateMenu(updateMenuDto);
  }

  @Delete('deleteMenu/:id')
  @ApiOperation({ summary: '删除菜单' })
  async deleteMenu(@Param('id') id: string) {
    return this.menuService.deleteMenu(id);
  }

  @Get('menuList')
  @ApiOperation({ summary: '获取用户菜单' })
  async getMenuList(@CurrentUser() user: JwtPayload) {
    const roleIds = user.roles.map((id) => String(id));
    const roleList = await this.roleRepository.findBy({
      id: In(roleIds.map(Number)),
    });

    if (!roleList || roleList.length === 0) {
      return {
        code: 200,
        message: '未获取到菜单',
        data: [],
      };
    }

    const menuIds: (string | number)[] = roleList
      .map((role) => role.useMenus)
      .flat();

    return this.menuService.getMenuList([...new Set(menuIds)]);
  }

  @Get('allMenuList')
  @ApiOperation({ summary: '获取所有菜单' })
  async getAllMenus(@Query() query: MenuListQueryDto) {
    return this.menuService.getAllMenus(query);
  }
}
