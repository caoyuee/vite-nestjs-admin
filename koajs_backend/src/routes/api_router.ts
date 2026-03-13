import Router from "@koa/router";
import UserController from "../controllers/user.ts";
import MenuController from "../controllers/menu.ts";
import RoleController from "../controllers/role.ts";
import AuthController from "../controllers/auth.ts";
import { koaBody } from "koa-body";

const apiRouter = new Router({
  prefix: "/api/system",
});
apiRouter.use(koaBody());
/**
 * 获取用户信息
 * 
 */
apiRouter.get("/user/userInfo", UserController.userInfo);

/**
 * 创建新用户.
 * 
 */
apiRouter.post("/user/addUser", UserController.addNewUser);
/**
 * 编辑用户
 */
apiRouter.put("/user/editUser", UserController.editUserInfo);

/**
 * 重置密码
 */
apiRouter.put("/user/ResetPwd", UserController.resetPassword);
/**
 * 删除用户
 */
apiRouter.delete("/user/deleteUser/:id", UserController.deleteUser);

/**
 * 
 * 获取用户列表.
 *        
 */
apiRouter.get("/user/userList", UserController.getUserList);
/**
 * 
 * 创建新用户.
 *
 */
apiRouter.post("/user/login", UserController.userLogin);
/**
 * 退出登录
 */
apiRouter.post("/user/logout", UserController.userLogout);

/**
 * 获取日志
 */
apiRouter.get("/user/logs", UserController.getLogs);

/**
 * 清空日志
 */
apiRouter.delete("/user/logs", UserController.clearLogs);

/**
 * 新增菜单
 */
apiRouter.post("/user/addMenu", MenuController.addMenu);
/**
 * 编辑菜单
 */
apiRouter.put("/user/editMenu", MenuController.editMenu);
/**
 * 删除菜单
 */
apiRouter.delete("/user/deleteMenu/:id", MenuController.deleteMenu);
/**
 * 获取用户菜单
 */
apiRouter.get("/user/menuList", MenuController.getMenus);

/**
 * 获取所有菜单
 */
apiRouter.get("/user/allMenuList", MenuController.getAllMenus);
/**
 * 新增角色
 */
apiRouter.post("/user/addRole", RoleController.addRole);

/**
 * 查询角色列表
 */
apiRouter.get("/user/getRoleList", RoleController.getRoleList);

/**
 * 获取角色授权信息
 */
apiRouter.get("/user/getRoleInfo", RoleController.getRoleInfo);

/**
 * 删除角色
 */
apiRouter.delete("/user/deleteRole", RoleController.deleteRole);

/**
 * 查询按钮权限列表
 */
apiRouter.get("/user/getAuthBtns", AuthController.getAuthBtns);

/**
 * 角色授权
 *
 */

apiRouter.post("/user/putRolePermission", RoleController.setRolePermission);
export default apiRouter;
