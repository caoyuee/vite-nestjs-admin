# 代码注释规范 Spec

## Why
项目需要统一的代码注释规范，确保所有代码块都添加中文注释，提高代码可读性和团队协作效率。

## What Changes
- 在项目规则中添加代码注释要求
- 明确所有代码块必须添加中文注释
- 规定注释的具体格式和位置

## Impact
- Affected specs: `.trae/rules/code-rules.md`
- Affected code: 所有子项目的代码文件

## ADDED Requirements

### Requirement: 代码块中文注释
系统应当要求所有代码块添加中文注释，包括函数、类、方法、变量声明等。

#### Scenario: 函数注释
- **WHEN** 定义函数或方法
- **THEN** 必须在函数上方添加中文注释说明功能
- **AND** 注释应包含功能描述、参数说明、返回值说明

#### Scenario: 代码块注释
- **WHEN** 编写代码块（如 if/else、for 循环、switch 等）
- **THEN** 应在代码块上方或行尾添加中文注释说明逻辑

#### Scenario: 变量和常量注释
- **WHEN** 定义重要变量或常量
- **THEN** 应添加中文注释说明用途

## MODIFIED Requirements
无修改的需求

## REMOVED Requirements
无移除的需求
