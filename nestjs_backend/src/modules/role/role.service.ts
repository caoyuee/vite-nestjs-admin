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
import { extractAndMergeAuthDataAdvanced } from '../../utils/menu-tree.util';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto) {
    const role = new Role();
    role.sort = createRoleDto.sort ?? 0;
    role.role = createRoleDto.role;
    role.name = createRoleDto.name;
    role.description = createRoleDto.description;
    role.status = createRoleDto.status ?? true;
    role.useProTable = createRoleDto.useProTable || [];
    role.authButton = createRoleDto.authButton || [];
    role.useMenus = (createRoleDto.useMenus || []).map((id) => String(id));

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

  async getRoleList(query: RoleListQueryDto) {
    const { pageNum = 1, pageSize = 10, ...filters } = query;

    const where: any = {};
    if (filters.role) where.role = filters.role;
    if (filters.name) where.name = filters.name;
    if (filters.status !== undefined) where.status = filters.status;

    const [list, total] = await this.roleRepository.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: { sort: 'ASC', createTime: 'DESC' },
    });

    return {
      code: 200,
      message: 'success',
      data: { list, total },
    };
  }

  async getRoleInfo(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: Number(userId) },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const roleIds = user.roles || [];
    if (roleIds.length === 0) {
      return {
        code: 200,
        message: 'success',
        data: { useMenus: [], authButton: [], useProTable: [] },
      };
    }

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

    const { useMenus, authButtonIds, useProTableIds } =
      extractAndMergeAuthDataAdvanced(
        roles.map((r) => ({
          id: String(r.id),
          useProTable: r.useProTable,
          authButton: r.authButton,
          useMenus: r.useMenus,
        })),
      );

    const authButtonPermissions =
      (
        await this.authRepository.findBy({
          id: In((authButtonIds || []).map(Number)),
        })
      )?.map((item) => item.permission) || [];

    const useProTablePermissions =
      (
        await this.authRepository.findBy({
          id: In((useProTableIds || []).map(Number)),
        })
      )?.map((item) => item.permission) || [];

    return {
      code: 200,
      message: 'success',
      data: {
        useMenus,
        authButton: authButtonPermissions,
        useProTable: useProTablePermissions,
      },
    };
  }

  async deleteRole(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id: Number(id) },
    });
    if (!role) {
      throw new NotFoundException('该角色不存在');
    }

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

  async setRolePermission(rolePermissionDto: RolePermissionDto) {
    const { id, useMenus, useProTable, authButton } = rolePermissionDto;

    if (!id) {
      throw new BadRequestException('角色ID不能为空');
    }

    const role = await this.roleRepository.findOne({
      where: { id: Number(id) },
    });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    const updateData: Partial<Role> = {};
    if (useMenus !== undefined)
      updateData.useMenus = useMenus.map((id) => String(id));
    if (useProTable !== undefined) updateData.useProTable = useProTable;
    if (authButton !== undefined) updateData.authButton = authButton;

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
}
