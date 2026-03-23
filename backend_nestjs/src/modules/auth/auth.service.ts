/**
 * @file auth.service.ts
 * @description 认证服务 - 处理登录验证、token 生成等业务逻辑
 *
 * Service 概念说明：
 * - Service（服务）负责业务逻辑处理
 * - 类似于 Vue 的 Store（Pinia/Vuex）中的 actions
 * - 被 Controller 调用，不直接处理 HTTP 请求
 *
 * 类比前端：
 * - 类似于 Pinia Store 的 actions
 * - 类似于 API 请求封装层
 * - 类似于业务逻辑处理函数
 *
 * @Injectable() 装饰器：
 * - 标记这个类可以被依赖注入
 * - 类似于 Vue 的 provide
 */

import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import Redis from 'ioredis';
import { Inject } from '@nestjs/common';

import { User } from '../../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../../common/interfaces/response.interface';
import { REDIS_CLIENT } from '../../config/redis.config';

/**
 * 认证服务
 *
 * @class AuthService
 *
 * @description
 * 负责认证相关的业务逻辑：
 * 1. 验证用户登录
 * 2. 生成 JWT token
 * 3. 管理 token（存储到 Redis）
 * 4. 用户登出（清除 token）
 */
@Injectable() // 标记为可注入的服务
export class AuthService {
  /**
   * 构造函数 - 依赖注入
   *
   * @param {Repository<User>} userRepository - 用户数据仓库
   * @param {JwtService} jwtService - JWT 服务
   * @param {Redis} redis - Redis 客户端
   *
   * @InjectRepository(User) 注入 User 实体的 Repository
   * Repository 类似于前端的 API 封装，用于操作数据库
   *
   * @Inject(REDIS_CLIENT) 注入自定义的 Redis 客户端
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  /**
   * 用户登录
   *
   * @description
   * 登录流程：
   * 1. 根据用户名查询用户
   * 2. 验证密码
   * 3. 生成 JWT token
   * 4. 将 token 存储到 Redis（用于主动失效）
   * 5. 返回 token
   *
   * @param {LoginDto} loginDto - 登录参数（用户名、密码）
   * @returns 包含 token 的响应对象
   * @throws {NotFoundException} 用户不存在
   * @throws {UnauthorizedException} 密码错误
   */
  async login(loginDto: LoginDto) {
    // 步骤 1：根据用户名查询用户
    // findOne 类似于 SQL 的 SELECT * FROM user WHERE username = ?
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username },
    });

    // 如果用户不存在，抛出 404 异常
    if (!user) {
      throw new NotFoundException('用户不存在，请先注册');
    }

    // 步骤 2：验证密码
    // bcrypt.compareSync 对比明文密码和加密后的密码
    // 返回 true 表示密码正确，false 表示密码错误
    const passwordMatch = bcrypt.compareSync(loginDto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('密码错误');
    }

    // 步骤 3：生成 JWT token
    // payload 是 token 中携带的数据
    const payload: JwtPayload = {
      sub: String(user.id), // sub (subject) 通常是用户 ID
      username: user.username,
      roles: user.roles || [],
    };

    // 使用 JwtService 生成 token
    // sign 方法会自动添加 iat（签发时间）和 exp（过期时间）
    const token = this.jwtService.sign(payload);

    // 步骤 4：将 token 存储到 Redis
    // 这样可以实现主动让 token 失效（登出）
    // key: token_{用户ID}, value: token, 过期时间: 7 天
    const sevenDaysInSeconds = 7 * 24 * 60 * 60;
    await this.redis.set(`token_${user.id}`, token, 'EX', sevenDaysInSeconds);

    // 步骤 5：返回 token
    return {
      code: 200,
      message: 'success',
      data: { token },
    };
  }

  /**
   * 用户登出
   *
   * @description
   * 登出流程：
   * 1. 从 Redis 中删除用户的 token
   * 2. 返回成功响应
   *
   * 删除 token 后，即使 token 未过期，也无法通过验证
   * 这就是为什么要把 token 存到 Redis 的原因
   *
   * @param {string} userId - 用户 ID
   * @returns 登出成功响应
   */
  async logout(userId: string) {
    // 从 Redis 删除 token
    // del 方法返回删除的 key 数量
    await this.redis.del(`token_${userId}`);

    return {
      code: 200,
      message: '退出成功',
      data: null,
    };
  }

  /**
   * 验证 token 是否有效
   *
   * @description
   * 检查 Redis 中是否存在该用户的 token，且与传入的 token 一致
   * 用于实现 token 的主动失效
   *
   * @param {string} userId - 用户 ID
   * @param {string} token - JWT token
   * @returns {Promise<boolean>} token 是否有效
   */
  async validateToken(userId: string, token: string): Promise<boolean> {
    // 从 Redis 获取存储的 token
    const storedToken = await this.redis.get(`token_${userId}`);

    // 比较传入的 token 和存储的 token 是否一致
    return storedToken === token;
  }
}
