import Router from '@koa/router'
import yamljs from 'yamljs'
import path from 'path'
import { koaSwagger } from 'koa2-swagger-ui'
const swaggerRouter = new Router({
    prefix: "/swagger",
});

// 使用 yamljs 加载 YAML 文件
const swaggerPath = path.join(process.cwd(), "src/config/swagger.yaml");
const spec = yamljs.load(swaggerPath);

// example 1 using router.use()
swaggerRouter.use(koaSwagger({ swaggerOptions: { spec } }));

// example 2 using more explicit .get()
swaggerRouter.get('/docs', koaSwagger({ routePrefix: false, swaggerOptions: { spec } }));

// app.use(swaggerRouter.routes());

export default swaggerRouter;