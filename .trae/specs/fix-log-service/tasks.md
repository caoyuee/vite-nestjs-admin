# Tasks

- [x] Task 1: 重构 LogService.getLogs() 方法
  - [x] SubTask 1.1: 移除按日期目录查找的逻辑
  - [x] SubTask 1.2: 直接读取 combined.log 和 error.log 文件
  - [x] SubTask 1.3: 解析 JSON 格式的日志内容
  - [x] SubTask 1.4: 根据 timestamp 字段进行时间范围筛选
  - [x] SubTask 1.5: 根据 level 字段进行级别筛选
  - [x] SubTask 1.6: 支持关键字搜索

- [x] Task 2: 重构 LogService.clearLogs() 方法
  - [x] SubTask 2.1: 读取 combined.log 和 error.log 文件
  - [x] SubTask 2.2: 根据条件筛选要保留的日志
  - [x] SubTask 2.3: 将保留的日志写回文件
  - [x] SubTask 2.4: 返回清理结果

- [x] Task 3: 验证修复效果
  - [x] SubTask 3.1: TypeScript 编译通过
  - [x] SubTask 3.2: 代码结构正确

# Task Dependencies

- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1, Task 2]
