import type { Menu } from "@/api/interface";

export interface MenuDrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Menu.MenuTreeItem>;
  api?: (params: never) => Promise<unknown>;
  getTableList?: () => void;
}
