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
  // 创建 NestJS 应用实例
  // NestFactory.create() 类似于 Vue 的 createApp(App)
  const app = await NestFactory.create(AppModule);

  // 配置全局验证管道
  // ValidationPipe 会自动验证所有传入的 DTO（数据传输对象）
  // 类似于前端表单验证，但是在后端自动执行
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true - 自动移除请求体中未在 DTO 中定义的属性
      // 防止恶意用户传入额外的字段
      whitelist: true,
      // transform: true - 自动将请求体转换为 DTO 类实例
      // 类似于前端的类型转换，把普通对象变成类实例
      transform: true,
      transformOptions: {
        // enableImplicitConversion: true - 启用隐式类型转换
        // 例如：字符串 '123' 自动转换为数字 123
        enableImplicitConversion: true,
      },
    }),
  );

  // 启用 CORS（跨域资源共享）
  // 允许前端应用从不同域名访问后端 API
  // 类似于 Vite 的 server.cors 配置
  app.enableCors();

  // 配置 Swagger API 文档
  // Swagger 会自动扫描所有 Controller 和 DTO，生成 API 文档
  // 访问地址：http://localhost:3000/swagger/docs
  const config = new DocumentBuilder()
    .setTitle('NestJS Backend API') // API 文档标题
    .setDescription('从 KoaJS 迁移到 NestJS 的后端 API 文档') // API 文档描述
    .setVersion('1.0') // API 版本
    .addBearerAuth() // 添加 JWT 认证支持（文档中会显示 Authorize 按钮）
    .build();

  // 创建 Swagger 文档实例
  const document = SwaggerModule.createDocument(app, config);

  // 设置 Swagger UI 的访问路径
  // 第一个参数是访问路径，第二个参数是应用实例，第三个参数是文档配置
  SwaggerModule.setup('swagger/docs', app, document);

  // 从环境变量获取端口号，默认 3000
  const port = process.env.PORT || 3000;

  // 启动应用，监听指定端口
  // 类似于 Vue 项目的 app.listen(3000)
  await app.listen(port);

  // 控制台输出启动信息
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/swagger/docs`);
}

// 调用启动函数，启动整个应用
bootstrap();
