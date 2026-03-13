// service/MenuService.ts
import { Role } from "../entity/Role.ts";
import { RoleRepository, UserRepository, AuthRepository } from "../config/DB.conf.ts";
import Response from "../config/responseManage.conf.ts";
import { In } from "typeorm";
import { extractAndMergeAuthDataAdvanced } from "../utils/tools.ts";
import type {
  CreateRoleRequest,
  RoleListQuery,
  RoleListResponse,
  RolePermissionRequest
} from "../types/Role.d.ts";
import type { ApiResponse } from "../types/common.d.ts";
import { NotFoundError, BusinessError } from "../utils/AppError.ts";
/**
 * 角色实例
 *
 * @type {*}
 */

export default class RoleService {
  /**
* 新增角色
*
* @public
* @static
* @async
* @param {CreateRoleRequest} data 创建角色请求数据
* @returns {Promise<ApiResponse<null>>} 创建响应
*/
  public static async addRoles(data: CreateRoleRequest): Promise<ApiResponse<null>> {
    const role = new Role();
    role.sort = data.sort;
    role.role = data.role;
    role.name = data.name;
    role.description = data.description;
    role.status = data.status ?? true;
    role.useProTable = data.useProTable || [];
    role.authButton = data.authButton || [];
    // 将菜单ID统一转换为字符串数组
    role.useMenus = (data.useMenus || []).map(id => String(id));

    const result = await RoleRepository.save(role);
    console.log(result, "创建角色===========");
    if (!result) {
      throw new BusinessError("角色创建失败");
    }
    return Response(null, "创建成功,请刷新页面", 201);
  }
  /**
* 获取角色列表
*
* @public
* @static
* @async
* @param {RoleListQuery} data 角色列表查询参数
* @returns {Promise<ApiResponse<RoleListResponse>>} 角色列表响应
*/
  public static async getRoleList(data: RoleListQuery): Promise<ApiResponse<RoleListResponse>> {
    const { pageNum = 1, pageSize = 10, ...filters } = data;

    // 构建查询条件
    const where: any = {};
    if (filters.role) where.role = filters.role;
    if (filters.name) where.name = filters.name;
    if (filters.status !== undefined) where.status = filters.status;

    const [list, total] = await RoleRepository.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: { sort: 'ASC', createTime: 'DESC' },
    });

    // 如果列表为空，返回空数组
    if (!list) {
      return Response({ list: [], total: 0 });
    }
    return Response({ list, total });
  }

  /**
* 获取角色信息，权限
*
* @public
* @static
* @async
* @param {{ id: string }} data 包含用户ID的对象
* @returns {Promise<ApiResponse<{ useMenus: (string | number)[]; authButton: string[]; useProTable: string[] }>>} 角色权限信息响应
*/
  public static async getRoleInfo(data: { id: string }): Promise<ApiResponse<{ useMenus: (string | number)[]; authButton: string[]; useProTable: string[] }>> {
    const user = await UserRepository.findOneBy({ id: data.id });
    if (!user) {
      throw new NotFoundError("用户不存在");
    }
    console.log(user, "用户角色ids");
    const roleIds = user.roles || [];
    if (roleIds.length === 0) {
      // 用户未分配角色是正常情况，返回空权限
      return Response({ useMenus: [], authButton: [], useProTable: [] });
    }

    // 将角色ID转换为字符串
    const stringRoleIds = roleIds.map(id => String(id));
    const roles = await RoleRepository.findBy({
      id: In(stringRoleIds),
    });

    // 如果未找到角色信息，返回空权限（可能是数据不一致）
    if (!roles || roles.length === 0) {
      return Response({ useMenus: [], authButton: [], useProTable: [] });
    }

    const { useMenus, authButtonIds, useProTableIds } = extractAndMergeAuthDataAdvanced(roles);

    const authButtonPermissions = (await AuthRepository.findBy({
      id: In(authButtonIds),
    }))?.map(item => item.permission) || [];

    const useProTablePermissions = (await AuthRepository.findBy({
      id: In(useProTableIds),
    }))?.map(item => item.permission) || [];

    return Response({
      useMenus,
      authButton: authButtonPermissions,
      useProTable: useProTablePermissions
    });
  }

  /**
* 删除角色
*
* @public
* @static
* @async
* @param {string} id 角色ID
* @returns {Promise<ApiResponse<null>>} 删除响应
*/
  public static async deleteRoles(id: string): Promise<ApiResponse<null>> {
    const role = await RoleRepository.findOneBy({ id });
    if (!role) {
      throw new NotFoundError("该角色不存在");
    }
    //软删除
    const result = await RoleRepository.softDelete({ id });
    console.log(result, "删除角色===========");

    if (!result) {
      throw new BusinessError("角色删除失败");
    }
    return Response(null, "角色删除成功,请刷新页面", 200);
  }

  /**
* 角色授权
*
* @public
* @static
* @async
* @param {RolePermissionRequest} data 角色授权请求数据
* @returns {Promise<ApiResponse<null>>} 授权响应
*/
  public static async setRolePermission(data: RolePermissionRequest): Promise<ApiResponse<null>> {
    const { id, useMenus, useProTable, authButton } = data;

    if (!id) {
      throw new BusinessError("角色ID不能为空");
    }

    // 检查角色是否存在
    const role = await RoleRepository.findOneBy({ id });
    console.log(role, '角色信息==========');
    if (!role) {
      throw new NotFoundError("角色不存在");
    }

    // 构建更新数据
    const updateData: Partial<Role> = {};
    if (useMenus !== undefined) updateData.useMenus = useMenus.map(id => String(id));
    if (useProTable !== undefined) updateData.useProTable = useProTable;
    if (authButton !== undefined) updateData.authButton = authButton;

    // 执行更新
    const result = await RoleRepository.update({ id }, updateData);

    if (result.affected === 0) {
      throw new BusinessError("授权失败，未更新任何记录");
    }

    return Response(null, "授权成功", 200);
  }
}
