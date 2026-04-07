# TreeFilter 组件数据结构兼容 - 产品需求文档

## Overview
- **Summary**: 为 TreeFilter 组件新增一个配置参数，使其能够兼容不同 API 返回的数据结构，既支持直接返回数组的 API，也支持返回 `{data: [...]} 或 {data: {list: [...]}}` 结构的 API。
- **Purpose**: 解决不同 API 接口返回数据结构不一致的问题，提高 TreeFilter 组件的通用性和复用性。
- **Target Users**: 前端开发人员使用 TreeFilter 组件时，无需关心 API 返回的数据结构格式。

## Goals
- 新增 `dataPath` 参数，用于指定数据在 API 响应中的路径
- 保持向后兼容，默认行为不变（`treeData.value = data`）
- 支持多种数据结构：直接数组、`data` 字段、`data.list` 字段
- 确保组件在各种数据结构下都能正常工作

## Non-Goals (Out of Scope)
- 不修改组件的其他功能和行为
- 不影响现有的 `data` 属性和 `requestApi` 功能
- 不处理嵌套层级超过两层的复杂数据结构

## Background & Context
- 目前 TreeFilter 组件假设 API 返回的数据结构为 `{data: [...]}`，直接将 `data` 赋值给 `treeData.value`
- 但实际项目中，不同 API 可能返回不同的数据结构：
  - 有的返回 `{data: [...]}`（直接数组）
  - 有的返回 `{data: {list: [...]}}`（数组在 list 字段中）
- 这导致组件在使用不同 API 时需要额外的适配代码

## Functional Requirements
- **FR-1**: 新增 `dataPath` 配置参数，用于指定数据在 API 响应中的路径
- **FR-2**: 当 `dataPath` 为空或未传时，保持默认行为（使用 `data` 字段）
- **FR-3**: 当 `dataPath` 为 "list" 时，使用 `data.list` 字段作为数据源
- **FR-4**: 当 `dataPath` 为其他值时，支持多级路径访问（如 "data.list"）

## Non-Functional Requirements
- **NFR-1**: 向后兼容，不破坏现有代码
- **NFR-2**: 代码实现简洁清晰，易于维护
- **NFR-3**: 支持常见的数据结构格式，覆盖大多数 API 响应场景

## Constraints
- **Technical**: 仅修改 TreeFilter 组件内部逻辑，不影响其他组件
- **Dependencies**: 依赖 Vue 3 Composition API 和 Element Plus Tree 组件

## Assumptions
- API 响应格式为标准的 `{data: any}` 结构
- 数据最终需要是数组格式，用于渲染树结构
- 用户知道 API 返回的数据结构，能够正确配置 `dataPath`

## Acceptance Criteria

### AC-1: 默认行为保持不变
- **Given**: 未设置 `dataPath` 参数
- **When**: API 返回 `{data: [item1, item2]}` 结构
- **Then**: 组件正常渲染树结构，使用 `data` 字段作为数据源
- **Verification**: `human-judgment`

### AC-2: 支持 data.list 结构
- **Given**: 设置 `dataPath="list"`
- **When**: API 返回 `{data: {list: [item1, item2]}}` 结构
- **Then**: 组件正常渲染树结构，使用 `data.list` 字段作为数据源
- **Verification**: `human-judgment`

### AC-3: 支持多级路径
- **Given**: 设置 `dataPath="data.list"`
- **When**: API 返回 `{data: {data: {list: [item1, item2]}}}` 结构
- **Then**: 组件正常渲染树结构，使用 `data.data.list` 字段作为数据源
- **Verification**: `human-judgment`

### AC-4: 向后兼容性
- **Given**: 现有代码使用 TreeFilter 组件
- **When**: 升级组件后
- **Then**: 现有功能保持不变，无需修改代码
- **Verification**: `human-judgment`

## Open Questions
- [ ] 是否需要支持更复杂的嵌套路径？（如 "data.result.list"）
- [ ] 是否需要处理 API 响应中数据不存在的情况？（如 `dataPath` 指定的路径不存在时的错误处理）
