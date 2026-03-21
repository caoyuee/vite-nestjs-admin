/**
 * 角色模块定义
 *
 * 【业务说明】
 * 角色是权限管理的核心概念：
 * - 用户可以拥有一个或多个角色
 * - 角色关联菜单权限、按钮权限、表格权限
 * - 通过角色实现灵活的权限控制
 *
 * 【类比前端】
 * 类似于前端权限系统中的角色配置：
 * - admin 角色可以访问所有功能
 * - editor 角色只能编辑内容
 * - viewer 角色只能查看
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
// 导入角色实体
import { Role } from '../../entities/role.entity';
// 导入用户实体，用于查询用户角色信息
import { User } from '../../entities/user.entity';
// 导入权限实体，用于查询权限标识符
import { Auth } from '../../entities/auth.entity';

/**
 * 角色模块类
 *
 * 【模块内容说明】
 * - imports: 注册 Role、User、Auth 三个实体
 *   Role: 角色数据
 *   User: 用户数据（查询用户的角色）
 *   Auth: 权限数据（查询权限标识符）
 */
@Module({
  // 注册三个数据库实体
  imports: [TypeOrmModule.forFeature([Role, User, Auth])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
