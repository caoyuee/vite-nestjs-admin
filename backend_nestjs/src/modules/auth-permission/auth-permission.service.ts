/**
 * 权限服务
 *
 * 【业务说明】
 * 提供权限数据的查询功能
 * 权限数据通常由系统初始化时预设，不需要动态创建
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Auth } from '../../entities/auth.entity';
import { AuthQueryDto } from './dto/auth-query.dto';

/**
 * 权限服务类
 */
@Injectable()
export class AuthPermissionService {
  /**
   * 构造函数 - 注入权限数据库仓库
   *
   * @param authRepository - 权限实体的 Repository
   */
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  /**
   * 获取权限列表
   *
   * @param query - 查询参数
   * @returns 权限列表
   *
   * 【业务流程】
   * 1. 如果指定了类型，按类型筛选
   * 2. 否则查询所有权限
   *
   * 【权限类型说明】
   * - button: 按钮权限
   * - proTable: 表格列权限
   * - 其他自定义类型
   */
  async getAuthBtns(query: AuthQueryDto) {
    const { pageNum = 1, pageSize = 10, type, name, permission } = query;
    // 兼容旧前端使用的 btn，同时统一新规则为 button
    const normalizedType = type === 'btn' ? 'button' : type;

    // 根据查询参数构建筛选条件
    const where: FindOptionsWhere<Auth> = {};
    if (normalizedType) where.type = normalizedType;
    if (name) where.name = Like(`%${name}%`) as unknown as string;
    if (permission)
      where.permission = Like(`%${permission}%`) as unknown as string;

    const [result, total] = await this.authRepository.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: { sort: 'ASC', createTime: 'DESC' },
    });

    // 如果没有数据，返回空数组
    if (!result || result.length === 0) {
      return {
        code: 200,
        message: '未找到权限数据',
        data: { list: [], total: 0, pageNum, pageSize },
      };
    }

    return {
      code: 200,
      message: '查询成功',
      data: { list: result, total, pageNum, pageSize },
    };
  }
}
