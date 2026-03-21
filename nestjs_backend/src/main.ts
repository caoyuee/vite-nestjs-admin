/**
 * @file main.ts
 * @description NestJS 应用程序入口文件
 * @description 类似于 Vue 项目的 main.ts，是整个后端应用的启动点
 *
 * NestJS 核心概念说明：
 * - NestFactory: 用于创建 NestJS 应用实例的工厂类
 * - AppModule: 根模块，类似于 Vue 的 App.vue，是整个应用的根组件
 * - ValidationPipe: 全局管道，用于自动验证请求数据
 * - Swagger: API 文档生成工具，类似于前端的 Storybook
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * 应用启动函数
 *
 * @description
 * 这是整个后端应用的入口函数，类似于 Vue 项目的 createApp()
 * async/await 是因为创建应用和启动服务都是异步操作
 */
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    app.enableCors();

    const config = new DocumentBuilder()
      .setTitle('NestJS Backend API')
      .setDescription('从 KoaJS 迁移到 NestJS 的后端 API 文档')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger/docs', app, document);

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log('');
    console.log('========================================');
    console.log('🚀 NestJS 应用启动成功！');
    console.log('========================================');
    console.log(`📡 服务地址: http://localhost:${port}`);
    console.log(`📚 API 文档: http://localhost:${port}/swagger/docs`);
    console.log(
      `🗄️  MySQL: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || 'koajs-sql'}`,
    );
    console.log(
      `💾 Redis: ${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
    );
    console.log('========================================');
    console.log('');
  } catch (error) {
    console.error('');
    console.error('========================================');
    console.error('❌ NestJS 应用启动失败！');
    console.error('========================================');
    console.error('错误信息:', error);
    console.error('========================================');
    console.error('');
    process.exit(1);
  }
}

// 调用启动函数，启动整个应用
// void 操作符表示明确忽略 Promise，这是 NestJS 的标准做法
void bootstrap();
