# TreeFilter 组件数据结构兼容 - 验证清单

- [x] 检查 dataPath 参数是否已添加到 TreeFilterProps 接口中
- [x] 检查 dataPath 参数默认值是否为空字符串
- [x] 检查默认行为（dataPath 为空）是否正常工作
- [x] 检查 dataPath="list" 时是否能正确提取 data.list
- [x] 检查多级路径（如 "data.list"）是否能正确提取数据
- [x] 检查现有代码是否受影响（向后兼容性）
- [x] 检查组件在各种数据结构下是否能正常渲染树
- [x] 检查路径不存在时的错误处理是否合理
