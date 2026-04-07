# TreeFilter 组件数据结构兼容 - 实现计划

## [x] Task 1: 新增 dataPath 参数
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 在 TreeFilterProps 接口中添加 dataPath 参数
  - 设置默认值为空字符串，保持向后兼容
- **Acceptance Criteria Addressed**: AC-1, AC-4
- **Test Requirements**:
  - `human-judgement` TR-1.1: 确认 dataPath 参数已添加到接口定义中
  - `human-judgement` TR-1.2: 确认 dataPath 参数默认为空字符串
- **Notes**: 保持接口定义清晰，添加适当的注释说明

## [x] Task 2: 实现数据路径解析逻辑
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 在 onBeforeMount 中实现数据路径解析逻辑
  - 当 dataPath 为空时，使用默认行为（treeData.value = data）
  - 当 dataPath 不为空时，根据路径提取数据
- **Acceptance Criteria Addressed**: AC-2, AC-3
- **Test Requirements**:
  - `human-judgement` TR-2.1: 确认默认行为（dataPath 为空）正常工作
  - `human-judgement` TR-2.2: 确认 dataPath="list" 时能正确提取 data.list
  - `human-judgement` TR-2.3: 确认多级路径（如 "data.list"）能正确提取数据
- **Notes**: 实现安全的路径解析，处理路径不存在的情况

## [x] Task 3: 测试和验证
- **Priority**: P1
- **Depends On**: Task 2
- **Description**: 
  - 测试不同数据结构的 API 响应
  - 确保组件在各种情况下都能正常工作
  - 验证向后兼容性
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4
- **Test Requirements**:
  - `human-judgement` TR-3.1: 测试默认行为（API 返回 {data: [...]}）
  - `human-judgement` TR-3.2: 测试 dataPath="list"（API 返回 {data: {list: [...]}}）
  - `human-judgement` TR-3.3: 测试多级路径（API 返回 {data: {data: {list: [...]}}}）
  - `human-judgement` TR-3.4: 测试现有代码是否受影响
- **Notes**: 确保测试覆盖所有使用场景
