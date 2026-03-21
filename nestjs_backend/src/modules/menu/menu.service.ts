/**
 * 菜单服务
 *
 * 【服务的作用】
 * 服务负责处理具体的业务逻辑，如数据库操作、数据处理等
 * 控制器只负责接收请求和返回响应，业务逻辑都放在服务中
 *
 * 【类比前端】
 * - Service ≈ Vue 的 composables（组合式函数）
 * - 提供可以被多个组件复用的业务逻辑
 * - 通过依赖注入在其他地方使用
 */

import {
  Injectable, // 标记这是一个可注入的服务
  NotFoundException, // 404 异常
  BadRequestException, // 400 异常
} from '@nestjs/common';
// InjectRepository 用于注入数据库 Repository
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Menu } from '../../entities/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuListQueryDto } from './dto/menu-list-query.dto';
// 菜单树转换工具函数
import { convertToSortedTree, MenuTreeItem } from '../../utils/menu-tree.util';

/**
 * 菜单服务类
 *
 * @Injectable() 装饰器标记这是一个可注入的服务
 * 可以在其他类中通过构造函数注入使用
 */
@Injectable()
export class MenuService {
  /**
   * 构造函数 - 注入菜单数据库仓库
   *
   * @param menuRepository - 菜单实体的 Repository
   *
   * 【Repository 说明】
   * Repository 是 TypeORM 提供的数据库操作类
   * 类似于前端的 ORM 库（如 Prisma、Sequelize）
   * 提供了 CRUD 方法：
   * - find(): 查询多条记录
   * - findOne(): 查询单条记录
   * - save(): 保存记录（新增或更新）
   * - delete(): 删除记录
   * - softDelete(): 软删除（设置 deleteTime）
   */
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  /**
   * 创建菜单
   *
   * @param createMenuDto - 创建菜单的数据
   * @returns 创建结果
   *
   * 【业务流程】
   * 1. 创建一个新的 Menu 实体
   * 2. 设置各个字段值
   * 3. 保存到数据库
   * 4. 返回结果
   */
  async createMenu(createMenuDto: CreateMenuDto) {
    // 创建新的菜单实体
    const menu = new Menu();

    // 设置菜单字段
    menu.index = createMenuDto.index ?? 0; // 排序序号，默认 0
    menu.parentId = createMenuDto.parentId ?? 0; // 父级菜单 ID，0 表示顶级菜单
    menu.path = createMenuDto.path; // 路由路径
    menu.name = createMenuDto.name; // 路由名称
    menu.nameZH = createMenuDto.meta.title; // 中文名称，从 meta 中获取
    menu.type = createMenuDto.type ?? 0; // 菜单类型
    menu.component = createMenuDto.component; // 组件路径
    menu.redirect = createMenuDto.redirect ?? null; // 重定向地址
    menu.meta = createMenuDto.meta; // 元数据（图标、标题等）
    menu.status = createMenuDto.status ?? true; // 状态，默认启用

    // 保存到数据库
    const result = await this.menuRepository.save(menu);

    // 检查是否保存成功
    if (!result) {
      throw new BadRequestException('菜单创建失败');
    }

    // 返回成功响应
    return {
      code: 201,
      message: '创建成功,请刷新页面',
      data: null,
    };
  }

  /**
   * 更新菜单
   *
   * @param updateMenuDto - 更新菜单的数据
   * @returns 更新结果
   *
   * 【业务流程】
   * 1. 根据ID查询菜单是否存在
   * 2. 更新传入的字段
   * 3. 保存到数据库
   */
  async updateMenu(updateMenuDto: UpdateMenuDto) {
    // 查询菜单是否存在
    const menu = await this.menuRepository.findOne({
      where: { id: Number(updateMenuDto.id) },
    });

    // 菜单不存在则抛出 404 异常
    if (!menu) {
      throw new NotFoundException('菜单不存在');
    }

    // 只更新传入的字段（部分更新）
    // 使用 !== undefined 判断，允许设置为空值
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

    // 特殊处理 meta 字段：合并原有 meta 和新的 meta
    if (updateMenuDto.meta !== undefined) {
      menu.meta = { ...menu.meta, ...updateMenuDto.meta };
      // 如果更新了标题，同步更新 nameZH
      if (updateMenuDto.meta.title !== undefined) {
        menu.nameZH = updateMenuDto.meta.title;
      }
    }

    // 保存更新
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

  /**
   * 删除菜单（软删除）
   *
   * @param id - 菜单ID
   * @returns 删除结果
   *
   * 【软删除说明】
   * 软删除不会真正从数据库删除记录
   * 而是设置 deleteTime 字段为当前时间
   * 查询时会自动过滤掉已软删除的记录
   */
  async deleteMenu(id: string) {
    // 查询菜单是否存在
    const menu = await this.menuRepository.findOne({
      where: { id: Number(id) },
    });
    if (!menu) {
      throw new NotFoundException('该菜单不存在');
    }

    // 执行软删除
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

  /**
   * 根据菜单ID列表获取菜单树
   *
   * @param menuIds - 菜单ID列表
   * @returns 菜单树形结构
   *
   * 【业务场景】
   * 用户登录后，根据其角色获取可访问的菜单
   * 返回树形结构，前端直接用于渲染侧边栏
   */
  async getMenuList(
    menuIds: (string | number)[],
  ): Promise<{ code: number; message: string; data: MenuTreeItem[] }> {
    // 将 ID 转换为字符串
    const stringIds = menuIds.map((id) => String(id));

    // 根据菜单 ID 列表查询菜单
    // In 操作符类似于 SQL 的 IN 语句
    const result = await this.menuRepository.findBy({
      id: In(stringIds.map(Number)),
    });

    // 如果没有菜单，返回空数组
    if (!result || result.length === 0) {
      return {
        code: 200,
        message: 'success',
        data: [],
      };
    }

    // 将扁平的菜单列表转换为树形结构
    const serializationResult = convertToSortedTree(result);
    return {
      code: 200,
      message: 'success',
      data: serializationResult,
    };
  }

  /**
   * 获取所有菜单（用于管理后台）
   *
   * @param query - 查询参数（分页、筛选）
   * @returns 菜单树形结构（分页）
   *
   * 【业务场景】
   * 管理后台的菜单管理页面，展示所有菜单
   * 支持分页和筛选
   */
  async getAllMenus(query: MenuListQueryDto) {
    const { pageNum = 1, pageSize } = query;

    // 查询所有菜单
    const result = await this.menuRepository.find();

    // 如果没有菜单，返回空数据
    if (!result || result.length === 0) {
      return {
        code: 200,
        message: 'success',
        data: { list: [], total: 0 },
      };
    }

    // 转换为树形结构
    const serializationResult = convertToSortedTree(result);

    // 树形结构的顶级节点数量作为总数
    const total = serializationResult.length;

    // 分页处理
    let list: MenuTreeItem[];
    if (pageSize) {
      // 如果有 pageSize，进行分页
      // 注意：这里是对树形结构的顶级节点分页
      const tempArray = [...serializationResult];
      list = tempArray.splice((pageNum - 1) * pageSize, pageSize);
    } else {
      // 没有 pageSize，返回全部
      list = serializationResult;
    }

    return {
      code: 200,
      message: 'success',
      data: { list, total },
    };
  }
}
