# 代码质量检查规则 Spec

## Why
项目需要统一的代码质量检查流程，确保每次代码修改后进行 TypeScript 类型检查，并解决 ESLint 和 Prettier 格式化冲突问题，优先使用 Prettier 进行代码格式化。

## What Changes
- 在项目规则中添加 TypeScript 类型检查要求
- 在项目规则中添加 ESLint 和 Prettier 冲突处理策略
- 明确 Prettier 作为优先格式化工具
- 添加代码修改后的检查流程

## Impact
- Affected specs: `.trae/rules/code-rules.md`
- Affected code: 所有子项目的代码修改流程

## ADDED Requirements

### Requirement: TypeScript 类型检查
系统应当在每次代码修改后执行 TypeScript 类型检查，确保类型安全。

#### Scenario: 代码修改后类型检查
- **WHEN** 开发者完成代码修改
- **THEN** 必须运行 `tsc --noEmit` 或项目配置的类型检查命令
- **AND** 确保无类型错误后方可提交

### Requirement: 格式化工具优先级
系统应当明确 Prettier 作为优先的代码格式化工具。

#### Scenario: ESLint 与 Prettier 冲突处理
- **WHEN** ESLint 和 Prettier 格式化规则产生冲突
- **THEN** 优先使用 Prettier 的格式化结果
- **AND** 禁用 ESLint 中与 Prettier 冲突的格式化规则

### Requirement: 代码修改后检查流程
系统应当在每次代码修改后执行完整的质量检查流程。

#### Scenario: 完整检查流程
- **WHEN** 代码修改完成
- **THEN** 按顺序执行以下检查：
  1. Prettier 格式化
  2. TypeScript 类型检查
  3. ESLint 检查（仅检查非格式化相关规则）

## MODIFIED Requirements
无修改的需求

## REMOVED Requirements
无移除的需求
