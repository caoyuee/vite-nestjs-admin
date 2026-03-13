// service/AuthService.ts
import { AuthRepository } from "../config/DB.conf.ts";
import Response from "../config/responseManage.conf.ts";
import type { AuthDataList, AuthQuery } from "../types/Auth.d.ts";
import type { ApiResponse } from "../types/common.d.ts";
export default class AuthService {
    /**
     * 获取权限按钮列表
     *
     * @public
     * @static
     * @async
     * @param {AuthQuery} data 权限查询参数
     * @returns {Promise<ApiResponse<AuthDataList[]>>} 权限列表响应
     */
    public static async getAuthBtns(data: AuthQuery): Promise<ApiResponse<AuthDataList[]>> {
        const { type, pageNum: _pageNum = 1, pageSize: _pageSize = 10 } = data;
        console.log(type, 'type============');

        let result: AuthDataList[];
        if (type) {
            result = await AuthRepository.findBy({ type });
        } else {
            result = await AuthRepository.find();
        }

        // 如果没有数据，返回空数组而不是错误
        if (!result || result.length === 0) {
            return Response([], "未找到权限数据", 200);
        }

        // TODO: 实现分页逻辑
        // 目前先返回所有数据，后续可以添加分页支持
        return Response(result, "查询成功", 200);
    }
}