/**
 * @file index.ts
 * @description 实体文件统一导出入口
 *
 * 模块导出概念说明：
 * - 使用 index.ts 统一导出所有实体
 * - 方便其他文件一次性导入所有实体
 * - 类似于前端的组件库入口文件
 *
 * 类比前端：
 * - 类似于 Vue 项目中 components/index.ts
 * - 类似于 export * from './Button.vue'
 * - 类似于组件库的入口文件
 *
 * 使用方式：
 * // 不使用 index.ts 时
 * import { User } from './entities/user.entity';
 * import { Menu } from './entities/menu.entity';
 *
 * // 使用 index.ts 后
 * import { User, Menu, Role } from './entities';
 */

export * from './user.entity';
export * from './menu.entity';
export * from './role.entity';
export * from './auth.entity';
export * from './dictionary.entity';
export * from './personnel.entity';
