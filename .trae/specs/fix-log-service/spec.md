# 修复日志获取服务 Spec

## Why

当前的日志获取服务 (`LogService`) 假设日志文件按日期目录存储（如 `logs/2026-03-21/app.log.2026-03-21`），但实际的 Winston 日志配置只生成两个文件：`logs/combined.log` 和 `logs/error.log`。这导致前端无法获取到任何日志数据。

## What Changes

- 重构 `LogService.getLogs()` 方法，直接读取 `combined.log` 和 `error.log` 文件
- 根据日志内容中的 `timestamp` 字段进行时间范围筛选
- 根据日志内容中的 `level` 字段进行级别筛选
- 重构 `LogService.clearLogs()` 方法，支持清理 `combined.log` 和 `error.log` 文件中的特定日志

## Impact

- Affected specs: 日志查询和清理功能
- Affected code:
  - `nestjs_backend/src/modules/log/log.service.ts`
  - `nestjs_backend/src/common/services/logger.service.ts` (日志格式)

## ADDED Requirements

### Requirement: 日志文件读取

系统 SHALL 直接读取 `logs/combined.log` 和 `logs/error.log` 文件，而不是按日期目录查找。

#### Scenario: 读取所有日志
- **WHEN** 前端请求日志列表
- **THEN** 系统读取 `combined.log` 和 `error.log` 文件
- **AND** 解析每行 JSON 格式的日志
- **AND** 返回日志列表

#### Scenario: 按时间范围筛选
- **WHEN** 前端请求指定时间范围的日志
- **THEN** 系统根据日志内容中的 `timestamp` 字段进行筛选
- **AND** 只返回时间范围内的日志

#### Scenario: 按级别筛选
- **WHEN** 前端请求指定级别的日志
- **THEN** 系统根据日志内容中的 `level` 字段进行筛选
- **AND** 只返回匹配级别的日志

### Requirement: 日志清理

系统 SHALL 支持清理 `combined.log` 和 `error.log` 文件中的特定日志。

#### Scenario: 按条件清理日志
- **WHEN** 前端请求清理日志
- **THEN** 系统读取日志文件
- **AND** 根据条件筛选要删除的日志
- **AND** 将保留的日志写回文件

## MODIFIED Requirements

### Requirement: 日志查询接口

原有的按日期目录查询方式已废弃，改为直接读取固定日志文件。

## REMOVED Requirements

### Requirement: 按日期目录查找日志文件

**Reason**: Winston 配置未按日期分割日志，所有日志存储在 `combined.log` 和 `error.log` 中。

**Migration**: 使用日志内容中的 `timestamp` 字段进行时间筛选。
