import AuthService from "../service/AuthService.ts";
import type { RouterContext } from "@koa/router";
import type { AuthQuery } from "../types/Auth.d.ts";
export default class AuthController {
    /**
 * 获取权限按钮列表
 *
 * @public
 * @static
 * @async
 * @param {RouterContext} ctx
 * @returns {Promise<void>}
 */
    public static async getAuthBtns(ctx: RouterContext): Promise<void> {
        const data = ctx.request.query as unknown as AuthQuery;
        const result = await AuthService.getAuthBtns(data);
        ctx.body = result;
    }
}