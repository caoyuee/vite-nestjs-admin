import type { ResPage, Menu, Account, Role, Auth, System, Dictionary } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 系统管理模块
 */

// 获取用户菜单列表
export const getMenuList = (params: Menu.QueryMenuList) => {
  return http.get<ResPage<Menu.MenuTreeItem>>(PORT1 + `/user/menuList`, params);
};

// 获取所有菜单
export const getAllMenuList = (params: Menu.QueryMenuList) => {
  return http.get<ResPage<Menu.MenuTreeItem>>(
    PORT1 + `/user/allMenuList`,
    params
  );
};
// 获取所有权限按钮
export const getAuthBtnsList = (params: { type?: string }) => {
  return http.get<ResPage<Auth.AuthDataList>>(
    PORT1 + `/user/getAuthBtns`,
    params
  );
};
// 新增菜单
export const addMenu = (data: Menu.CreateMenu) => {
  return http.post<void>(PORT1 + `/user/addMenu`, data);
};
// 编辑菜单
export const editMenu = (data: Menu.UpdateMenu) => {
  return http.put<void>(PORT1 + `/user/editMenu`, data);
};
// 删除菜单
export const delMenu = (id: number | string) => {
  return http.delete<void>(PORT1 + `/user/deleteMenu/${id}`);
};

//账号列表
export const getAccountList = (params: Account.QueryUser) => {
  return http.get<ResPage<Account.UserItem>>(PORT1 + `/user/userList`, params);
};
// 新增账号
export const addAccount = (data: Account.BaseUser) => {
  return http.post<void>(PORT1 + `/user/addUser`, data);
};
// 编辑账号
export const editAccount = (data: Partial<Account.UpdateUser>) => {
  return http.put<void>(PORT1 + `/user/editUser`, data);
};
// 删除账号
export const delAccount = (id: number | string) => {
  return http.delete<void>(PORT1 + `/user/deleteUser/${id}`);
};

//角色列表
export const getRoleList = (params: Role.QueryRole) => {
  return http.get<ResPage<Role.RoleItem>>(PORT1 + `/user/getRoleList`, params);
};
//新增角色
export const addRole = (data: Role.BaseRole) => {
  return http.post<void>(PORT1 + `/user/addRole`, data);
};
//角色授权
export const authRole = (data: Role.AuthData) => {
  return http.post<void>(PORT1 + `/user/putRolePermission`, data);
};
// 编辑账号
export const editRole = (data: Partial<Role.UpdateRole>) => {
  return http.put<void>(PORT1 + `/user/editRole`, data);
};
// 删除账号
export const delRole = (id: number | string) => {
  return http.delete<void>(PORT1 + `/user/deleteRole/${id}`);
};
//修改密码
export const resetPassword = (data: Role.ResetPassword) => {
  return http.put<void>(PORT1 + `/user/ResetPwd`, data);
};

// 获取系统日志（类型从 @/api/interface/index 的 System 命名空间导入）
export const getSystemLogs = (params: System.LogParams) => {
  return http.get<System.LogResponse>(PORT1 + `/user/logs`, params);
};

// 清空日志
// @param params 清理参数，支持 startTime, endTime, level, keyword
// 不传参默认清除所有日志
export const clearSystemLogs = (params?: System.ClearLogsParams) => {
  return http.delete<{ deletedCount: number; deletedFiles: string[]; retainedFiles: string[] }>(
    PORT1 + `/user/logs`,
    params
  );
};

//字典列表
export const getDictionaryList = (params: Dictionary.QueryDictionary) => {
  return http.get<ResPage<Dictionary.DictionaryItem>>(PORT1 + `/dictionary/list`, params);
};
//新增字典
export const addDictionary = (data: Dictionary.CreateDictionary) => {
  return http.post<void>(PORT1 + `/dictionary/add`, data);
};
//编辑字典
export const editDictionary = (data: Partial<Dictionary.UpdateDictionary>) => {
  return http.put<void>(PORT1 + `/dictionary/edit`, data);
};
//删除字典
export const delDictionary = (id: number | string) => {
  return http.delete<void>(PORT1 + `/dictionary/delete/${id}`);
};
//按类型获取字典选项
export const getDictionaryByType = (dictType: string) => {
  return http.get<Dictionary.DictionaryItem[]>(PORT1 + `/dictionary/type/${dictType}`);
};
