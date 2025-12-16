// 请求响应参数（不包含data）
export interface Result {
  code: string;
  message: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
  }
  export interface ResLogin {
    token: string;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string;
    gender: number;
    idCard: string;
    email: string;
    address: string;
    createTime: string[];
    status: number;
  }
  export interface ResUserList {
    id: string;
    username: string;
    gender: number;
    user: { detail: { age: number } };
    idCard: string;
    email: string;
    address: string;
    createTime: string;
    status: number;
    avatar: string;
    photo: any[];
    children?: ResUserList[];
  }
  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
}

// 菜单管理模块
export namespace Menu {
  export interface Meta {
    icon?: string;
    title: string;
    isLink?: string;
    isHide?: boolean;
    isFull?: boolean;
    isAffix?: boolean;
    isKeepAlive?: boolean;
    activeMenu?: string;
  }
  export interface BaseMenu {
    index: number; //菜单排序
    parentId: number; //父级ID
    type: number,//菜单类型 0分组 1页面
    path: string; //路由路径
    name: string; //路由名称
    component?: string; //组件路径
    redirect?: string; //路由重定向
    status: boolean; //状态
    meta: Meta; //meta 信息
  }

  export interface QueryMenuList extends ReqPage {
    path?: string; //路由路径
    name?: string; //路由名称
    component?: string; //组件路径
    status?: boolean;
    [key: string]: unknown;
  }

  export interface CreateMenu extends BaseMenu {
    meta: Meta; //meta 信息
  }

  export interface UpdateMenu extends Partial<BaseMenu> {
    id: number; //菜单ID
  }

  export interface MenuTreeItem extends BaseMenu {
    id: number;
    children?: MenuTreeItem[];
    createTime?: Date | string;
    updateTime?: Date | null | string;
  }
}