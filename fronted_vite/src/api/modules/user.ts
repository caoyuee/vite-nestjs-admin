import type{ ResPage, User } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 用户管理模块
 */
// 获取用户列表
export const getUserList = (params: User.ReqUserParams) => {
  return http.get<ResPage<User.ResUserList>>(PORT1 + `/demo/users`, params);
};

// 获取树形用户列表
export const getUserTreeList = (params: User.ReqUserParams) => {
  return http.get<ResPage<User.ResUserList>>(PORT1 + `/demo/users/tree`, params);
};

// 新增用户
export const addUser = (params: { id: string }) => {
  return http.post(PORT1 + `/demo/users`, params);
};

// 批量添加用户
export const BatchAddUser = (params: FormData) => {
  return http.post(PORT1 + `/demo/users/import`, params);
};

// 编辑用户
export const editUser = (params: { id: string }) => {
  return http.put(PORT1 + `/demo/users/${params.id}`, params);
};

// 删除用户
export const deleteUser = (params: { id: string[] }) => {
  return http.delete(PORT1 + `/demo/users`, { ids: params.id.join(",") });
};

// 切换用户状态
export const changeUserStatus = (params: { id: string; status: number }) => {
  return http.put(PORT1 + `/demo/users/${params.id}/status`, { status: params.status });
};

// 重置用户密码
export const resetUserPassWord = (params: { id: string }) => {
  return http.put(PORT1 + `/demo/users/${params.id}/reset-password`, params);
};

// 导出用户数据
export const exportUserInfo = (params: User.ReqUserParams) => {
  return http.download(PORT1 + `/demo/users/export`, params);
};

// 获取用户状态字典
export const getUserStatus = () => {
  return http.get<User.ResStatus[]>(PORT1 + `/demo/users/status`);
};

// 获取用户性别字典
export const getUserGender = () => {
  return http.get<User.ResGender[]>(PORT1 + `/demo/users/gender`);
};

// 获取用户部门列表
export const getUserDepartment = () => {
  return http.get<User.ResDepartment[]>(PORT1 + `/demo/users/departments`, {}, { cancel: false });
};

// 获取用户角色字典
export const getUserRole = () => {
  return http.get<User.ResRole[]>(PORT1 + `/demo/users/roles`);
};
