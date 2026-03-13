import "reflect-metadata";
import Koa from "koa";
import dotenv from "dotenv";
import { AppDataSource } from "./config/DB.conf.ts";
import registerLogger from "./middleware/logger.js";
import { JWT } from "./config/JWT.conf.ts";
import redis from "./config/REDIS.conf.ts";
import registerRoutes from "./routes/index.ts";
import { staticConfig } from './config/STATIC.config.ts'
import { errorHandler } from "./middleware/errorHandler.ts";
//加载环境变量
dotenv.config({ path: ".env" });

// 应用入口：创建 Koa 实例并注册中间件
const app = new Koa();

//连接数据库
AppDataSource.initialize()
  .then(() => {
    console.log("数据库连接成功！");
  })
  .catch((error) => {
    console.error("数据库连接失败：", error);
  });

//连接 Redis
// 错误处理
redis.on("error", (err) => {
  console.error("Redis error:", err);
});
// 连接成功
redis.on("ready", () => {
  console.log("Redis连接成功！");
});

/**
 * 中间件注册顺序说明（从上到下依次执行）：
 * 1. swagger-ui: 静态资源中间件应最先注册，以确保 Swagger 文档可用。
 * 2. logger: 日志中间件应放在路由之前，以确保所有请求都被记录。
 * 3. error-handler: 错误处理中间件，捕获所有未处理的异常
 * 4. 访问静态资源
 * 5. JWT: 鉴权中间件应放在路由之前，以保护需要鉴权的接口。
 * 6. routes: 路由中间件应放在上面中间件之后，以确保路由处理被包裹并记录耗时与日志。
 */


// 1）开启 swagger 静态服务

// 2) 注册日志中间件 - 放在路由之前
app.use(registerLogger);
// 3) 注册错误处理中间件 - 捕获所有未处理的异常
app.use(errorHandler());
// 4) 访问静态资源
staticConfig(app)
// 5) 注册 JWT 验证中间件 - 放在路由之前
app.use(JWT);
// 6) 注册路由 - 放在耗时与日志中间件之后
registerRoutes(app);
// 使用环境变量 PORT（默认为 3000），并在启动时打印地址
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`服务已启动： http://localhost:${PORT}`);
});
