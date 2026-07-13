/**
 * 权限模块定义
 *
 * 【业务说明】
 * 权限（Auth）是系统中最细粒度的权限控制单元：
 * - 按钮权限：控制按钮的显示/隐藏
 * - 表格列权限：控制表格列的显示/隐藏
 * - 其他功能权限
 *
 * 【权限与角色的关系】
 * - 权限是最小单位
 * - 角色包含多个权限
 * - 用户拥有角色，间接拥有权限
 *
 * 【类比前端】
 * 权限标识符用于前端权限判断：
 * - v-if="hasPermission('user:create')"
 * - v-if="hasPermission('user:delete')"
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AuthPermissionController,
  SystemPermissionController,
} from './auth-permission.controller';
import { AuthPermissionService } from './auth-permission.service';
// 导入权限实体
import { Auth } from '../../entities/auth.entity';

/**
 * 权限模块类
 */
@Module({
  // 注册权限实体
  imports: [TypeOrmModule.forFeature([Auth])],
  controllers: [AuthPermissionController, SystemPermissionController],
  providers: [AuthPermissionService],
  exports: [AuthPermissionService],
})
export class AuthPermissionModule {}
