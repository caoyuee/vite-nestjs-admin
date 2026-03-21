/**
 * 文件上传控制器
 *
 * 【业务说明】
 * 提供文件上传的 API 接口
 * 支持上传图片、头像等文件
 *
 * 【类比前端】
 * 前端使用 FormData 上传文件：
 * ```js
 * const formData = new FormData();
 * formData.append('file', file);
 * const response = await axios.post('/api/upload/images/avatar', formData);
 * console.log(response.data.fileUrl); // 上传后的文件 URL
 * ```
 */

import {
  Controller,
  Post, // 处理 POST 请求
  UseInterceptors, // 使用拦截器
  UploadedFile, // 获取上传的文件
} from '@nestjs/common';
// FileInterceptor 是 Multer 的文件拦截器
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
// 上传配置和工具函数
import { uploadOptions, getLastPathParts } from '../../config/upload.config';
// Public 装饰器表示此接口不需要认证
import { Public } from '../../common/decorators/public.decorator';

/**
 * 文件上传控制器类
 *
 * @ApiTags('文件上传') - Swagger 文档分组
 * @Controller('api/upload') - 路由前缀
 */
@ApiTags('文件上传')
@Controller('api/upload')
export class UploadController {
  /**
   * 上传文件（头像）
   *
   * @Public() - 不需要 JWT 认证
   * @Post('images/avatar') - 路由：POST /api/upload/images/avatar
   *
   * @ApiConsumes('multipart/form-data') - 声明请求内容类型
   * @ApiBody - 定义请求体结构（用于 Swagger 文档）
   *
   * @UseInterceptors(FileInterceptor('file', uploadOptions))
   * - FileInterceptor: 文件拦截器
   * - 'file': 表单字段名，前端上传时需要使用这个字段名
   * - uploadOptions: 上传配置（存储位置、文件大小限制等）
   *
   * @UploadedFile() file - 获取上传的文件对象
   *
   * 【Express.Multer.File 结构】
   * - fieldname: 表单字段名
   * - originalname: 原始文件名
   * - encoding: 文件编码
   * - mimetype: 文件 MIME 类型
   * - size: 文件大小（字节）
   * - destination: 存储目录
   * - filename: 存储文件名
   * - path: 完整存储路径
   */
  @Public()
  @Post('images/avatar')
  @ApiOperation({ summary: '上传文件' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // 二进制文件
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // 检查文件是否上传成功
    if (!file) {
      return {
        code: 500,
        message: '文件上传失败',
        data: null,
      };
    }

    // 获取文件的相对路径（用于返回给前端）
    // getLastPathParts 会提取路径的最后几部分
    const filepath = getLastPathParts(file.path);

    // 返回上传结果
    return {
      code: 200,
      message: '上传成功',
      data: { fileUrl: filepath }, // 前端可以使用这个 URL 访问文件
    };
  }
}
