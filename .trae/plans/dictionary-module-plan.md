# 数据字典管理功能实现计划

## 📋 功能概述

为 NestJS 后端项目补全数据字典管理模块，实现字典的完整 CRUD 功能。

## 🎯 功能需求

### 核心功能
- 字典列表查询（分页、按类型筛选）
- 创建字典项
- 更新字典项
- 删除字典项（软删除）
- 按字典类型获取字典选项（供前端下拉框使用）

### 数据字典用途
- 下拉框选项数据源
- 状态映射显示
- 表格列筛选
- 系统枚举值管理

## 📁 文件结构

```
nestjs_backend/src/modules/dictionary/
├── dto/
│   ├── create-dictionary.dto.ts      # 创建字典 DTO
│   ├── update-dictionary.dto.ts      # 更新字典 DTO
│   └── dictionary-list-query.dto.ts  # 列表查询 DTO
├── dictionary.controller.ts          # 控制器
├── dictionary.service.ts             # 服务
└── dictionary.module.ts              # 模块定义
```

## 📝 实现步骤

### 步骤 1：创建 DTO 文件
- [ ] 创建 `create-dictionary.dto.ts` - 创建字典参数验证
- [ ] 创建 `update-dictionary.dto.ts` - 更新字典参数验证
- [ ] 创建 `dictionary-list-query.dto.ts` - 列表查询参数验证

### 步骤 2：创建 Service 层
- [ ] 创建 `dictionary.service.ts`
  - `getDictionaryList()` - 分页查询字典列表
  - `getDictionaryByType()` - 按类型获取字典选项
  - `createDictionary()` - 创建字典项
  - `updateDictionary()` - 更新字典项
  - `deleteDictionary()` - 删除字典项（软删除）

### 步骤 3：创建 Controller 层
- [ ] 创建 `dictionary.controller.ts`
  - `GET /api/system/dictionary/list` - 获取字典列表
  - `GET /api/system/dictionary/type/:dictType` - 按类型获取字典
  - `POST /api/system/dictionary/add` - 创建字典
  - `PUT /api/system/dictionary/edit` - 更新字典
  - `DELETE /api/system/dictionary/delete/:id` - 删除字典

### 步骤 4：创建 Module 并注册
- [ ] 创建 `dictionary.module.ts`
- [ ] 在 `app.module.ts` 中导入 DictionaryModule

### 步骤 5：验证测试
- [ ] 运行 TypeScript 类型检查
- [ ] 运行 ESLint 检查

## 📊 API 接口设计

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/system/dictionary/list | 分页查询字典列表 |
| GET | /api/system/dictionary/type/:dictType | 按类型获取字典选项 |
| POST | /api/system/dictionary/add | 创建字典项 |
| PUT | /api/system/dictionary/edit | 更新字典项 |
| DELETE | /api/system/dictionary/delete/:id | 删除字典项 |

## 🔗 依赖关系

- 已有实体：`src/entities/dictionary.entity.ts`
- 需要导入：TypeOrmModule、Dictionary 实体
- 认证守卫：JwtAuthGuard（所有接口需要认证）

## 📌 代码规范

遵循项目已有的代码规范：
- 所有代码块添加中文注释
- 使用 JSDoc 格式函数注释
- 响应格式：`{ code, message, data }`
- 软删除使用 `softDelete()`
- 分页参数：pageNum、pageSize
