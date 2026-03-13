import type { MenuTreeItem } from "../types/Menu.d.ts";
import type { RoleItem, AuthData } from "../types/Role.d.ts";
/**
 * 一体化版本：扁平转树形 + 每层排序
 * @param menuData 扁平菜单数据
 * @returns 排序后的树形菜单
 */
export function convertToSortedTree(menuData: MenuTreeItem[]): MenuTreeItem[] {
  try {
    const menuMap = new Map();
    const tree: MenuTreeItem[] = [];

    // 构建映射和初始化
    menuData.forEach((item) => {
      menuMap.set(item.id, { ...item, children: [] });
    });

    // 构建树形结构
    menuData.forEach((item) => {
      const menuItem = menuMap.get(item.id);

      if (item.parentId === 0) {
        tree.push(menuItem);
      } else {
        const parent = menuMap.get(item.parentId);
        if (parent) {
          parent.children.push(menuItem);
        }
      }
    });

    return sortRecursive(tree);
  } catch (error) {
    return [];
  }
}
// 递归排序函数
export const sortRecursive = (nodes: any[]): any[] => {
  return nodes
    .sort((a, b) => a.index - b.index)
    .map((node) => ({
      ...node,
      children:
        node.children && node.children.length > 0
          ? sortRecursive(node.children)
          : [],
    }));
};
/**
 * 获取权限结构方法
 *
 * @interface RoleItem
 * @typedef {RoleItem}
 */
export function extractAndMergeAuthDataAdvanced(
  roles: RoleItem[],
  options: {
    sort?: boolean;
    filterEmpty?: boolean;
  } = {}
): AuthData {
  const { sort = false, filterEmpty = true } = options;

  if (!Array.isArray(roles) || roles.length === 0) {
    return { useProTable: [], authButton: [], useMenus: [] };
  }

  const allUseProTableIds: string[] = [];
  const allAuthButtonIds: string[] = [];
  const allUseMenus: string[] = [];

  roles.forEach((role) => {
    // 处理 useProTable
    if (Array.isArray(role.useProTable)) {
      const validItems = role.useProTable.filter(
        (item) => {
          const strItem = String(item);
          return (!filterEmpty || strItem.trim() !== "");
        }
      );
      allUseProTableIds.push(...validItems);
    }

    // 处理 authButton
    if (Array.isArray(role.authButton)) {
      const validItems = role.authButton.filter(
        (item) => {
          const strItem = String(item);
          return (!filterEmpty || strItem.trim() !== "");
        }
      );
      allAuthButtonIds.push(...validItems);
    }
    // 处理 useMenus
    if (Array.isArray(role.useMenus)) {
      const validItems = role.useMenus
        .filter((item) => {
          const strItem = String(item);
          return (!filterEmpty || strItem.trim() !== "");
        })
        .map(item => String(item));
      allUseMenus.push(...validItems);
    }
  });

  // 去重
  let useProTableIds = [...new Set(allUseProTableIds)];
  let authButtonIds = [...new Set(allAuthButtonIds)];
  let useMenus = [...new Set(allUseMenus)];

  // 排序（可选）
  if (sort) {
    useProTableIds.sort();
    authButtonIds.sort();
  }

  return { useProTableIds, authButtonIds, useMenus };
}

/**
 * 类型安全的过滤函数
 */
export function filterDataTyped<T extends Record<string, any>, K extends keyof T>(
  data: T,
  keys: K[],
  options?: {
    filterEmptyString?: boolean;
    filterEmptyArray?: boolean;
    filterEmptyObject?: boolean;
    filterNull?: boolean;
    filterUndefined?: boolean;
  }
): Pick<T, K> {
  const {
    filterEmptyString = true,
    filterEmptyArray = true,
    filterEmptyObject = true,
    filterNull = true,
    filterUndefined = true
  } = options || {};

  const result: Partial<Pick<T, K>> = {};

  for (const key of keys) {
    const value = data[key];

    // 检查值是否有效
    let isValid = true;

    // null 检查
    if (filterNull && value === null) {
      isValid = false;
    }

    // undefined 检查
    if (filterUndefined && value === undefined) {
      isValid = false;
    }

    // 空字符串检查
    if (isValid && filterEmptyString && typeof value === 'string' && value.trim() === '') {
      isValid = false;
    }

    // 空数组检查
    if (isValid && filterEmptyArray && Array.isArray(value) && value.length === 0) {
      isValid = false;
    }

    // 空对象检查
    if (isValid && filterEmptyObject && typeof value === 'object' && value !== null) {
      if (value.constructor === Object && Object.keys(value).length === 0) {
        isValid = false;
      }
    }

    if (isValid) {
      result[key] = value;
    }
  }

  return result as Pick<T, K>;
}

