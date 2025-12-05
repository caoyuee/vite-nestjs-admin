import type{ ResPage, Menu } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 系统管理模块
 */

// 获取菜单列表
export const getMenuList = (params: Menu.ReqMenuParams) => {
  return http.get<ResPage<Menu.ResMenuList>>(PORT1 + `/menuList`, params);
};
