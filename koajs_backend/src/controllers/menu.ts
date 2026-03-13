import MenuService from "../service/MenuService.ts";
import { RoleRepository } from "../config/DB.conf.ts";
import Response from "../config/responseManage.conf.ts";
import type { RouterContext } from "@koa/router";
import { In } from "typeorm";
import type { CreateMenuRequest, UpdateMenuRequest, MenuListQuery } from "../types/Menu.d.ts";
import type { JwtPayload } from "../types/User.d.ts";
export default class MenuController {
  /**
* 新增菜单配置
*
* @public
* @static
* @async
* @param {RouterContext} ctx
* @returns {Promise<void>}
*/
  public static async addMenu(ctx: RouterContext): Promise<void> {
    const data = ctx.request.body as unknown as CreateMenuRequest;
    const result = await MenuService.addMenus(data);
    ctx.body = result;
  }

  /**
* 删除菜单
*
* @public
* @static
* @async
* @param {RouterContext} ctx
* @returns {Promise<void>}
*/
  public static async deleteMenu(ctx: RouterContext): Promise<void> {
    const id = ctx.params.id as string;
    const result = await MenuService.deleteMenu(id);
    ctx.body = result;
  }

  /**
* 编辑菜单
*
* @public
* @static
* @async
* @param {RouterContext} ctx
* @returns {Promise<void>}
*/
  public static async editMenu(ctx: RouterContext): Promise<void> {
    const data = ctx.request.body as unknown as UpdateMenuRequest;
    const result = await MenuService.editMenu(data);
    ctx.body = result;
  }
  /**
* 获取用户的菜单
*
* @public
* @static
* @async
* @param {RouterContext} ctx
* @returns {Promise<void>}
*/
  public static async getMenus(ctx: RouterContext): Promise<void> {
    //获取用户id
    const user = ctx.state.user as JwtPayload;
    console.log(user, "用户信息=============");
    // 将角色ID转换为字符串数组
    const roleIds = user.roles.map(id => String(id));
    const roleList = await RoleRepository.findBy({
      id: In(roleIds),
    });
    if (roleList && roleList.length === 0) {
      ctx.body = Response([], "未获取到菜单", 200);
      return;
    }
    const menuIds: (string | number)[] = roleList
      .map((role) => role.useMenus)
      .flat();
    const result = await MenuService.getMenuList([...new Set(menuIds)]);
    ctx.body = result;
  }
  /**
* 获取所有的菜单
*
* @public
* @static
* @async
* @param {RouterContext} ctx
* @returns {Promise<void>}
*/
  public static async getAllMenus(ctx: RouterContext): Promise<void> {
    const data = ctx.request.query as unknown as MenuListQuery;
    const result = await MenuService.getAllMenusList(data);
    ctx.body = result;
  }
}
