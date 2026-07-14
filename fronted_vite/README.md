# Vite Admin Frontend

`fronted_vite` 是本仓库的 Vue 3 管理后台前端，配套后端为 `../backend_nestjs`。项目来源于 Geeker-Admin 风格模板，但已经接入本仓库的 NestJS API、接口契约、构建检查和本地资源。

## 技术栈

- Vue 3.5 + `<script setup lang="ts">`
- TypeScript 6
- rolldown-vite 7 / Vite API
- Vue Router 5
- Pinia 3 + pinia-plugin-persistedstate
- Element Plus 2
- Axios
- ECharts 6 + 自定义水球图补丁
- Leaflet / GeoTIFF / GeoRaster
- Three.js / GLTFLoader / OrbitControls
- WangEditor
- SCSS、ESLint、Prettier

## 环境要求

- Node.js 18+
- pnpm 10.20.0+
- 后端服务：`http://127.0.0.1:3000`

本项目统一使用 `pnpm`，不要使用 `npm` 或 `yarn`。

## 安装

```bash
cd fronted_vite
pnpm install
```

项目使用 pnpm patch 修复了部分三方库兼容问题，安装依赖时会自动应用：

- `@echarts-x/custom-liquid-fill@1.0.2`
- `element-plus@2.14.3`

## 本地开发

先启动后端，再启动前端：

```bash
cd ../backend_nestjs
pnpm start:dev

cd ../fronted_vite
pnpm dev
```

前端默认端口来自 `.env`：

```text
VITE_PORT=8848
```

开发环境接口代理来自 `.env.development`：

```text
VITE_API_URL=/api
VITE_PROXY=[["/api","http://127.0.0.1:3000/api"],["/resource","http://127.0.0.1:3000/resource"]]
```

因此前端页面默认访问：

- 前端页面：`http://localhost:8848`
- API 代理：`/api -> http://127.0.0.1:3000/api`
- 静态资源代理：`/resource -> http://127.0.0.1:3000/resource`

`pnpm dev` 会先执行 `pnpm check`，也就是 TypeScript 与 ESLint 检查通过后才启动 Vite。

## 常用命令

```bash
pnpm check         # vue-tsc + ESLint 检查
pnpm lint          # ESLint 自动修复
pnpm format        # Prettier 格式化
pnpm format:check  # 检查格式
pnpm dev           # 检查并启动开发服务
pnpm build         # 检查并构建生产产物
pnpm preview       # 预览 dist 产物
```

## 环境变量

| 文件 | 用途 |
| --- | --- |
| `.env` | 应用标题、端口、是否自动打开浏览器、devtools、包分析等通用配置 |
| `.env.development` | 本地开发接口地址、代理和路由模式 |
| `.env.test` | 测试构建配置 |
| `.env.production` | 生产构建配置 |

生产部署前请根据真实后端地址调整 `.env.production` 的 `VITE_API_URL`，不要直接沿用模板 Mock 地址。

## 目录结构

```text
fronted_vite/
├── build/                  # Vite 环境变量、代理和插件辅助配置
├── patches/                # pnpm patch 文件
├── public/                 # 不参与打包的静态资源
├── src/
│   ├── api/                # Axios 实例、接口模块和接口类型
│   ├── assets/             # 图片、字体、图标、WebGL 资源、示例 JSON
│   ├── components/         # 公共组件，如 ProTable、ECharts、Upload、TreeFilter
│   ├── config/             # 前端全局配置
│   ├── directives/         # 权限、复制、水印、拖拽、节流、防抖等指令
│   ├── enums/              # 枚举常量
│   ├── hooks/              # 业务 hooks
│   ├── languages/          # i18n 语言包
│   ├── layouts/            # 后台布局、菜单、标签页、头部组件
│   ├── routers/            # 静态路由、动态路由和守卫
│   ├── stores/             # Pinia store
│   ├── styles/             # 全局样式和主题
│   ├── typings/            # 全局类型声明
│   ├── utils/              # 工具函数
│   └── views/              # 页面视图
├── vite.config.ts          # Vite 配置
└── package.json            # 脚本和依赖
```

## 主要页面能力

- 登录、首页、权限页和系统管理页面
- 用户、角色、菜单、字典、日志等后台管理页面
- ProTable 示例：基础表格、复杂表格、树形表格、筛选表格、批量导入导出
- 表单示例、上传示例、富文本示例、常用指令示例
- 数据大屏、ECharts 图表、Leaflet/GeoTIFF 地图、Three.js/WebGL 模型页面

## 接口约定

前端 API 封装位于 `src/api/modules/`，接口类型位于 `src/api/interface/`。新增或调整接口时，必须同步检查后端 `backend_nestjs/src/modules/` 下的 Controller、DTO 和返回值。

后端 JSON 响应统一格式：

```ts
{
  code: number;
  message: string;
  data: T | null;
}
```

分页数据统一放在 `data` 中：

```ts
{
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}
```

更完整的接口契约请看根目录 `docs/API_CONTRACT_RULES.md`。

## 构建与部署

```bash
pnpm build
```

构建产物输出到 `dist/`。如果使用根目录 `docker-compose.yml`，前端容器会从 `fronted_vite/Dockerfile` 构建，并通过 `8080:80` 暴露。
