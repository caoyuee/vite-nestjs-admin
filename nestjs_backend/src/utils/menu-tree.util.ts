import { Menu } from '../entities/menu.entity';

export interface MenuTreeItem {
  id: number | string;
  index: number;
  type: number;
  parentId: number;
  path: string;
  name: string;
  nameZH: string;
  component: string;
  redirect: string | null;
  status: boolean;
  meta: {
    icon?: string;
    title: string;
    isLink?: string;
    isHide?: boolean;
    isFull?: boolean;
    isAffix?: boolean;
    isKeepAlive?: boolean;
    activeMenu?: string;
  };
  children?: MenuTreeItem[];
  createTime?: Date | string;
  updateTime?: Date | null | string;
}

export function convertToSortedTree(menuData: Menu[]): MenuTreeItem[] {
  try {
    const menuMap = new Map<number, MenuTreeItem>();
    const tree: MenuTreeItem[] = [];

    menuData.forEach((item) => {
      menuMap.set(item.id, {
        ...item,
        id: item.id,
        children: [],
      });
    });

    menuData.forEach((item) => {
      const menuItem = menuMap.get(item.id);
      if (!menuItem) return;

      if (item.parentId === 0) {
        tree.push(menuItem);
      } else {
        const parent = menuMap.get(item.parentId);
        if (parent) {
          parent.children!.push(menuItem);
        }
      }
    });

    return sortRecursive(tree);
  } catch (_error) {
    return [];
  }
}

function sortRecursive(nodes: MenuTreeItem[]): MenuTreeItem[] {
  return nodes
    .sort((a, b) => a.index - b.index)
    .map((node) => ({
      ...node,
      children:
        node.children && node.children.length > 0
          ? sortRecursive(node.children)
          : [],
    }));
}

export interface RoleItem {
  id: string;
  useProTable: string[];
  authButton: string[];
  useMenus: (string | number)[];
}

export interface AuthData {
  useProTable?: string[];
  useProTableIds?: string[];
  authButton?: string[];
  authButtonIds?: string[];
  useMenus: (string | number)[];
}

export function extractAndMergeAuthDataAdvanced(
  roles: RoleItem[],
  options: {
    sort?: boolean;
    filterEmpty?: boolean;
  } = {},
): AuthData {
  const { sort = false, filterEmpty = true } = options;

  if (!Array.isArray(roles) || roles.length === 0) {
    return { useProTable: [], authButton: [], useMenus: [] };
  }

  const allUseProTableIds: string[] = [];
  const allAuthButtonIds: string[] = [];
  const allUseMenus: string[] = [];

  roles.forEach((role) => {
    if (Array.isArray(role.useProTable)) {
      const validItems = role.useProTable.filter((item) => {
        const strItem = String(item);
        return !filterEmpty || strItem.trim() !== '';
      });
      allUseProTableIds.push(...validItems);
    }

    if (Array.isArray(role.authButton)) {
      const validItems = role.authButton.filter((item) => {
        const strItem = String(item);
        return !filterEmpty || strItem.trim() !== '';
      });
      allAuthButtonIds.push(...validItems);
    }

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

  const useProTableIds = [...new Set(allUseProTableIds)];
  const authButtonIds = [...new Set(allAuthButtonIds)];
  const useMenus = [...new Set(allUseMenus)];

  if (sort) {
    useProTableIds.sort();
    authButtonIds.sort();
  }

  return { useProTableIds, authButtonIds, useMenus };
}
