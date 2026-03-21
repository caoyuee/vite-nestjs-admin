/**
 * @file user.service.ts
 * @description 用户服务 - 处理用户管理的业务逻辑
 *
 * Service 职责说明：
 * - 用户 CRUD 业务逻辑
 * - 密码加密处理
 * - 数据验证和异常处理
 *
 * 类比前端：
 * - 类似于 Pinia Store 的 actions
 * - 类似于 API 请求封装层
 * - 类似于业务逻辑处理函数
 *
 * Repository 概念说明：
 * - Repository 是 TypeORM 提供的数据访问层
 * - 类似于前端的 API 封装，但操作的是数据库
 * - 提供增删改查方法：find, findOne, save, update, delete, softDelete 等
 */

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserListQueryDto } from './dto/user-list-query.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

/**
 * 用户服务
 *
 * @class UserService
 *
 * @description
 * 处理用户管理相关的所有业务逻辑：
 * - 获取用户信息
 * - 创建用户（注册）
 * - 更新用户信息
 * - 删除用户（软删除）
 * - 查询用户列表
 * - 重置密码
 */
@Injectable() // 标记为可注入的服务
export class UserService {
  /**
   * 构造函数 - 依赖注入 UserRepository
   *
   * @param {Repository<User>} userRepository - 用户数据仓库
   *
   * @InjectRepository(User) 装饰器告诉 NestJS 注入 User 实体的 Repository
   * Repository 类似于前端的 API 封装，但操作的是数据库
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 获取用户信息
   *
   * @description
   * 根据用户 ID 查询用户详细信息
   * 返回的用户信息不包含密码字段
   *
   * @param {string} userId - 用户 ID
   * @returns 用户信息响应
   * @throws {NotFoundException} 用户不存在
   */
  async getUserInfo(userId: string) {
    // 使用 findOne 查询单个用户
    // where 条件指定查询条件
    const user = await this.userRepository.findOne({
      where: { id: Number(userId) },
    });

    // 如果用户不存在，抛出 404 异常
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 解构赋值，排除密码字段
    // _password 使用下划线前缀表示未使用的变量
    const { password: _password, ...userInfo } = user;

    return {
      code: 200,
      message: 'success',
      data: userInfo,
    };
  }

  /**
   * 创建新用户
   *
   * @description
   * 创建新用户的流程：
   * 1. 检查用户名是否已存在
   * 2. 创建用户实体
   * 3. 加密密码
   * 4. 保存到数据库
   *
   * @param {CreateUserDto} createUserDto - 用户创建参数
   * @returns 创建结果响应
   * @throws {BadRequestException} 用户已存在或创建失败
   */
  async createUser(createUserDto: CreateUserDto) {
    // 步骤 1：检查用户名是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new BadRequestException('用户已存在，请直接登录');
    }

    // 步骤 2：创建用户实体
    // new User() 创建一个空的实体对象
    const user = new User();
    user.name = createUserDto.name;
    user.username = createUserDto.username;
    user.status = createUserDto.status ?? true; // ?? 表示如果为 null/undefined 则使用默认值
    user.email = createUserDto.email ?? null;
    user.phone = createUserDto.phone ?? null;
    user.avatar = createUserDto.avatar ?? null;
    user.roles =
      createUserDto.roles && createUserDto.roles.length > 0
        ? createUserDto.roles.map((id) => String(id))
        : [];

    // 步骤 3：加密密码
    // bcrypt 是一个密码加密库
    // hashSync(明文密码, 盐轮数) 返回加密后的密码
    const saltRounds = process.env.BCRYPT_SALT
      ? parseInt(process.env.BCRYPT_SALT)
      : 10;
    user.password = bcrypt.hashSync(createUserDto.password, saltRounds);

    // 步骤 4：保存到数据库
    // save() 方法会插入新记录或更新已有记录
    const result = await this.userRepository.save(user);
    if (!result) {
      throw new BadRequestException('创建用户失败');
    }

    return {
      code: 201,
      message: '创建成功,请登陆',
      data: null,
    };
  }

  /**
   * 更新用户信息
   *
   * @description
   * 更新用户的部分信息
   * 只更新 DTO 中提供的字段
   *
   * @param {UpdateUserDto} updateUserDto - 用户更新参数
   * @returns 更新结果响应
   * @throws {NotFoundException} 用户不存在
   * @throws {BadRequestException} 更新失败
   */
  async updateUser(updateUserDto: UpdateUserDto) {
    // 先查询用户是否存在
    const userToUpdate = await this.userRepository.findOne({
      where: { id: Number(updateUserDto.id) },
    });

    if (!userToUpdate) {
      throw new NotFoundException('用户不存在');
    }

    // 构建更新数据对象
    // 只包含需要更新的字段
    const updateData: Partial<User> = {};
    if (updateUserDto.name !== undefined) updateData.name = updateUserDto.name;
    if (updateUserDto.username !== undefined)
      updateData.username = updateUserDto.username;
    if (updateUserDto.roles !== undefined)
      updateData.roles = updateUserDto.roles.map((id) => String(id));
    if (updateUserDto.status !== undefined)
      updateData.status = updateUserDto.status;
    if (updateUserDto.email !== undefined)
      updateData.email = updateUserDto.email;
    if (updateUserDto.phone !== undefined)
      updateData.phone = updateUserDto.phone;
    if (updateUserDto.avatar !== undefined)
      updateData.avatar = updateUserDto.avatar;

    // 执行更新
    // update(条件, 更新数据) 返回 UpdateResult
    // affected 表示受影响的行数
    const result = await this.userRepository.update(
      { id: Number(updateUserDto.id) },
      updateData,
    );
    if (!result || result.affected === 0) {
      throw new BadRequestException('更新用户信息失败');
    }

    return {
      code: 200,
      message: '用户信息更新成功',
      data: null,
    };
  }

  /**
   * 删除用户
   *
   * @description
   * 软删除用户（不会真正删除记录）
   * 软删除会将 deleteTime 字段设置为当前时间
   * 查询时会自动过滤掉已软删除的记录
   *
   * @param {string} id - 用户 ID
   * @returns 删除结果响应
   * @throws {BadRequestException} 用户不存在或删除失败
   */
  async deleteUser(id: string) {
    // 检查用户是否存在
    const user = await this.userRepository.findOne({
      where: { id: Number(id) },
    });
    if (!user) {
      throw new BadRequestException('该用户不存在');
    }

    // 执行软删除
    // softDelete() 会设置 deleteTime 字段，而不是真正删除记录
    const result = await this.userRepository.softDelete({ id: Number(id) });
    if (!result) {
      throw new BadRequestException('删除用户失败');
    }

    return {
      code: 200,
      message: '用户删除成功',
      data: null,
    };
  }

  /**
   * 获取用户列表
   *
   * @description
   * 分页查询用户列表
   * 支持按用户名、姓名、邮箱、电话、状态筛选
   *
   * @param {UserListQueryDto} query - 查询参数
   * @returns 用户列表响应
   */
  async getUserList(query: UserListQueryDto) {
    // 解构分页参数和筛选条件
    const { pageNum = 1, pageSize = 10, ...filters } = query;

    // 构建查询条件
    const where: any = {};
    if (filters.username) where.username = filters.username;
    if (filters.name) where.name = filters.name;
    if (filters.email) where.email = filters.email;
    if (filters.phone) where.phone = filters.phone;
    if (filters.status !== undefined) where.status = filters.status;

    // 执行分页查询
    // findAndCount 返回 [数据列表, 总数]
    // skip: 跳过的记录数，用于分页
    // take: 获取的记录数，即每页数量
    // order: 排序方式
    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize, // 计算跳过的记录数
      take: pageSize, // 每页数量
      order: { createTime: 'DESC' }, // 按创建时间倒序
    });

    // 移除密码字段
    const userList = users.map((user) => {
      const { password: _password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return {
      code: 200,
      message: 'success',
      data: { list: userList, total },
    };
  }

  /**
   * 重置密码
   *
   * @description
   * 用户重置自己的密码
   * 需要验证旧密码，然后设置新密码
   *
   * @param {string} userId - 用户 ID
   * @param {ResetPasswordDto} resetPasswordDto - 重置密码参数
   * @returns 重置结果响应
   * @throws {NotFoundException} 用户不存在
   * @throws {UnauthorizedException} 原密码错误
   * @throws {BadRequestException} 重置失败
   */
  async resetPassword(userId: string, resetPasswordDto: ResetPasswordDto) {
    // 查询用户
    const userToUpdate = await this.userRepository.findOne({
      where: { id: Number(userId) },
    });
    if (!userToUpdate) {
      throw new NotFoundException('用户不存在');
    }

    // 验证旧密码
    // bcrypt.compareSync(明文密码, 加密密码) 返回是否匹配
    const passwordMatch = bcrypt.compareSync(
      resetPasswordDto.oldPassword,
      userToUpdate.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('原密码错误');
    }

    // 加密新密码
    const saltRounds = process.env.BCRYPT_SALT
      ? parseInt(process.env.BCRYPT_SALT)
      : 10;
    const hash = bcrypt.hashSync(resetPasswordDto.newPassword, saltRounds);

    // 更新密码
    const result = await this.userRepository.update(
      { id: Number(userId) },
      { password: hash },
    );
    if (result.affected === 0) {
      throw new BadRequestException('密码重置失败');
    }

    return {
      code: 200,
      message: '密码重置成功',
      data: null,
    };
  }
}
