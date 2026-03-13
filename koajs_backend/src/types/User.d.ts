import type { PaginationParams } from './common.d.ts';
export type { ResetPasswordRequest } from './common.d.ts';



/**
 * 基础用户信息
 */
export interface BaseUser {
  /** 用户名 */
  username: string;
  /** 密码（可选，查询时通常不返回） */
  password?: string;
  /** 姓名 */
  name: string;
  /** 邮箱 */
  email: string;
  /** 电话 */
  phone: string;
  /** 头像URL */
  avatar: string;
  /** 用户状态（启用/禁用） */
  status: boolean;
  /** 角色ID列表 */
  roles?: string[] | number[];
}


/**
 * 创建用户请求参数
 */
export interface CreateUser extends BaseUser {
  /** 密码（创建用户时必须） */
  password: string;
}

/**
 * 更新用户请求参数
 */
export interface UpdateUser extends Partial<BaseUser> {
  /** 用户ID */
  id: number | string;
}

/**
 * 用户项（包含ID和时间戳）
 */
export interface UserItem extends BaseUser {
  /** 用户ID */
  id: string;
  /** 创建时间 */
  createTime: Date | string;
  /** 更新时间 */
  updateTime: Date | null | string;
}

/**
 * 用户登录请求参数
 */
export interface UserLogin {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 其他登录参数 */
  [key: string]: unknown;
}

/**
 * 用户登录响应数据
 */
export interface UserLoginResponse {
  /** JWT令牌 */
  token: string;
}

/**
 * 用户信息（不包含密码）
 */
export type UserInfo = Omit<UserItem, 'password'>;

/**
 * 用户列表查询参数
 */
export interface UserListQuery extends PaginationParams {
  /** 用户名 */
  username?: string;
  /** 姓名 */
  name?: string;
  /** 邮箱 */
  email?: string;
  /** 电话 */
  phone?: string;
  /** 用户状态 */
  status?: boolean;
}

/**
 * 用户列表响应数据
 */
export interface UserListResponse {
  /** 用户列表（不包含密码） */
  list: UserInfo[];
  /** 总记录数 */
  total: number;
}



/**
 * JWT Token Payload
 */
export interface JwtPayload {
  /** 用户ID */
  sub: string;
  /** 用户名 */
  username: string;
  /** 角色ID列表 */
  roles: string[] | number[];
  /** 签发时间（时间戳） */
  iat?: number;
  /** 过期时间（时间戳） */
  exp?: number;
}
