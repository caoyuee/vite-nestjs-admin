import type { PaginationParams } from './common.d.ts';




/**
 * 基础角色信息
 */
export interface BaseRole {
  /** 角色标识符 */
  role: string;
  /** 角色名称 */
  name: string;
  /** 排序序号 */
  sort: number;
  /** 角色描述 */
  description?: string;
  /** 角色状态（启用/禁用） */
  status: boolean;
  /** ProTable表格权限 */
  useProTable: string[];
  /** 按钮权限 */
  authButton: string[];
  /** 菜单权限ID列表 */
  useMenus: (string | number)[];
}



/**
 * 创建角色请求参数
 */
export interface CreateRole extends BaseRole {
  /** 角色描述 */
  description: string;
}

/**
 * 更新角色请求参数
 */
export interface UpdateRole extends Partial<BaseRole> {
  /** 角色ID */
  id: string;
}

/**
 * 角色项（包含ID和时间戳）
 */
export interface RoleItem extends BaseRole {
  /** 角色ID */
  id: string;
  /** 创建时间 */
  createTime: Date | string;
  /** 更新时间 */
  updateTime: Date | null | string;
}

/**
 * 权限数据
 */
export interface AuthData {
  /** 权限ID */
  id?: string;
  /** ProTable表格权限标识符列表 */
  useProTable?: string[];
  /** ProTable表格权限ID列表 */
  useProTableIds?: string[];
  /** 按钮权限标识符列表 */
  authButton?: string[];
  /** 按钮权限ID列表 */
  authButtonIds?: string[];
  /** 菜单权限ID列表 */
  useMenus: (string | number)[];
}

/**
 * 角色列表查询参数
 */
export interface RoleListQuery extends PaginationParams {
  /** 角色标识符 */
  role?: string;
  /** 角色名称 */
  name?: string;
  /** 角色状态 */
  status?: boolean;
}

/**
 * 角色列表响应数据
 */
export interface RoleListResponse {
  /** 角色列表 */
  list: RoleItem[];
  /** 总记录数 */
  total: number;
}

/**
 * 创建角色请求参数
 */
export type CreateRoleRequest = CreateRole;

/**
 * 更新角色请求参数
 */
export type UpdateRoleRequest = UpdateRole;

/**
 * 角色授权请求参数
 */
export interface RolePermissionRequest {
  /** 角色ID */
  id: string;
  /** 菜单权限ID列表 */
  useMenus: (string | number)[];
  /** ProTable表格权限标识符列表 */
  useProTable?: string[];
  /** 按钮权限标识符列表 */
  authButton?: string[];
}

/**
 * 角色信息响应
 */
export type RoleInfoResponse = RoleItem;
