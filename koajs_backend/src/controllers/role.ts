import type { RouterContext } from "@koa/router";
import RoleService from "../service/RoleService.ts";
import type { CreateRoleRequest, RoleListQuery, RolePermissionRequest } from "../types/Role.d.ts";
import type { JwtPayload } from "../types/User.d.ts";
export default class RoleController {
  /**
* 新增角色配置
*
* @public
* @static
* @async
* @param {RouterContext} ctx
* @returns {Promise<void>}
*/
  public static async addRole(ctx: RouterContext): Promise<void> {
    const data = ctx.request.body as unknown as CreateRoleRequest;
    const result = await RoleService.addRoles(data);
    ctx.body = result;
  }

  /**
* 获取角色列表
*
* @public
* @static
* @async
* @param {RouterContext} ctx
* @returns {Promise<void>}
*/
  public static async getRoleList(ctx: RouterContext): Promise<void> {
    const data = ctx.request.query as unknown as RoleListQuery;
    const result = await RoleService.getRoleList(data);
    ctx.body = result;
  }
  /**
* 获取授权
*
* @public
* @static
* @async
* @param {RouterContext} ctx
* @returns {Promise<void>}
*/
  public static async getRoleInfo(ctx: RouterContext): Promise<void> {
    const user = ctx.state.user as JwtPayload;
    const result = await RoleService.getRoleInfo({ id: user.sub });
    ctx.body = result;
  }

  /**
* 删除角色
*
* @public
* @static
* @async
* @param {RouterContext} ctx
* @returns {Promise<void>}
*/
  public static async deleteRole(ctx: RouterContext): Promise<void> {
    const id = ctx.params.id as string;
    const result = await RoleService.deleteRoles(id);
    ctx.body = result;
  }

  /**
* 角色授权
*
* @public
* @static
* @async
* @param {RouterContext} ctx
* @returns {Promise<void>}
*/
  public static async setRolePermission(ctx: RouterContext): Promise<void> {
    const data = ctx.request.body as unknown as RolePermissionRequest;
    const result = await RoleService.setRolePermission(data);
    ctx.body = result;
  }
}
