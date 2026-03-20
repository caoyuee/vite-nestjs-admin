import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Menu } from '../../entities/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuListQueryDto } from './dto/menu-list-query.dto';
import { convertToSortedTree, MenuTreeItem } from '../../utils/menu-tree.util';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async createMenu(createMenuDto: CreateMenuDto) {
    const menu = new Menu();
    menu.index = createMenuDto.index ?? 0;
    menu.parentId = createMenuDto.parentId ?? 0;
    menu.path = createMenuDto.path;
    menu.name = createMenuDto.name;
    menu.nameZH = createMenuDto.meta.title;
    menu.type = createMenuDto.type ?? 0;
    menu.component = createMenuDto.component;
    menu.redirect = createMenuDto.redirect ?? null;
    menu.meta = createMenuDto.meta;
    menu.status = createMenuDto.status ?? true;

    const result = await this.menuRepository.save(menu);
    if (!result) {
      throw new BadRequestException('菜单创建失败');
    }

    return {
      code: 201,
      message: '创建成功,请刷新页面',
      data: null,
    };
  }

  async updateMenu(updateMenuDto: UpdateMenuDto) {
    const menu = await this.menuRepository.findOne({
      where: { id: Number(updateMenuDto.id) },
    });

    if (!menu) {
      throw new NotFoundException('菜单不存在');
    }

    if (updateMenuDto.index !== undefined) menu.index = updateMenuDto.index;
    if (updateMenuDto.parentId !== undefined)
      menu.parentId = updateMenuDto.parentId;
    if (updateMenuDto.path !== undefined) menu.path = updateMenuDto.path;
    if (updateMenuDto.name !== undefined) menu.name = updateMenuDto.name;
    if (updateMenuDto.type !== undefined) menu.type = updateMenuDto.type;
    if (updateMenuDto.component !== undefined)
      menu.component = updateMenuDto.component;
    if (updateMenuDto.redirect !== undefined)
      menu.redirect = updateMenuDto.redirect;
    if (updateMenuDto.status !== undefined) menu.status = updateMenuDto.status;

    if (updateMenuDto.meta !== undefined) {
      menu.meta = { ...menu.meta, ...updateMenuDto.meta };
      if (updateMenuDto.meta.title !== undefined) {
        menu.nameZH = updateMenuDto.meta.title;
      }
    }

    const result = await this.menuRepository.save(menu);
    if (!result) {
      throw new BadRequestException('菜单编辑失败');
    }

    return {
      code: 201,
      message: '编辑成功,请刷新页面',
      data: null,
    };
  }

  async deleteMenu(id: string) {
    const menu = await this.menuRepository.findOne({
      where: { id: Number(id) },
    });
    if (!menu) {
      throw new NotFoundException('该菜单不存在');
    }

    const result = await this.menuRepository.softDelete({ id: Number(id) });
    if (!result) {
      throw new BadRequestException('菜单删除失败');
    }

    return {
      code: 200,
      message: '删除成功,请刷新页面',
      data: null,
    };
  }

  async getMenuList(
    menuIds: (string | number)[],
  ): Promise<{ code: number; message: string; data: MenuTreeItem[] }> {
    const stringIds = menuIds.map((id) => String(id));
    const result = await this.menuRepository.findBy({
      id: In(stringIds.map(Number)),
    });

    if (!result || result.length === 0) {
      return {
        code: 200,
        message: 'success',
        data: [],
      };
    }

    const serializationResult = convertToSortedTree(result);
    return {
      code: 200,
      message: 'success',
      data: serializationResult,
    };
  }

  async getAllMenus(query: MenuListQueryDto) {
    const { pageNum = 1, pageSize } = query;
    const result = await this.menuRepository.find();

    if (!result || result.length === 0) {
      return {
        code: 200,
        message: 'success',
        data: { list: [], total: 0 },
      };
    }

    const serializationResult = convertToSortedTree(result);
    const total = serializationResult.length;

    let list: MenuTreeItem[];
    if (pageSize) {
      const tempArray = [...serializationResult];
      list = tempArray.splice((pageNum - 1) * pageSize, pageSize);
    } else {
      list = serializationResult;
    }

    return {
      code: 200,
      message: 'success',
      data: { list, total },
    };
  }
}
