# 字典管理页面实现计划

## 一、需求分析

### 1.1 后端接口（来自 dictionary.service.ts）
- `GET /api/system/dictionary/list` - 获取字典列表（分页，支持 dictType 和 name 筛选）
- `GET /api/system/dictionary/type/:dictType` - 按类型获取字典选项
- `POST /api/system/dictionary/add` - 创建字典项
- `PUT /api/system/dictionary/edit` - 编辑字典项
- `DELETE /api/system/dictionary/delete/:id` - 删除字典项（软删除）

### 1.2 字典实体字段
| 字段 | 说明 | 示例 |
|------|------|------|
| id | 字典ID（主键） | 1 |
| sort | 排序序号 | 0 |
| name | 字典项名称 | 启用 |
| dictType | 字典类型 | user_status |
| label | 显示标签 | 启用 |
| value | 实际值 | 1 |
| tag | 标签类型 | success |
| createTime | 创建时间 | 2024-01-01 |
| updateTime | 更新时间 | 2024-01-02 |

### 1.3 参考页面
- 参考 `fronted_vite/src/views/system/roleManage/index.vue` 的代码结构
- 使用现有的 `ProTable` 组件
- 使用已有的 Drawer 组件模式

## 二、实现任务

### 2.1 API 接口定义
**文件**: `fronted_vite/src/api/modules/system.ts`
- 添加 `getDictionaryList` - 获取字典列表
- 添加 `addDictionary` - 创建字典项
- 添加 `editDictionary` - 编辑字典项
- 添加 `delDictionary` - 删除字典项
- 添加 `getDictionaryByType` - 按类型获取字典选项

### 2.2 类型定义
**文件**: `fronted_vite/src/api/interface/index.ts`
- 添加 `Dictionary` 命名空间，包含：
  - `BaseDictionary` - 基础字典类型
  - `QueryDictionary` - 查询参数
  - `CreateDictionary` - 创建参数
  - `UpdateDictionary` - 更新参数
  - `DictionaryItem` - 字典项类型

### 2.3 Drawer 组件
**文件**: `fronted_vite/src/views/system/dictManage/components/DictDrawer.vue`
- 复用 RoleDrawer.vue 的组件模式
- 表单字段：
  - 字典项名称（name）- 必填
  - 字典类型（dictType）- 必填
  - 显示标签（label）- 必填
  - 实际值（value）- 必填
  - 标签类型（tag）- 必填
  - 排序（sort）- 可选
- 支持新增、编辑、查看三种模式

### 2.4 页面组件
**文件**: `fronted_vite/src/views/system/dictManage/index.vue`
- 使用 ProTable 组件展示数据
- 表格列配置：
  - ID
  - 排序
  - 字典项名称（支持搜索）
  - 字典类型（支持搜索）
  - 显示标签
  - 实际值
  - 标签类型（使用 Tag 显示）
  - 创建时间
  - 操作（编辑、删除）
- 操作按钮：新增按钮
- 操作列：编辑、删除按钮

## 三、实现步骤

1. **添加字典相关类型定义** - 在 `api/interface/index.ts` 中添加 Dictionary 命名空间
2. **添加 API 接口方法** - 在 `api/modules/system.ts` 中添加字典相关接口
3. **创建 Drawer 组件** - 创建 `dictManage/components/DictDrawer.vue`
4. **完善页面组件** - 重写 `dictManage/index.vue`，实现完整的字典管理功能
5. **测试验证** - 确保页面正常运行

## 四、注意事项

- tag 字段可选值：success, warning, danger, info（对应 Element Plus Tag 类型）
- 遵循项目现有的代码风格和命名规范
- 使用 `useHandleData` hook 处理删除确认
- 保持与其他管理页面（如角色管理）的一致性
