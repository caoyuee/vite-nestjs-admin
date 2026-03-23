/**
 * 文件上传模块定义
 *
 * 【业务说明】
 * 文件上传模块提供文件上传功能
 * 使用 Multer 中间件处理 multipart/form-data 请求
 *
 * 【类比前端】
 * 类似于前端的文件上传组件：
 * - 使用 FormData 构建上传数据
 * - 发送 multipart/form-data 请求
 * - 接收上传后的文件 URL
 *
 * 【Multer 说明】
 * Multer 是 Node.js 的文件上传中间件
 * 用于处理 multipart/form-data 类型的表单数据
 * 主要用于上传文件
 */

import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';

/**
 * 文件上传模块类
 *
 * 注意：文件上传模块不需要数据库
 * 文件直接存储在文件系统中
 */
@Module({
  controllers: [UploadController],
})
export class UploadModule {}
