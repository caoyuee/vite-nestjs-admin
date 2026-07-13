import type { Menu } from "@/api/interface";

export interface MenuDrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Menu.MenuTreeItem>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}
