
/**
 * 文件上传响应
 */
export interface ResponseFile {
    /** 文件访问URL */
    fileUrl: string;
}

/**
 * 上传文件信息
 */
export interface UploadFile {
    /** 原始文件名 */
    originalFilename: string;
    /** 新文件名 */
    newFilename: string;
    /** 文件存储路径 */
    filepath: string;
    /** 文件MIME类型 */
    mimetype: string;
    /** 文件大小（字节） */
    size: number;
}