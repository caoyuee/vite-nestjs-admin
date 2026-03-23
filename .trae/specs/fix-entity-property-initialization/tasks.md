# 修复 Entity 属性初始化报错 - 任务清单

## 任务列表

### Task 1: 修改 tsconfig.json 配置
- [ ] 打开 `backend_nestjs/tsconfig.json` 文件
- [ ] 在 `compilerOptions` 对象中添加 `"strictPropertyInitialization": false`
- [ ] 保存文件

### Task 2: 验证修复效果
- [ ] 运行 `cd backend_nestjs && pnpm run build` 验证编译是否通过
- [ ] 检查 Entity 文件是否还有 TypeScript 报错
- [ ] 确认应用可以正常启动

### Task 3: 检查所有 Entity 文件
- [ ] 遍历 `backend_nestjs/src/entities/` 目录
- [ ] 确认所有 Entity 文件不再报错
- [ ] 验证 Entity 类的装饰器配置正确

## 任务依赖关系

```
Task 1 → Task 2 → Task 3
```

## 预期结果

- TypeScript 编译不再报错
- Entity 类可以正常使用
- 应用可以正常启动和运行
