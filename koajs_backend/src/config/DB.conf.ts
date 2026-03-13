import "reflect-metadata";
import { User } from "../entity/User.ts";
import { Menu } from "../entity/Menu.ts";
import { Role } from "../entity/Role.ts";
import { Auth } from "../entity/Auth.ts";
import { Dictionary } from "../entity/Dictionary.ts";
import { Personnel } from "../entity/Personnel.ts";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

// //加载环境变量
dotenv.config({ path: ".env" });
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost", // 数据库主机地址
  port: Number(process.env.DB_PORT) || 3306, // 数据库端口
  username: process.env.DB_USER || "root", // 数据库用户名
  password: process.env.DB_PASSWORD || "asdzxc123.", // 数据库密码
  database: process.env.DB_NAME || "koajs-sql", // 数据库名称
  synchronize: true,
  logging: false,
  entities: [User, Menu, Role, Auth, Dictionary, Personnel],
  migrations: [],
  subscribers: [],
});

export const UserRepository = AppDataSource.getRepository(User);
export const MenuRepository = AppDataSource.getRepository(Menu);
export const RoleRepository = AppDataSource.getRepository(Role);
export const AuthRepository = AppDataSource.getRepository(Auth);
export const DictionaryRepository = AppDataSource.getRepository(Dictionary);
export const PersonnelRepository = AppDataSource.getRepository(Personnel);
