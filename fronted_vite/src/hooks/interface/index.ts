export namespace Table {
  export type SearchParams = Record<string, unknown>;
  export type TableRow = Record<string, unknown> & { id?: string | number };

  export interface Pageable {
    pageNum: number;
    pageSize: number;
    total: number;
  }
  export interface StateProps {
    tableData: TableRow[];
    pageable: Pageable;
    searchParam: SearchParams;
    searchInitParam: SearchParams;
    totalParam: SearchParams;
    icon?: SearchParams;
  }
}

export namespace HandleData {
  export type MessageType = "" | "success" | "warning" | "info" | "error";
}

export namespace Theme {
  export type ThemeType = "light" | "inverted" | "dark";
  export type GreyOrWeakType = "grey" | "weak";
}
