/**
 * 菜单模块定义
 *
 * 【模块的作用】
 * 在 NestJS 中，模块（Module）是组织代码的基本单位
 * 每个功能模块都包含：
 * - controllers: 控制器，处理 HTTP 请求
 * - providers: 服务提供者，处理业务逻辑
 * - imports: 导入其他模块或数据库实体
 * - exports: 导出服务，供其他模块使用
 *
 * 【类比前端】
 * - 模块 ≈ Vue 的组件目录
 * - imports ≈ Vue 组件的 import 语句
 * - providers ≈ Vue 组件内部使用的 composables
 * - exports ≈ Vue 组件对外暴露的 props/methods
 */

import { Module } from '@nestjs/common';
// TypeOrmModule 用于在模块中注册数据库实体
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController, SystemMenuController } from './menu.controller';
import { MenuService } from './menu.service';
// 导入菜单实体，用于数据库操作
import { Menu } from '../../entities/menu.entity';
// 导入角色实体，用于查询角色关联的菜单
import { Role } from '../../entities/role.entity';

/**
 * 菜单模块类
 *
 * @Module 装饰器告诉 NestJS 这是一个模块
 *
 * 【模块内容说明】
 * - imports: 导入 TypeOrmModule 并注册 Menu 和 Role 实体
 *   这样在 Service 中就可以通过 @InjectRepository 注入这些实体的 Repository
 *
 * - controllers: 注册 MenuController，处理菜单相关的 HTTP 请求
 *
 * - providers: 注册 MenuService，提供菜单相关的业务逻辑
 *
 * - exports: 导出 MenuService，允许其他模块使用这个服务
 *   例如：如果其他模块需要获取菜单数据，可以导入 MenuModule
 */
@Module({
  // TypeOrmModule.forFeature() 注册当前模块需要使用的数据库实体
  // 注册后，可以在 Service 中通过 @InjectRepository 注入对应的 Repository
  imports: [TypeOrmModule.forFeature([Menu, Role])],

  // 注册控制器，处理 HTTP 请求
  controllers: [MenuController, SystemMenuController],

  // 注册服务，提供业务逻辑
  providers: [MenuService],

  // 导出服务，允许其他模块使用
  exports: [MenuService],
})
export class MenuModule {}
