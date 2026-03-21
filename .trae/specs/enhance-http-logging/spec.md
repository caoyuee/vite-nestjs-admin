# 增强 HTTP 日志拦截器 Spec

## Why

当前 HTTP 日志拦截器存在两个问题：

1. **日志级别问题**：`http` 级别日志未被记录到 `combined.log` 文件，因为 Winston 默认日志级别是 `info`，而 `http` 级别低于 `info`
2. **缺少用户信息**：日志中没有记录是哪个用户发起的请求，无法追踪用户行为

## What Changes

- 修复 Winston 日志级别配置，确保 `http` 级别日志被记录
- 在 HTTP 日志拦截器中添加用户信息记录
- 有用户时记录用户名，无用户时用 `-` 代替

## Impact

- Affected specs: 日志记录功能
- Affected code:
  - `nestjs_backend/src/common/services/logger.service.ts`
  - `nestjs_backend/src/common/interceptors/http-logging.interceptor.ts`

## ADDED Requirements

### Requirement: HTTP 级别日志记录

系统 SHALL 正确记录 `http` 级别的日志到 `combined.log` 文件。

#### Scenario: HTTP 日志记录到文件

- **WHEN** 发起 HTTP 请求
- **THEN** 系统将 `http` 级别日志写入 `combined.log` 文件
- **AND** 日志包含 timestamp、level、message 等字段

### Requirement: 用户信息记录

系统 SHALL 在 HTTP 日志中记录用户信息。

#### Scenario: 已登录用户请求

- **WHEN** 已登录用户发起请求
- **THEN** 日志中包含用户 ID 和用户名
- **AND** 格式为 `userId` 和 `username` 字段

#### Scenario: 未登录用户请求

- **WHEN** 未登录用户发起请求
- **THEN** 日志中用户信息字段值为 `-`
- **AND** 格式为 `userId: "-"` 和 `username: "-"`

## MODIFIED Requirements

### Requirement: Winston 日志级别配置

修改 Winston 日志级别配置，确保 `http` 级别日志被记录。

**修改前：**

```typescript
level: process.env.LOG_LEVEL || 'info',
```

**修改后：**

```typescript
level: process.env.LOG_LEVEL || 'http',
```

## REMOVED Requirements

无。
