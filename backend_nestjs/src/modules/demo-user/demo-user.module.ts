/**
 * @file demo-user.module.ts
 * @description 演示用户模块 - 独立承载前端示例页面需要的数据接口
 */

import { Module } from '@nestjs/common';
import { DemoUserController } from './demo-user.controller';
import { DemoUserService } from './demo-user.service';

/**
 * 演示用户模块
 *
 * @class DemoUserModule
 * @description 不依赖真实用户表，避免演示数据污染后台账号管理。
 */
@Module({
  controllers: [DemoUserController],
  providers: [DemoUserService],
})
export class DemoUserModule {}
