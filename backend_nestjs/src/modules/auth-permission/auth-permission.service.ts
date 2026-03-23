/**
 * 权限服务
 *
 * 【业务说明】
 * 提供权限数据的查询功能
 * 权限数据通常由系统初始化时预设，不需要动态创建
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const { type } = query;

    // 根据是否有类型参数决定查询方式
    let result: Auth[];
    if (type) {
      // 按类型查询
      result = await this.authRepository.findBy({ type });
    } else {
      // 查询所有
      result = await this.authRepository.find();
    }

    // 如果没有数据，返回空数组
    if (!result || result.length === 0) {
      return {
        code: 200,
        message: '未找到权限数据',
        data: [],
      };
    }

    return {
      code: 200,
      message: '查询成功',
      data: result,
    };
  }
}
