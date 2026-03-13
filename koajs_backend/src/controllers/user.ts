import type { RouterContext } from "@koa/router";
import UserService from "../service/UserService.ts";
import Response from "../config/responseManage.conf.ts";
import redis from "../config/REDIS.conf.ts";
import { getLogs, clearLogs, logger } from "../middleware/logger.ts";
import type {
  UserLogin,
  CreateUser,
  UpdateUser,
  UserListQuery,
  ResetPasswordRequest,
  JwtPayload
} from "../types/User.d.ts";

export default class UserController {
  /**
   * 用户登录
   * @param ctx Koa路由上下文
   */
  public static async userLogin(ctx: RouterContext): Promise<void> {
    const data = ctx.request.body as unknown as UserLogin;
    const result = await UserService.userLogin(data);
    ctx.body = result;
  }

  /**
   * 获取当前用户信息
   * @param ctx Koa路由上下文
   */
  public static async userInfo(ctx: RouterContext): Promise<void> {
    const userId = (ctx.state.user as JwtPayload).sub.toString();
    const result = await UserService.userInfo(userId);
    ctx.body = result;
  }

  /**
   * 创建新用户
   * @param ctx Koa路由上下文
   */
  public static async addNewUser(ctx: RouterContext): Promise<void> {
    const data = ctx.request.body as unknown as CreateUser;
    const result = await UserService.addUser(data);
    ctx.body = result;
  }

  /**
   * 删除用户
   * @param ctx Koa路由上下文
   */
  public static async deleteUser(ctx: RouterContext): Promise<void> {
    const id = ctx.params.id as string;
    const result = await UserService.deleteUser(id);
    ctx.body = result;
  }

  /**
   * 编辑用户信息
   * @param ctx Koa路由上下文
   */
  public static async editUserInfo(ctx: RouterContext): Promise<void> {
    const data = ctx.request.body as unknown as UpdateUser;
    const result = await UserService.editUser(data);
    ctx.body = result;
  }

  /**
   * 重置密码
   * @param ctx Koa路由上下文
   */
  public static async resetPassword(ctx: RouterContext): Promise<void> {
    const data = ctx.request.body as unknown as ResetPasswordRequest;
    const userId = (ctx.state.user as JwtPayload).sub.toString();
    const result = await UserService.resetPwd(userId, data);
    ctx.body = result;
  }

  /**
   * 退出登录
   * @param ctx Koa路由上下文
   */
  public static async userLogout(ctx: RouterContext): Promise<void> {
    const userId = (ctx.state.user as JwtPayload).sub.toString();
    await redis.del(`token_${userId}`);
    ctx.body = Response(null, "退出成功", 200);
  }

  /**
   * 获取系统日志
   * 支持分页和筛选
   * @param ctx Koa路由上下文
   * @query time 日志时间基准（ISO格式日期字符串）
   * @query pageNumber 页码（默认1）
   * @query pageSize 每页数量（默认10）
   * @query level 日志级别（error, http, info）
   * @query keyword 关键字搜索
   * @query startTime 开始时间（yyyy-MM-dd格式）
   * @query endTime 结束时间（yyyy-MM-dd格式）
   */
  public static async getLogs(ctx: RouterContext): Promise<void> {
    const query = ctx.query as any;

    const params = {
      time: query.time ? new Date(query.time as string) : new Date(),
      pageNumber: parseInt(query.pageNumber) || 1,
      pageSize: parseInt(query.pageSize) || 10,
      level: query.level || undefined,
      keyword: query.keyword || undefined,
      startTime: query.startTime || undefined,
      endTime: query.endTime || undefined,
    };

    const result = await getLogs(params);
    ctx.body = Response(result, "获取成功", 200);
  }

  /**
   * 获取用户列表
   * @param ctx Koa路由上下文
   */
  public static async getUserList(ctx: RouterContext): Promise<void> {
    const data = ctx.request.query as UserListQuery;
    const result = await UserService.queryUserList(data);
    ctx.body = result;
  }

  /**
   * 清空日志
   * 根据查询条件清理日志文件，不传参则清除所有
   * @param ctx Koa路由上下文
   * @query startTime 开始时间（yyyy-MM-dd格式），不传则清除所有
   * @query endTime 结束时间（yyyy-MM-dd格式），不传则清除所有
   * @query level 日志级别（error, http, info等），不传则清除所有级别
   * @query keyword 关键字，不传则不限制
   */
  public static async clearLogs(ctx: RouterContext): Promise<void> {
    const query = ctx.query as any;

    // 构建清理参数
    const params = {
      startTime: query.startTime || undefined,
      endTime: query.endTime || undefined,
      level: query.level || undefined,
      keyword: query.keyword || undefined,
    };

    // 记录操作日志
    logger.info("用户清空日志", {
      ...params,
      operator: (ctx.state.user as JwtPayload)?.username || 'system',
      ip: ctx.ip
    });

    const result = await clearLogs(params);
    ctx.body = Response(result, `成功清理 ${result.deletedCount} 个日志文件`, 200);
  }
}
