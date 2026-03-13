import type { ApiResponse } from "../types/common.d.ts";

const Response = <T = any>(
    data: T | null = null,
    message: string = 'success',
    code: number = 200
): ApiResponse<T> => {

    const codes = [
        { code: 200, message: '成功' },
        { code: 201, message: '创建成功' },
        { code: 400, message: '请求错误' },
        { code: 401, message: '未授权' },
        { code: 403, message: '禁止访问' },
        { code: 404, message: '未找到' },
        { code: 500, message: '服务器错误' }
    ];

    return {
        code,
        message: message || codes.find(item => item.code === code)?.message || '未知错误',
        data
    };
};

export default Response;