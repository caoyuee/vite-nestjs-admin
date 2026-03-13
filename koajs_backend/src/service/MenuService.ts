// service/MenuService.ts
import { Menu } from "../entity/Menu.ts";
import { MenuRepository } from "../config/DB.conf.ts";
import Response from "../config/responseManage.conf.ts";
import { convertToSortedTree } from "../utils/tools.ts";
import { In } from "typeorm";
import type { CreateMenuRequest, UpdateMenuRequest, MenuListQuery, MenuListResponse, MenuTreeItem } from "../types/Menu.d.ts";
import type { ApiResponse } from "../types/common.d.ts";
import { NotFoundError, BusinessError } from "../utils/AppError.ts";
/**
 * 菜单实例
 *
 * @type {*}
 */

export default class MenuService {
  /**
* 新增菜单
*
* @public
* @static
* @async
* @param {CreateMenuRequest} data 创建菜单请求数据
* @returns {Promise<ApiResponse<null>>} 创建响应
*/
  public static async addMenus(data: CreateMenuRequest): Promise<ApiResponse<null>> {
    const menus = new Menu();
    menus.index = data.index;
    menus.parentId = data.parentId || 0;
    menus.path = data.path;
    menus.name = data.name;
    menus.nameZH = data.meta.title;
    menus.type = data.type ?? 0;
    menus.component = data.component;
    menus.redirect = data.redirect;
    menus.meta = data.meta;
    menus.status = data.status ?? true;

    const result = await MenuRepository.save(menus);
    console.log(result, "创建菜单===========");

    if (!result) {
      throw new BusinessError("菜单创建失败");
    }
    return Response(null, "创建成功,请刷新页面", 201);
  }

  /**
* 删除菜单
*
* @public
* @static
* @async
* @param {string} id 菜单ID
* @returns {Promise<ApiResponse<null>>} 删除响应
*/
  public static async deleteMenu(id: string): Promise<ApiResponse<null>> {
    const menu = await MenuRepository.findOneBy({ id });
    if (!menu) {
      throw new NotFoundError("该菜单不存在");
    }
    //软删除
    const result = await MenuRepository.softDelete({ id });
    console.log(result, "删除菜单===========");

    if (!result) {
      throw new BusinessError("菜单删除失败");
    }
    return Response(null, "删除成功,请刷新页面", 200);
  }

  /**
* 编辑菜单
*
* @public
* @static
* @async
* @param {UpdateMenuRequest} data 更新菜单请求数据
* @returns {Promise<ApiResponse<null>>} 更新响应
*/
  public static async editMenu(data: UpdateMenuRequest): Promise<ApiResponse<null>> {
    // 检查菜单是否存在
    const menu = await MenuRepository.findOneBy({ id: data.id });
    if (!menu) {
      throw new NotFoundError("菜单不存在");
    }

    // 准备更新数据
    if (data.index !== undefined) menu.index = data.index;
    if (data.parentId !== undefined) menu.parentId = data.parentId;
    if (data.path !== undefined) menu.path = data.path;
    if (data.name !== undefined) menu.name = data.name;
    if (data.type !== undefined) menu.type = data.type;
    if (data.component !== undefined) menu.component = data.component;
    if (data.redirect !== undefined) menu.redirect = data.redirect;
    if (data.status !== undefined) menu.status = data.status;

    // 处理meta和nameZH
    if (data.meta !== undefined) {
      menu.meta = data.meta;
      if (data.meta.title !== undefined) {
        menu.nameZH = data.meta.title;
      }
    }

    const result = await MenuRepository.save(menu);
    console.log(result, "编辑菜单===========");

    if (!result) {
      throw new BusinessError("菜单编辑失败");
    }
    return Response(null, "编辑成功,请刷新页面", 201);
  }
  /**
* 获取用户菜单
*
* @public
* @static
* @async
* @param {(string | number)[]} ids 菜单ID数组
* @returns {Promise<ApiResponse<MenuTreeItem[]>>} 菜单树响应
*/
  public static async getMenuList(ids: (string | number)[]): Promise<ApiResponse<MenuTreeItem[]>> {
    // 将ID转换为字符串，因为数据库中的id是字符串类型
    const stringIds = ids.map(id => String(id));
    const result = await MenuRepository.findBy({
      id: In(stringIds),
    });
    // 如果没有找到菜单，返回空数组而不是错误
    if (!result || result.length === 0) {
      return Response([]);
    }
    const serializationResult = convertToSortedTree(result);
    return Response(serializationResult);
  }

  /**
* 获取所有菜单
*
* @public
* @static
* @async
* @param {MenuListQuery} data 菜单查询参数
* @returns {Promise<ApiResponse<MenuListResponse>>} 菜单列表响应
*/
  public static async getAllMenusList(data: MenuListQuery): Promise<ApiResponse<MenuListResponse>> {
    const { pageNum = 1, pageSize } = data;
    const result = await MenuRepository.find();
    // 如果没有菜单，返回空列表
    if (!result || result.length === 0) {
      return Response({ list: [], total: 0 });
    }
    const serializationResult = convertToSortedTree(result);
    const total = serializationResult.length;

    let list: MenuTreeItem[];
    if (pageSize) {
      // 复制数组以避免修改原数组
      const tempArray = [...serializationResult];
      list = tempArray.splice(
        (pageNum - 1) * pageSize,
        pageSize
      );
    } else {
      list = serializationResult;
    }

    return Response({ list, total });
  }
}
