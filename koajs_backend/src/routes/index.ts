import apiRouter from "./api_router.ts";
import staticRouter from "./static_router.ts";
import swaggerRouter from "./swagger_router.ts";
import type Koa from "koa";
const registerRoutes = (app: Koa<Koa.DefaultState, Koa.DefaultContext>) => {
  app.use(staticRouter.routes());
  app.use(apiRouter.routes());
  app.use(swaggerRouter.routes());
  app.use(apiRouter.allowedMethods());
};
export default registerRoutes;
