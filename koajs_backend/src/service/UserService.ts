import { UserRepository } from "../config/DB.conf.ts";
import { User } from "../entity/User.ts";
import Response from "../config/responseManage.conf.ts";
import { signToken } from "../config/JWT.conf.ts";
import bcrypt from "bcryptjs";
import redis from "../config/REDIS.conf.ts";
import type {
  UserLogin,
  UserLoginResponse,
  CreateUser,
  UpdateUser,
  UserListQuery,
  UserListResponse,
  ResetPasswordRequest,
  UserInfo,
  JwtPayload
} from "../types/User.d.ts";
import type { ApiResponse } from "../types/common.d.ts";
import { NotFoundError, UnauthorizedError, BusinessError } from "../utils/AppError.ts";

/**
 * 盐度
 *
 * @type {*}
 */
const saltRounds = process.env.BCRYPT_SALT
  ? parseInt(process.env.BCRYPT_SALT)
  : 10;

/**
 * 用户实例
 *
 * @type {*}
 */

export default class UserService {
  /**
* 用户登录
*
* @public
* @static
* @async
* @param {UserLogin} data 登录请求数据
* @returns {Promise<ApiResponse<UserLoginResponse>>} 登录响应
*/
  public static async userLogin(data: UserLogin): Promise<ApiResponse<UserLoginResponse>> {
    const searchResult = await UserRepository.findOneBy({
      username: data.username,
    });
    if (!searchResult) {
      throw new NotFoundError("用户不存在，请先注册");
    }
    const passwordMatch = bcrypt.compareSync(
      data.password,
      searchResult.password
    );
    if (!passwordMatch) {
      throw new UnauthorizedError("密码错误");
    }

    // 安全的JWT payload，不包含密码
    const tokenPayload: JwtPayload = {
      sub: searchResult.id,
      username: searchResult.username,
      roles: searchResult.roles || [],
    };

    const token = signToken(tokenPayload);
    // 将token存储到Redis中,过期时间7天
    const sevenDaysInSeconds = 7 * 24 * 60 * 60;
    await redis.set(`token_${searchResult.id}`, token, "EX", sevenDaysInSeconds);

    return Response({ token });
  }
  /**
* 获取用户信息
*
* @public
* @static
* @async
* @param {string} id 用户ID
* @returns {Promise<ApiResponse<UserInfo>>} 用户信息响应
*/
  public static async userInfo(id: string): Promise<ApiResponse<UserInfo>> {
    const result = await UserRepository.findOneBy({ id });
    if (result === null) {
      throw new NotFoundError("用户不存在");
    }

    // 移除密码字段
    const { password, ...userInfo } = result;
    return Response(userInfo as UserInfo);
  }

  /**
* 新增用户
*
* @public
* @static
* @async
* @param {CreateUser} data 创建用户请求数据
* @returns {Promise<ApiResponse<null>>} 创建响应
*/
  public static async addUser(data: CreateUser): Promise<ApiResponse<null>> {
    // 检查用户名是否已存在
    const existingUser = await UserRepository.findOneBy({
      username: data.username,
    });
    if (existingUser) {
      throw new BusinessError("用户已存在，请直接登录");
    }

    // 创建新用户
    const user = new User();
    user.name = data.name;
    user.username = data.username;
    user.status = data.status ?? true;
    user.email = data.email ?? null;
    user.phone = data.phone ?? null;
    user.avatar = data.avatar ?? null;
    // 将角色ID统一转换为字符串数组
    user.roles = data.roles && data.roles.length > 0 ? data.roles.map(id => String(id)) : [];

    // 加密密码
    const hash = bcrypt.hashSync(data.password, saltRounds);
    user.password = hash;

    // 保存用户
    const result = await UserRepository.save(user);
    if (!result) {
      throw new BusinessError("创建用户失败");
    }

    return Response(null, "创建成功,请登陆", 201);
  }

  /**
* 删除用户
*
* @public
* @static
* @async
* @param {string} id 用户ID
* @returns {Promise<ApiResponse<null>>} 删除响应
*/
  public static async deleteUser(id: string): Promise<ApiResponse<null>> {
    const user = await UserRepository.findOneBy({ id });
    if (!user) {
      throw new BusinessError("该用户不存在");
    }

    const result = await UserRepository.softDelete({ id });
    if (!result) {
      throw new BusinessError("删除用户失败");
    }

    return Response(null, "用户删除成功", 200);
  }

  /**
* 编辑用户信息
*
* @public
* @static
* @async
* @param {UpdateUser} data 更新用户请求数据
* @returns {Promise<ApiResponse<null>>} 更新响应
*/
  public static async editUser(data: UpdateUser): Promise<ApiResponse<null>> {
    // 检查用户是否存在
    const userToUpdate = await UserRepository.findOneBy({ id: String(data.id) });
    if (!userToUpdate) {
      throw new NotFoundError("用户不存在");
    }

    // 准备更新数据，排除id和password字段
    const updateData: Partial<User> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.username !== undefined) updateData.username = data.username;
    if (data.roles !== undefined) updateData.roles = data.roles.map(id => String(id));
    if (data.status !== undefined) updateData.status = data.status;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;

    // 执行更新
    const result = await UserRepository.update({ id: String(data.id) }, updateData);
    if (!result || result.affected === 0) {
      throw new BusinessError("更新用户信息失败");
    }

    return Response(null, "用户信息更新成功", 200);
  }

  /**
* 重置密码
*
* @public
* @static
* @async
* @param {string} id 用户ID
* @param {ResetPasswordRequest} data 重置密码请求数据
* @returns {Promise<ApiResponse<null>>} 重置响应
*/
  public static async resetPwd(id: string, data: ResetPasswordRequest): Promise<ApiResponse<null>> {
    // 获取用户
    const userToUpdate = await UserRepository.findOneBy({ id });
    if (!userToUpdate) {
      throw new NotFoundError("用户不存在");
    }

    // 验证原密码
    const passwordMatch = bcrypt.compareSync(
      data.oldPassword,
      userToUpdate.password
    );
    if (!passwordMatch) {
      throw new UnauthorizedError("原密码错误");
    }

    // 加密新密码
    const hash = bcrypt.hashSync(data.newPassword, saltRounds);

    // 更新密码
    const result = await UserRepository.update(
      { id },
      { password: hash }
    );

    if (result.affected === 0) {
      throw new BusinessError("密码重置失败");
    }

    return Response(null, "密码重置成功", 200);
  }

  /**
* 查询用户列表
*
* @public
* @static
* @async
* @param {UserListQuery} data 用户列表查询参数
* @returns {Promise<ApiResponse<UserListResponse>>} 用户列表响应
*/
  public static async queryUserList(data: UserListQuery): Promise<ApiResponse<UserListResponse>> {
    const { pageNum = 1, pageSize = 10, ...filters } = data;

    // 构建查询条件
    const where: any = {};
    if (filters.username) where.username = filters.username;
    if (filters.name) where.name = filters.name;
    if (filters.email) where.email = filters.email;
    if (filters.phone) where.phone = filters.phone;
    if (filters.status !== undefined) where.status = filters.status;

    // 查询数据
    const [users, total] = await UserRepository.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: { createTime: 'DESC' },
    });

    // 移除密码字段
    const userList = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as UserInfo;
    });

    return Response({ list: userList, total });
  }
}
