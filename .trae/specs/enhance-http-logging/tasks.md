# Tasks

- [x] Task 1: 修复 Winston 日志级别配置
  - [x] SubTask 1.1: 将默认日志级别从 `info` 改为 `http`
  - [x] SubTask 1.2: 验证 `http` 级别日志被记录到 `combined.log`
- [x] Task 2: 在 HTTP 日志拦截器中添加用户信息
  - [x] SubTask 2.1: 从 request.user 获取用户信息
  - [x] SubTask 2.2: 有用户时记录 userId 和 username
  - [x] SubTask 2.3: 无用户时用 `-` 代替
- [x] Task 3: 验证日志输出
  - [x] SubTask 3.1: TypeScript 编译通过
  - [x] SubTask 3.2: 代码结构正确

# Task Dependencies

- \[Task 2] depends on \[Task 1]
- \[Task 3] depends on \[Task 1, Task 2]

