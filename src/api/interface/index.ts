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
  export interface UserInfo {
    username: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    status: boolean;
    roles?: number[];
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
    icon: string | undefined;
    title: string;
    isLink: string | undefined;
    isHide: boolean;
    isFull: boolean;
    isAffix: boolean;
    isKeepAlive: boolean;
    activeMenu: string | undefined;
  }
  export interface BaseMenu {
    index: number; //菜单排序
    parentId: number | string; //父级ID
    type: number; //菜单类型 0分组 1页面
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
    id: string; //菜单ID
  }

  export interface MenuTreeItem extends BaseMenu {
    id: string;
    children?: MenuTreeItem[];
    createTime?: Date | string;
    updateTime?: Date | null | string;
  }
}
//账号管理模块
export namespace Account {
  /**
   * 账号相关类型配置
   *
   * @export
   * @interface UserItem
   * @typedef {UserItem}
   */
  export interface BaseUser {
    username: string;
    password?: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    status: boolean;
    roles?: string[];
  }

  export interface QueryUser extends ReqPage {
    username?: string;
    name?: string;
    email?: string;
    phone?: string;
    status?: boolean;
    [key: string]: unknown;
  }
  export interface CreateUser extends BaseUser {
    password: string;
  }

  export interface UpdateUser extends Partial<BaseUser> {
    id: string;
  }

  export interface UserItem extends BaseUser {
    id: string;
    createTime: Date | string;
    updateTime: Date | null | string;
  }

  export interface UserLogin {
    username: string;
    password: string;
    [key: string]: unknown;
  }
}

//角色管理模块
export namespace Role {
  /**
   * 角色相关类型配置
   *
   * @export
   * @interface RequestRoleList
   * @typedef {RequestRoleList}
   * @extends {Page}
   */

  export interface BaseRole {
    role: string;
    name: string;
    sort: number;
    description?: string;
    status: boolean;
    useProTable: string[];
    authButton: string[];
    useMenus: string[];
  }

  export interface QueryRole extends ReqPage {
    role?: string;
    name?: string;
    status?: boolean;
    [key: string]: unknown;
  }

  export interface CreateRole extends BaseRole {
    description: string;
  }

  export interface UpdateRole extends Partial<BaseRole> {
    id: string;
  }

  export interface RoleItem extends BaseRole {
    id: string;
    createTime: Date | string;
    updateTime: Date | null | string;
  }

  export interface AuthData {
    id: string;
    useProTable?: string[];
    authButton?: string[];
    useMenus?: string[];
  }
  export interface ResetPassword {
    oldPassword: string;
    newPassword: string;
  }
}

export namespace Auth {
  export interface AuthDataList {
    id: string;
    sort: number;
    name: string;
    permission: string;
    type: string;
    description: string;
    createTime: Date;
    updateTime: Date | null;
    deleteTime: Date | null;
  }
}

// 系统日志模块
export namespace System {
  /**
   * 日志查询参数
   */
  export interface LogParams {
    time?: string;        // 日志时间基准（ISO格式日期字符串）
    pageNumber?: number;  // 页码（默认1）
    pageSize?: number;    // 每页数量（默认10）
    level?: string;       // 日志级别（error, http, info）
    keyword?: string;    // 关键字搜索
    startTime?: string;   // 开始时间（yyyy-MM-dd格式）
    endTime?: string;     // 结束时间（yyyy-MM-dd格式）
  }

  /**
   * 清空日志参数
   */
  export interface ClearLogsParams {
    startTime?: string;  // 开始时间（yyyy-MM-dd格式），不传则清除所有
    endTime?: string;    // 结束时间（yyyy-MM-dd格式），不传则清除所有
    level?: string;      // 日志级别，不传则清除所有级别
    keyword?: string;    // 关键字，不传则不限制
  }

  /**
   * 日志条目
   */
  export interface LogItem {
    timestamp: string;    // 时间戳
    level: string;        // 日志级别
    message: string;      // 消息内容
    method?: string;      // 请求方法
    url?: string;         // 请求URL
    status?: number;      // 状态码
    duration?: number;    // 请求耗时
    ip?: string;          // IP地址
    user?: string;       // 用户
    error?: string;       // 错误信息
  }

  /**
   * 日志响应
   */
  export interface LogResponse {
    list: LogItem[];      // 日志列表
    total: number;       // 总数
    pageNumber: number;  // 当前页码
  }
}
