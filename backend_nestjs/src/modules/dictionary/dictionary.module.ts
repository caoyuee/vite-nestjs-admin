/**
 * @file dictionary.module.ts
 * @description 字典模块 - 负责字典管理的所有功能
 *
 * 模块职责说明：
 * - 字典 CRUD（增删改查）
 * - 按类型获取字典选项
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DictionaryController,
  SystemDictionaryController,
} from './dictionary.controller';
import { DictionaryService } from './dictionary.service';
import { Dictionary } from '../../entities/dictionary.entity';

/**
 * 字典模块
 *
 * @class DictionaryModule
 *
 * @description
 * 字典管理模块，包含：
 * - DictionaryController: 处理字典相关的 HTTP 请求
 * - DictionaryService: 字典业务逻辑
 * - Dictionary: 字典实体
 */
@Module({
  // 导入 TypeORM 模块并注册 Dictionary 实体
  imports: [TypeOrmModule.forFeature([Dictionary])],

  // 注册控制器
  controllers: [DictionaryController, SystemDictionaryController],

  // 注册服务
  providers: [DictionaryService],

  // 导出服务，供其他模块使用
  exports: [DictionaryService],
})
export class DictionaryModule {}
