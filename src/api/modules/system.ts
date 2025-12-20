import type { ResPage, Menu, Account } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 系统管理模块
 */

// 获取菜单列表
export const getMenuList = (params: Menu.QueryMenuList) => {
  return http.get<ResPage<Menu.MenuTreeItem>>(PORT1 + `/menuList`, params);
};
// 新增菜单
export const addMenu = (data: Menu.CreateMenu) => {
  return http.post<void>(PORT1 + `/addMenu`, data);
};
// 编辑菜单
export const editMenu = (data: Menu.UpdateMenu) => {
  return http.put<void>(PORT1 + `/editMenu`, data);
};
// 删除菜单
export const delMenu = (id: number | string) => {
  return http.delete<void>(PORT1 + `/deleteMenu/${id}`);
};

//账号列表
export const getAccountList = (params: Account.QueryUser) => {
  return http.get<ResPage<Account.UserItem>>(PORT1 + `/userList`, params);
};
// 新增账号
export const addAccount = (data: Account.BaseUser) => {
  return http.post<void>(PORT1 + `/addAccount`, data);
};
// 编辑账号
export const editAccount = (
  data: Partial<Account.BaseUser> & { id: number }
) => {
  return http.put<void>(PORT1 + `/editAccount`, data);
};
// 删除账号
export const delAccount = (id: number | string) => {
  return http.delete<void>(PORT1 + `/deleteAccount/${id}`);
};
