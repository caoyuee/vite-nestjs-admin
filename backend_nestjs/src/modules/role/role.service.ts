/**
 * 角色服务
 *
 * 【业务说明】
 * 角色相关的业务逻辑：
 * - 角色的增删改查
 * - 角色权限的分配
 * - 用户权限信息的获取
 *
 * 【权限模型说明】
 * 本系统采用 RBAC（基于角色的访问控制）模型：
 * - 用户 -> 角色 -> 权限
 * - 一个用户可以有多个角色
 * - 一个角色可以有多个权限
 * - 用户的权限 = 所有角色的权限并集
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { User } from '../../entities/user.entity';
import { Auth } from '../../entities/auth.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleListQueryDto } from './dto/role-list-query.dto';
import { RolePermissionDto } from './dto/role-permission.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
// 权限数据提取和合并工具函数
import { extractAndMergeAuthDataAdvanced } from '../../utils/menu-tree.util';

/**
 * 角色服务类
 */
@Injectable()
export class RoleService {
  /**
   * 构造函数 - 注入三个数据库仓库
   *
   * @param roleRepository - 角色仓库
   * @param userRepository - 用户仓库
   * @param authRepository - 权限仓库
   */
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  /**
   * 创建角色
   *
   * @param createRoleDto - 创建角色的数据
   * @returns 创建结果
   */
  async createRole(createRoleDto: CreateRoleDto) {
    // 创建新的角色实体
    const role = new Role();

    // 设置角色字段
    role.sort = createRoleDto.sort ?? 0; // 排序序号
    role.role = createRoleDto.role; // 角色标识符（如 admin、editor）
    role.name = createRoleDto.name; // 角色名称（如 管理员、编辑员）
    role.description = createRoleDto.description; // 角色描述
    role.status = createRoleDto.status ?? true; // 状态
    role.useProTable = createRoleDto.useProTable || []; // 表格权限
    role.authButton = createRoleDto.authButton || []; // 按钮权限
    role.useMenus = (createRoleDto.useMenus || []).map((id) => String(id)); // 菜单权限

    // 保存到数据库
    const result = await this.roleRepository.save(role);
    if (!result) {
      throw new BadRequestException('角色创建失败');
    }

    return {
      code: 201,
      message: '创建成功,请刷新页面',
      data: null,
    };
  }

  /**
   * 获取角色列表（分页）
   *
   * @param query - 查询参数
   * @returns 角色列表和总数
   */
  async getRoleList(query: RoleListQueryDto) {
    // 解构查询参数
    const { pageNum = 1, pageSize = 10, ...filters } = query;

    // 构建查询条件
    const where: any = {};
    if (filters.role) where.role = filters.role;
    if (filters.name) where.name = filters.name;
    if (filters.status !== undefined) where.status = filters.status;

    // 查询角色列表和总数
    // findAndCount 返回 [列表, 总数]
    const [list, total] = await this.roleRepository.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize, // 跳过前面的记录
      take: pageSize, // 取 pageSize 条记录
      order: { sort: 'ASC', createTime: 'DESC' }, // 排序：先按 sort 升序，再按创建时间降序
    });

    return {
      code: 200,
      message: 'success',
      data: { list, total, pageNum, pageSize },
    };
  }

  /**
   * 更新角色信息
   *
   * @param id - 角色 ID
   * @param updateRoleDto - 角色更新数据
   * @returns 更新结果
   */
  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    // 查询角色是否存在，避免静默更新不存在的数据
    const role = await this.roleRepository.findOne({
      where: { id: Number(id) },
    });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    // 仅更新前端提交的字段，避免覆盖未修改数据
    const updateData: Partial<Role> = {};
    if (updateRoleDto.sort !== undefined) updateData.sort = updateRoleDto.sort;
    if (updateRoleDto.role !== undefined) updateData.role = updateRoleDto.role;
    if (updateRoleDto.name !== undefined) updateData.name = updateRoleDto.name;
    if (updateRoleDto.description !== undefined)
      updateData.description = updateRoleDto.description;
    if (updateRoleDto.status !== undefined)
      updateData.status = updateRoleDto.status;
    if (updateRoleDto.useMenus !== undefined) {
      updateData.useMenus = updateRoleDto.useMenus.map((menuId) =>
        String(menuId),
      );
    }
    if (updateRoleDto.authButton !== undefined)
      updateData.authButton = updateRoleDto.authButton;
    if (updateRoleDto.useProTable !== undefined)
      updateData.useProTable = updateRoleDto.useProTable;

    const result = await this.roleRepository.update(
      { id: Number(id) },
      updateData,
    );
    if (result.affected === 0) {
      throw new BadRequestException('角色更新失败');
    }

    return {
      code: 200,
      message: '角色更新成功',
      data: null,
    };
  }

  /**
   * 获取用户的角色权限信息
   *
   * @param userId - 用户ID
   * @returns 用户的权限信息
   *
   * 【业务流程】
   * 1. 根据用户ID查询用户信息
   * 2. 获取用户的角色ID列表
   * 3. 查询所有角色的详细信息
   * 4. 合并所有角色的权限
   * 5. 查询权限标识符
   *
   * 【类比前端】
   * 这个接口返回的数据用于前端权限控制：
   * - useMenus: 控制侧边栏菜单显示
   * - authButton: 控制按钮显示/隐藏
   * - useProTable: 控制表格列显示/隐藏
   */
  async getRoleInfo(userId: string) {
    // 查询用户信息
    const user = await this.userRepository.findOne({
      where: { id: Number(userId) },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 获取用户的角色 ID 列表
    const roleIds = user.roles || [];
    if (roleIds.length === 0) {
      // 用户没有角色，返回空权限
      return {
        code: 200,
        message: 'success',
        data: { useMenus: [], authButton: [], useProTable: [] },
      };
    }

    // 查询用户的所有角色
    const stringRoleIds = roleIds.map((id) => String(id));
    const roles = await this.roleRepository.findBy({
      id: In(stringRoleIds.map(Number)),
    });

    if (!roles || roles.length === 0) {
      return {
        code: 200,
        message: 'success',
        data: { useMenus: [], authButton: [], useProTable: [] },
      };
    }

    // 提取并合并所有角色的权限数据
    // extractAndMergeAuthDataAdvanced 是一个工具函数
    // 它会合并多个角色的权限，并去重
    const { useMenus, authButtonIds, useProTableIds } =
      extractAndMergeAuthDataAdvanced(
        roles.map((r) => ({
          id: String(r.id),
          useProTable: r.useProTable,
          authButton: r.authButton,
          useMenus: r.useMenus,
        })),
      );

    // 根据 ID 查询按钮权限的标识符
    // authButton 存储的是权限 ID，需要转换为权限标识符
    const authButtonPermissions =
      (
        await this.authRepository.findBy({
          id: In((authButtonIds || []).map(Number)),
        })
      )?.map((item) => item.permission) || [];

    // 根据 ID 查询表格权限的标识符
    const useProTablePermissions =
      (
        await this.authRepository.findBy({
          id: In((useProTableIds || []).map(Number)),
        })
      )?.map((item) => item.permission) || [];

    // 返回用户的权限信息
    return {
      code: 200,
      message: 'success',
      data: {
        useMenus, // 菜单 ID 列表
        authButton: authButtonPermissions, // 按钮权限标识符列表
        useProTable: useProTablePermissions, // 表格权限标识符列表
      },
    };
  }

  /**
   * 删除角色（软删除）
   *
   * @param id - 角色ID
   * @returns 删除结果
   */
  async deleteRole(id: string) {
    // 查询角色是否存在
    const role = await this.roleRepository.findOne({
      where: { id: Number(id) },
    });
    if (!role) {
      throw new NotFoundException('该角色不存在');
    }

    // 执行软删除
    const result = await this.roleRepository.softDelete({ id: Number(id) });
    if (!result) {
      throw new BadRequestException('角色删除失败');
    }

    return {
      code: 200,
      message: '角色删除成功,请刷新页面',
      data: null,
    };
  }

  /**
   * 为角色授权
   *
   * @param rolePermissionDto - 授权数据
   * @returns 授权结果
   *
   * 【业务场景】
   * 管理员在角色管理页面为角色分配权限：
   * - 勾选可访问的菜单
   * - 勾选可使用的按钮
   * - 勾选可查看的表格列
   */
  async setRolePermission(rolePermissionDto: RolePermissionDto) {
    const { id, useMenus, useProTable, authButton } = rolePermissionDto;

    // 验证角色 ID
    if (!id) {
      throw new BadRequestException('角色ID不能为空');
    }

    // 查询角色是否存在
    const role = await this.roleRepository.findOne({
      where: { id: Number(id) },
    });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    // 构建更新数据
    const updateData: Partial<Role> = {};
    if (useMenus !== undefined)
      updateData.useMenus = useMenus.map((id) => String(id));
    if (useProTable !== undefined) updateData.useProTable = useProTable;
    if (authButton !== undefined) updateData.authButton = authButton;

    // 执行更新
    // update 方法返回 { affected: 影响的行数 }
    const result = await this.roleRepository.update(
      { id: Number(id) },
      updateData,
    );
    if (result.affected === 0) {
      throw new BadRequestException('授权失败，未更新任何记录');
    }

    return {
      code: 200,
      message: '授权成功',
      data: null,
    };
  }

  /**
   * 根据路径参数更新角色权限
   *
   * @param id - 角色 ID
   * @param rolePermissionDto - 权限数据
   * @returns 授权结果
   */
  async setRolePermissionById(
    id: string,
    rolePermissionDto: Omit<RolePermissionDto, 'id'>,
  ) {
    return this.setRolePermission({
      ...rolePermissionDto,
      id,
    });
  }
}
