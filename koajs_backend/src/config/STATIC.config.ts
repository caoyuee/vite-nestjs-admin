import { resolve, join } from "node:path"
import { format } from 'date-fns'
import fs from 'node:fs'
import type { UploadFile } from '../types/Upload.d.ts'
import serve from 'koa-static'

import type Koa from "koa";

const savePath = resolve(import.meta.dirname, '../../', 'resource/upload') // 文件资源存放的路径


// //静态文件访问配置
const staticPath = resolve(import.meta.dirname, '../../')
export const staticConfig = (app: Koa) => {
    console.log(staticPath, 'staticPath');
    app.use(serve(staticPath))
}
// 分类配置接口
const categoryConfigs = [
    {
        folderPath: '/documents',
        allowedTypes: [
            'application/pdf',
            'application/msword',
            'text/plain',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        maxSize: 50,
        keepOriginalName: true
    },
    {
        folderPath: '/images',
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
        maxSize: 10,
        keepOriginalName: false
    },
    {
        folderPath: '/videos',
        allowedTypes: ['video/mp4', 'video/mpeg', 'video/quicktime'],
        maxSize: 500,
        keepOriginalName: false
    },
]
//上传配置
export const uploadConfig = {
    multipart: true,
    formidable: {
        keepExtensions: true,
        maxFieldsSize: 1000 * 1024 * 1024,
        // uploadDir: savePath,
        onFileBegin: (_formName: string, file: UploadFile): void => {
            try {
                // 无论是多文件还是单文件上传都会重复调用此函数
                // 根据文件类型匹配文件夹
                let saveConfig = {
                    folderPath: '/common',
                    maxSize: 100,
                    keepOriginalName: false
                }
                const result = categoryConfigs.filter(item => item.allowedTypes.includes(file.mimetype))
                console.log(result, 'result========');
                if (result && result.length > 0) {
                    saveConfig = result[0]
                }
                //查看文件大小是否符合要求
                // 验证文件大小
                if (file.size && saveConfig.maxSize) {
                    const maxSizeBytes = saveConfig.maxSize * 1024 * 1024;
                    if (file.size > maxSizeBytes) {
                        throw new Error(`文件大小超过限制: ${(file.size / 1024 / 1024).toFixed(2)}MB，最大允许: ${saveConfig.maxSize}MB`);
                    }
                }
                const filenameP = format(new Date(), "yyyyMMddhhmmss");
                const finishPath = join(savePath, saveConfig.folderPath)
                // 检查文件夹是否存在如果不存在则新建文件夹
                if (!fs.existsSync(finishPath)) {
                    fs.mkdirSync(finishPath, { recursive: true });
                }
                // 文件名称去掉特殊字符但保留原始文件名称
                const fileName = file.originalFilename
                    .replaceAll(" ", "_")
                    .replaceAll("resource", "common")
                    .replace(/[`~!@#$%^&*()|\-=?;:'",<>\{\}\\\/]/gi, "_")
                file.originalFilename = filenameP + fileName;
                file.newFilename = filenameP + fileName;
                // 覆盖文件存放的完整路径(保留原始名称)
                file.filepath = join(finishPath, file.newFilename).replace(/\\/g, '/');
            } catch (error) {
                throw new Error(`${error}`);
            }
        },
    }
}