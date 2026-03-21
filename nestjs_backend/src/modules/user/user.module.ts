/**
 * @file user.module.ts
 * @description 用户模块 - 负责用户管理的所有功能
 *
 * 模块职责说明：
 * - 用户 CRUD（增删改查）
 * - 用户信息查询
 * - 密码重置
 *
 * 类比前端：
 * - 类似于 Vue 的用户管理模块
 * - 类似于一个独立的功能模块
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';

/**
 * 用户模块
 *
 * @class UserModule
 *
 * @description
 * 用户管理模块，包含：
 * - UserController: 处理用户相关的 HTTP 请求
 * - UserService: 用户业务逻辑
 * - User: 用户实体
 */
@Module({
  // 导入 TypeORM 模块并注册 User 实体
  // 这样在本模块中就可以注入 UserRepository
  imports: [TypeOrmModule.forFeature([User])],

  // 注册控制器
  controllers: [UserController],

  // 注册服务
  providers: [UserService],

  // 导出服务，供其他模块使用
  exports: [UserService],
})
export class UserModule {}
