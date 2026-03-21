/**
 * @file upload.config.ts
 * @description 文件上传配置文件
 *
 * Multer 概念说明：
 * - Multer 是 Node.js 的文件上传中间件
 * - 用于处理 multipart/form-data 类型的表单数据（文件上传）
 * - NestJS 通过 @nestjs/platform-express 集成了 Multer
 *
 * 类比前端：
 * - 类似于 Vue 中的 <input type="file"> 和 FormData
 * - 前端发送 FormData，后端用 Multer 接收
 * - 类似于 Axios 中的文件上传配置
 */

import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { format } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 文件保存根目录
 * process.cwd() 返回当前工作目录
 * 例如：/home/user/project/nestjs_backend
 */
const savePath = path.resolve(process.cwd(), 'resource/upload');

/**
 * 文件分类配置接口
 *
 * @interface CategoryConfig
 * @description 根据文件类型进行分类存储的配置
 */
interface CategoryConfig {
  /** 存储文件夹路径，如 '/images' */
  folderPath: string;

  /** 允许的 MIME 类型列表 */
  allowedTypes: string[];

  /** 最大文件大小（MB） */
  maxSize: number;

  /** 是否保留原始文件名 */
  keepOriginalName: boolean;
}

/**
 * 文件分类配置数组
 *
 * @description
 * 根据文件的 MIME 类型自动分类存储到不同文件夹
 * 这样可以：
 * 1. 方便管理不同类型的文件
 * 2. 对不同类型文件设置不同的大小限制
 * 3. 安全性考虑，防止恶意文件上传
 */
const categoryConfigs: CategoryConfig[] = [
  {
    // 文档类型文件配置
    folderPath: '/documents',
    allowedTypes: [
      'application/pdf', // PDF 文件
      'application/msword', // Word 文档 (.doc)
      'text/plain', // 纯文本文件
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word 文档 (.docx)
    ],
    maxSize: 50, // 最大 50MB
    keepOriginalName: true, // 保留原始文件名
  },
  {
    // 图片类型文件配置
    folderPath: '/images',
    allowedTypes: [
      'image/jpeg', // JPEG 图片
      'image/png', // PNG 图片
      'image/gif', // GIF 图片
      'image/webp', // WebP 图片
      'image/svg+xml', // SVG 矢量图
    ],
    maxSize: 10, // 最大 10MB
    keepOriginalName: false, // 不保留原始文件名（生成新文件名）
  },
  {
    // 视频类型文件配置
    folderPath: '/videos',
    allowedTypes: [
      'video/mp4', // MP4 视频
      'video/mpeg', // MPEG 视频
      'video/quicktime', // MOV 视频
    ],
    maxSize: 500, // 最大 500MB
    keepOriginalName: false,
  },
];

/**
 * Multer 上传配置
 *
 * @description
 * 配置文件上传的存储方式和限制条件
 *
 * @example
 * // 在 Controller 中使用
 * @UseInterceptors(FileInterceptor('file', uploadOptions))
 * uploadFile(@UploadedFile() file: Express.Multer.File) {}
 */
export const uploadOptions: MulterOptions = {
  // storage: 存储配置
  // diskStorage 表示存储到磁盘
  storage: require('multer').diskStorage({
    /**
     * destination: 确定文件存储目录
     *
     * @param req - 请求对象
     * @param file - 上传的文件信息
     * @param cb - 回调函数，用于返回存储路径
     */
    destination: (req, file, cb) => {
      // 默认配置：未知类型文件存储到 common 文件夹
      let saveConfig: CategoryConfig = {
        folderPath: '/common',
        maxSize: 100,
        keepOriginalName: false,
        allowedTypes: [],
      };

      // 根据文件 MIME 类型查找匹配的配置
      const matchedConfig = categoryConfigs.find((config) =>
        config.allowedTypes.includes(file.mimetype),
      );

      // 如果找到匹配的配置，使用该配置
      if (matchedConfig) {
        saveConfig = matchedConfig;
      }

      // 构建完整的存储路径
      const finishPath = path.join(savePath, saveConfig.folderPath);

      // 如果目录不存在，递归创建
      if (!fs.existsSync(finishPath)) {
        fs.mkdirSync(finishPath, { recursive: true });
      }

      // 调用回调，返回存储路径
      cb(null, finishPath);
    },

    /**
     * filename: 确定文件名
     *
     * @param req - 请求对象
     * @param file - 上传的文件信息
     * @param cb - 回调函数，用于返回文件名
     */
    filename: (req, file, cb) => {
      // 生成时间戳前缀，格式：yyyyMMddhhmmss
      const filenameP = format(new Date(), 'yyyyMMddhhmmss');

      // 处理原始文件名
      const fileName = file.originalname
        .replaceAll(' ', '_') // 空格替换为下划线
        .replaceAll('resource', 'common') // 替换敏感词
        .replace(/[`~!@#$%^&*()|\-=?;:'",<>\{\}\\\/]/gi, '_'); // 特殊字符替换

      // 调用回调，返回最终文件名（时间戳 + 处理后的原始文件名）
      cb(null, filenameP + fileName);
    },
  }),

  // limits: 上传限制
  limits: {
    // 最大文件大小（字节）
    // 1000 * 1024 * 1024 = 1GB
    fileSize: 1000 * 1024 * 1024,
  },
};

/**
 * 获取文件路径的最后 N 部分
 *
 * @description
 * 用于从完整文件路径中提取相对路径
 * 方便前端访问上传的文件
 *
 * @param {string} filePath - 完整文件路径
 * @param {number} count - 要获取的路径部分数量，默认 4
 * @returns {string} 截取后的相对路径
 *
 * @example
 * // 输入: '/home/user/project/resource/upload/images/20240101photo.jpg'
 * // 输出: 'resource/upload/images/20240101photo.jpg'
 */
export const getLastPathParts = (
  filePath: string,
  count: number = 4,
): string => {
  // 判断路径分隔符（Windows 用 \，Linux/Mac 用 /）
  const sep = filePath.includes('\\') ? '\\' : '/';

  // 按分隔符拆分路径，并过滤空字符串
  const parts = filePath.split(sep).filter((part) => part.trim() !== '');

  // 如果路径部分数量小于等于要获取的数量，直接返回
  if (parts.length <= count) {
    return parts.join('/');
  }

  // 否则返回最后 N 部分
  return parts.slice(-count).join('/');
};
