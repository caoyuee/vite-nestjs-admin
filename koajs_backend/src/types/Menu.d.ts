import type { PaginationParams } from './common.d.ts';



/**
 * 菜单元数据
 */
export interface Meta {
  /** 菜单图标 */
  icon?: string;
  /** 菜单标题 */
  title: string;
  /** 外部链接地址 */
  isLink?: string;
  /** 是否隐藏菜单 */
  isHide?: boolean;
  /** 是否全屏显示 */
  isFull?: boolean;
  /** 是否固定标签页 */
  isAffix?: boolean;
  /** 是否缓存组件 */
  isKeepAlive?: boolean;
  /** 高亮菜单路径 */
  activeMenu?: string;
}

/**
 * 基础菜单项
 */
export interface BaseMenu {
  /** 菜单排序序号 */
  index: number;
  /** 菜单类型 */
  type: number;
  /** 父级菜单ID */
  parentId: number;
  /** 路由路径 */
  path: string;
  /** 路由名称 */
  name: string;
  /** 路由中文名称 */
  nameZH: string;
  /** 组件路径 */
  component: string;
  /** 路由重定向地址 */
  redirect: string;
  /** 菜单状态（启用/禁用） */
  status: boolean;
  /** 菜单元数据 */
  meta: Meta;
}



/**
 * 创建菜单请求参数
 */
export interface CreateMenu extends BaseMenu {
  /** 菜单元数据 */
  meta: Meta;
}

/**
 * 更新菜单请求参数
 */
export interface UpdateMenu extends Partial<BaseMenu> {
  /** 菜单ID */
  id: string;
}

/**
 * 菜单树节点
 */
export interface MenuTreeItem extends BaseMenu {
  /** 菜单ID */
  id: string | number;
  /** 子菜单列表 */
  children?: MenuTreeItem[];
  /** 创建时间 */
  createTime?: Date | string;
  /** 更新时间 */
  updateTime?: Date | null | string;
}

/**
 * 菜单列表查询参数
 */
export interface MenuListQuery extends PaginationParams {
  /** 路由路径 */
  path?: string;
  /** 路由名称 */
  name?: string;
  /** 路由中文名称 */
  nameZH?: string;
  /** 组件路径 */
  component?: string;
  /** 菜单状态 */
  status?: boolean;
  /** 菜单类型 */
  type?: number;
  /** 父级菜单ID */
  parentId?: number;
}

/**
 * 菜单列表响应数据
 */
export interface MenuListResponse {
  /** 菜单列表 */
  list: MenuTreeItem[];
  /** 总记录数 */
  total: number;
}

/**
 * 菜单树节点
 */
export type MenuTreeNode = MenuTreeItem;

/**
 * 创建菜单请求参数
 */
export type CreateMenuRequest = CreateMenu;

/**
 * 更新菜单请求参数
 */
export type UpdateMenuRequest = UpdateMenu;
