import type { PaginationParams } from './common.d.ts';

/**
 * 权限数据项
 */
export interface AuthDataList {
    /** 权限ID */
    id: string;
    /** 排序序号 */
    sort: number;
    /** 权限中文名称 */
    name: string;
    /** 权限标识符 */
    permission: string;
    /** 权限类型 */
    type: string;
    /** 权限描述 */
    description: string;
    /** 创建时间 */
    createTime: Date;
    /** 更新时间 */
    updateTime: Date | null;
    /** 删除时间（软删除） */
    deleteTime: Date | null;
}

/**
 * 权限查询参数
 */
export interface AuthQuery extends PaginationParams {
    type?: string;
    name?: string;
    permission?: string;
}

/**
 * 权限列表响应
 */
export interface AuthListResponse {
    list: AuthDataList[];
    total: number;
}