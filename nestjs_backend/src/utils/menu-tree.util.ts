/**
 * 菜单树工具函数
 *
 * 【业务说明】
 * 提供菜单数据处理相关的工具函数：
 * 1. 将扁平的菜单列表转换为树形结构
 * 2. 合并多个角色的权限数据
 *
 * 【类比前端】
 * 类似于前端的数组处理工具函数：
 * - 列表转树形结构
 * - 数组去重、合并
 */

import { Menu } from '../entities/menu.entity';

/**
 * 菜单树节点接口
 *
 * 定义树形结构中每个节点的数据结构
 * 与 Menu 实体类似，但增加了 children 字段
 */
export interface MenuTreeItem {
  id: number | string;       // 菜单ID
  index: number;             // 排序序号
  type: number;              // 菜单类型
  parentId: number;          // 父级菜单ID
  path: string;              // 路由路径
  name: string;              // 路由名称
  nameZH: string;            // 中文名称
  component: string;         // 组件路径
  redirect: string | null;   // 重定向地址
  status: boolean;           // 状态
  meta: {
    icon?: string;           // 图标
    title: string;           // 标题
    isLink?: string;         // 外部链接
    isHide?: boolean;        // 是否隐藏
    isFull?: boolean;        // 是否全屏
    isAffix?: boolean;       // 是否固定
    isKeepAlive?: boolean;   // 是否缓存
    activeMenu?: string;     // 高亮菜单
  };
  children?: MenuTreeItem[]; // 子菜单列表
  createTime?: Date | string;
  updateTime?: Date | null | string;
}

/**
 * 将扁平的菜单列表转换为树形结构
 *
 * @param menuData - 菜单列表（扁平结构）
 * @returns 树形结构的菜单列表
 *
 * 【算法说明】
 * 1. 创建一个 Map，存储所有菜单项（以 ID 为键）
 * 2. 遍历菜单列表，将每个菜单项添加到其父菜单的 children 中
 * 3. parentId 为 0 的菜单是顶级菜单，添加到结果树中
 * 4. 递归排序所有层级的菜单
 *
 * 【类比前端】
 * 类似于前端的列表转树形结构函数：
 * ```js
 * function listToTree(items) {
 *   const map = {};
 *   const tree = [];
 *   items.forEach(item => map[item.id] = { ...item, children: [] });
 *   items.forEach(item => {
 *     if (item.parentId === 0) {
 *       tree.push(map[item.id]);
 *     } else {
 *       map[item.parentId]?.children.push(map[item.id]);
 *     }
 *   });
 *   return tree;
 * }
 * ```
 */
export function convertToSortedTree(menuData: Menu[]): MenuTreeItem[] {
  try {
    // 创建菜单映射表，用于快速查找菜单
    const menuMap = new Map<number, MenuTreeItem>();
    // 存储最终的树形结构
    const tree: MenuTreeItem[] = [];

    // 第一遍遍历：创建所有菜单项的映射
    menuData.forEach((item) => {
      menuMap.set(item.id, {
        ...item,
        id: item.id,
        children: [],  // 初始化 children 为空数组
      });
    });

    // 第二遍遍历：建立父子关系
    menuData.forEach((item) => {
      const menuItem = menuMap.get(item.id);
      if (!menuItem) return;

      if (item.parentId === 0) {
        // parentId 为 0 表示顶级菜单，直接添加到树中
        tree.push(menuItem);
      } else {
        // 查找父菜单，将当前菜单添加到父菜单的 children 中
        const parent = menuMap.get(item.parentId);
        if (parent) {
          parent.children!.push(menuItem);
        }
      }
    });

    // 递归排序并返回
    return sortRecursive(tree);
  } catch (_error) {
    // 发生错误时返回空数组
    return [];
  }
}

/**
 * 递归排序菜单树
 *
 * @param nodes - 菜单节点数组
 * @returns 排序后的菜单树
 *
 * 【排序规则】
 * 按 index 字段升序排序
 * 递归处理所有层级的子菜单
 */
function sortRecursive(nodes: MenuTreeItem[]): MenuTreeItem[] {
  return nodes
    .sort((a, b) => a.index - b.index)  // 按 index 升序排序
    .map((node) => ({
      ...node,
      // 递归排序子菜单
      children:
        node.children && node.children.length > 0
          ? sortRecursive(node.children)
          : [],
    }));
}

/**
 * 角色数据接口
 *
 * 用于权限合并时的角色数据结构
 */
export interface RoleItem {
  id: string;                      // 角色ID
  useProTable: string[];           // 表格权限ID列表
  authButton: string[];            // 按钮权限ID列表
  useMenus: (string | number)[];   // 菜单权限ID列表
}

/**
 * 合并后的权限数据接口
 */
export interface AuthData {
  useProTable?: string[];          // 表格权限标识符列表
  useProTableIds?: string[];       // 表格权限ID列表
  authButton?: string[];           // 按钮权限标识符列表
  authButtonIds?: string[];        // 按钮权限ID列表
  useMenus: (string | number)[];   // 菜单权限ID列表
}

/**
 * 提取并合并多个角色的权限数据
 *
 * @param roles - 角色列表
 * @param options - 配置选项
 * @returns 合并后的权限数据
 *
 * 【业务场景】
 * 用户可能有多个角色，需要合并所有角色的权限
 * 例如：用户同时是 admin 和 editor，权限是两者的并集
 *
 * 【算法说明】
 * 1. 遍历所有角色
 * 2. 收集每个角色的权限ID
 * 3. 使用 Set 去重
 * 4. 返回合并后的权限数据
 *
 * 【类比前端】
 * 类似于前端的数组合并去重：
 * ```js
 * const merged = [...new Set([...arr1, ...arr2])];
 * ```
 */
export function extractAndMergeAuthDataAdvanced(
  roles: RoleItem[],
  options: {
    sort?: boolean;        // 是否排序
    filterEmpty?: boolean; // 是否过滤空值
  } = {},
): AuthData {
  // 解构配置选项，设置默认值
  const { sort = false, filterEmpty = true } = options;

  // 如果角色列表为空，返回空权限
  if (!Array.isArray(roles) || roles.length === 0) {
    return { useProTable: [], authButton: [], useMenus: [] };
  }

  // 收集所有权限ID
  const allUseProTableIds: string[] = [];
  const allAuthButtonIds: string[] = [];
  const allUseMenus: string[] = [];

  // 遍历每个角色，收集权限
  roles.forEach((role) => {
    // 收集表格权限
    if (Array.isArray(role.useProTable)) {
      const validItems = role.useProTable.filter((item) => {
        const strItem = String(item);
        // 根据 filterEmpty 选项决定是否过滤空值
        return !filterEmpty || strItem.trim() !== '';
      });
      allUseProTableIds.push(...validItems);
    }

    // 收集按钮权限
    if (Array.isArray(role.authButton)) {
      const validItems = role.authButton.filter((item) => {
        const strItem = String(item);
        return !filterEmpty || strItem.trim() !== '';
      });
      allAuthButtonIds.push(...validItems);
    }

    // 收集菜单权限
    if (Array.isArray(role.useMenus)) {
      const validItems = role.useMenus
        .filter((item) => {
          const strItem = String(item);
          return !filterEmpty || strItem.trim() !== '';
        })
        .map((item) => String(item));
      allUseMenus.push(...validItems);
    }
  });

  // 使用 Set 去重
  const useProTableIds = [...new Set(allUseProTableIds)];
  const authButtonIds = [...new Set(allAuthButtonIds)];
  const useMenus = [...new Set(allUseMenus)];

  // 根据选项排序
  if (sort) {
    useProTableIds.sort();
    authButtonIds.sort();
  }

  // 返回合并后的权限数据
  return { useProTableIds, authButtonIds, useMenus };
}
