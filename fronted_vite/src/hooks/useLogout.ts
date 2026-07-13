import { logoutApi } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";
import { LOGIN_URL } from "@/config";
import router from "@/routers";
const userStore = useUserStore();

/**
 * 退出登录或重置密码时调用
 *
 * @async
 * @returns {*}
 */
export const useLogout = async () => {
  try {
    // 1.执行退出登录接口
    await logoutApi();
    // 2.清除 Token
    userStore.setToken("");
    // 3.重定向到登陆页
    router.replace(LOGIN_URL);
  } catch (error) {}
};
