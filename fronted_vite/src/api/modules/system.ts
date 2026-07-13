import type { ResPage, Menu, Account, Role, Auth, System, Dictionary } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 系统管理模块
 */

// 获取用户菜单列表
export const getMenuList = (params: Menu.QueryMenuList) => {
  return http.get<Menu.MenuTreeItem[]>(PORT1 + `/menus/current`, params);
};

// 获取所有菜单
export const getAllMenuList = (params: Menu.QueryMenuList) => {
  return http.get<ResPage<Menu.MenuTreeItem>>(
    PORT1 + `/menus`,
    params
  );
};
// 获取所有权限按钮
export const getAuthBtnsList = (params: { type?: string }) => {
  return http.get<ResPage<Auth.AuthDataList>>(
    PORT1 + `/permissions`,
    params
  );
};
// 新增菜单
export const addMenu = (data: Menu.CreateMenu) => {
  return http.post<void>(PORT1 + `/menus`, data);
};
// 编辑菜单
export const editMenu = (data: Menu.UpdateMenu) => {
  return http.put<void>(PORT1 + `/menus/${data.id}`, data);
};
// 删除菜单
export const delMenu = (id: number | string) => {
  return http.delete<void>(PORT1 + `/menus/${id}`);
};

//账号列表
export const getAccountList = (params: Account.QueryUser) => {
  return http.get<ResPage<Account.UserItem>>(PORT1 + `/users`, params);
};
// 新增账号
export const addAccount = (data: Account.BaseUser) => {
  return http.post<void>(PORT1 + `/users`, data);
};
// 编辑账号
export const editAccount = (data: Partial<Account.UpdateUser>) => {
  return http.put<void>(PORT1 + `/users/${data.id}`, data);
};
// 删除账号
export const delAccount = (id: number | string) => {
  return http.delete<void>(PORT1 + `/users/${id}`);
};

//角色列表
export const getRoleList = (params: Role.QueryRole) => {
  return http.get<ResPage<Role.RoleItem>>(PORT1 + `/roles`, params);
};
//新增角色
export const addRole = (data: Role.BaseRole) => {
  return http.post<void>(PORT1 + `/roles`, data);
};
//角色授权
export const authRole = (data: Role.AuthData) => {
  return http.put<void>(PORT1 + `/roles/${data.id}/permissions`, data);
};
// 编辑账号
export const editRole = (data: Partial<Role.UpdateRole>) => {
  return http.put<void>(PORT1 + `/roles/${data.id}`, data);
};
// 删除账号
export const delRole = (id: number | string) => {
  return http.delete<void>(PORT1 + `/roles/${id}`);
};
//修改密码
export const resetPassword = (data: Role.ResetPassword) => {
  return http.put<void>(PORT1 + `/users/me/reset-password`, data);
};

// 获取系统日志（类型从 @/api/interface/index 的 System 命名空间导入）
export const getSystemLogs = (params: System.LogParams) => {
  return http.get<System.LogResponse>(PORT1 + `/logs`, params);
};

// 清空日志
// @param params 清理参数，支持 startTime, endTime, level, keyword
// 不传参默认清除所有日志
export const clearSystemLogs = (params?: System.ClearLogsParams) => {
  return http.delete<{ deletedCount: number; deletedFiles: string[]; retainedFiles: string[] }>(
    PORT1 + `/logs`,
    params
  );
};

//字典列表
export const getDictionaryList = (params: Dictionary.QueryDictionary) => {
  return http.get<ResPage<Dictionary.DictionaryItem>>(PORT1 + `/dictionaries`, params);
};
//新增字典
export const addDictionary = (data: Dictionary.CreateDictionary) => {
  return http.post<void>(PORT1 + `/dictionaries`, data);
};
//编辑字典
export const editDictionary = (data: Partial<Dictionary.UpdateDictionary>) => {
  return http.put<void>(PORT1 + `/dictionaries/${data.id}`, data);
};
//删除字典
export const delDictionary = (id: number | string) => {
  return http.delete<void>(PORT1 + `/dictionaries/${id}`);
};
//按类型获取字典选项
export const getDictionaryByType = (dictType: string) => {
  return http.get<Dictionary.DictionaryItem[]>(PORT1 + `/dictionaries/type/${dictType}`);
};
