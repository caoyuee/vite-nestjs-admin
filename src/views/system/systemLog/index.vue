<template>
  <div class="table-box">
    <!-- 表格 -->
    <ProTable ref="proTable" title="系统日志" :columns="columns" :request-api="getTableList" :pagination="true"
      search-el="searchCol" :searchCol="searchCol">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="danger" icon="Delete" plain @click="handleClearLogs">
          清空日志
        </el-button>
        <el-button type="primary" icon="Refresh" plain @click="handleRefresh">
          刷新
        </el-button>
      </template>

      <!-- 日志级别 -->
      <template #level="scope">
        <el-tag :type="getLevelType(scope.row.level)" effect="dark">
          {{ getLevelText(scope.row.level) }}
        </el-tag>
      </template>

      <!-- 消息内容 -->
      <template #message="scope">
        <el-tooltip :content="scope.row.message" placement="top" :show-after="500">
          <span class="log-message">{{ scope.row.message }}</span>
        </el-tooltip>
      </template>

      <!-- 请求信息 -->
      <template #requestInfo="scope">
        <span v-if="scope.row.method || scope.row.url">
          <el-tag size="small" :type="getMethodType(scope.row.method)">
            {{ scope.row.method || '-' }}
          </el-tag>
          <span class="url-text"> {{ scope.row.url || '-' }}</span>
        </span>
        <span v-else>-</span>
      </template>

      <!-- 状态码 -->
      <template #status="scope">
        <el-tag v-if="scope.row.status" :type="scope.row.status >= 400 ? 'danger' : 'success'" size="small">
          {{ scope.row.status }}
        </el-tag>
        <span v-else>-</span>
      </template>

      <!-- 请求耗时 -->
      <template #duration="scope">
        <span v-if="scope.row.duration" :class="{ 'duration-warning': scope.row.duration > 1000 }">
          {{ scope.row.duration }}ms
        </span>
        <span v-else>-</span>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts" name="systemLog">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Refresh, Delete } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import type { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getSystemLogs, clearSystemLogs } from "@/api/modules/system";
import type { System } from "@/api/interface/index";

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 搜索列配置
const searchCol = reactive({
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5
});

/**
 * 获取表格数据
 * @param params 请求参数
 */
const getTableList = (params: any) => {
  // 处理日期范围参数（ProTable使用timestamp作为参数名）
  const newParams = { ...params };
  // 兼容 timestamp 和 time 两种参数名
  const timeParam = newParams.timestamp || newParams.time;
  if (timeParam && Array.isArray(timeParam)) {
    // 转换为后端需要的日期格式（yyyy-MM-dd）
    const [startTime, endTime] = timeParam;
    newParams.startTime = startTime;
    newParams.endTime = endTime;
  }
  // 删除不需要的参数
  delete newParams.timestamp;
  delete newParams.time;

  return getSystemLogs(newParams as System.LogParams);
};

// 日志级别对应的 Tag 类型映射
const levelTypeMap: Record<string, "danger" | "warning" | "info" | "success"> = {
  error: "danger",
  warn: "warning",
  http: "info",
  info: "success",
  verbose: "info",
  debug: "info",
  silly: "info"
};

/**
 * 获取日志级别对应的 Tag 类型
 * @param level 日志级别
 */
const getLevelType = (level: string): "danger" | "warning" | "info" | "success" => {
  return levelTypeMap[level?.toLowerCase()] || "info";
};

/**
 * 获取日志级别对应的显示文本
 * @param level 日志级别
 */
const getLevelText = (level: string): string => {
  const levelMap: Record<string, string> = {
    error: "错误",
    warn: "警告",
    http: "请求",
    info: "信息",
    verbose: "详细",
    debug: "调试",
    silly: "追踪"
  };
  return levelMap[level?.toLowerCase()] || level?.toUpperCase() || "未知";
};

// 请求方法对应的 Tag 类型映射
const methodTypeMap: Record<string, "success" | "primary" | "warning" | "danger" | "info"> = {
  GET: "success",
  POST: "primary",
  PUT: "warning",
  DELETE: "danger",
  PATCH: "info"
};

/**
 * 获取请求方法对应的 Tag 类型
 * @param method 请求方法
 */
const getMethodType = (method: string): "success" | "primary" | "warning" | "danger" | "info" => {
  return methodTypeMap[method?.toUpperCase()] || "info";
};

/**
 * 刷新日志列表
 */
const handleRefresh = () => {
  proTable.value?.getTableList();
  ElMessage.success("刷新成功");
};

/**
 * 清空日志
 * 传递当前检索条件到后端，按条件清除日志
 */
const handleClearLogs = async () => {
  try {
    // 获取当前的搜索参数
    const searchParams = (proTable.value as any)?.searchParam || {};

    // 处理日期范围参数
    const timeParam = searchParams.timestamp || searchParams.time;
    let startTime: string | undefined;
    let endTime: string | undefined;

    if (timeParam && Array.isArray(timeParam)) {
      const [start, end] = timeParam;
      startTime = start;
      endTime = end;
    }

    // 构建清理参数
    const clearParams = {
      startTime,
      endTime,
      level: searchParams.level || undefined,
      keyword: searchParams.keyword || undefined
    };

    // 确认信息
    const hasFilter = startTime || endTime || clearParams.level || clearParams.keyword;
    const confirmMsg = hasFilter
      ? "确定要按当前检索条件清除日志吗？此操作不可恢复！"
      : "确定要清空所有日志吗？此操作不可恢复！";

    await ElMessageBox.confirm(confirmMsg, "温馨提醒", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    });

    // 调用后端接口清空日志，传递检索条件
    const res = await clearSystemLogs(clearParams);
    ElMessage.success(`成功清理 ${res.data?.deletedCount || 0} 个日志文件`);
    // 刷新日志列表
    proTable.value?.getTableList();
  } catch (error: any) {
    // 用户取消操作 或 接口调用失败
    if (error !== 'cancel') {
      ElMessage.error(error?.message || "清空日志失败");
    }
  }
};

// 表格配置项
const columns: ColumnProps[] = [
  { type: "index", label: "序号", width: 70 },
  {
    prop: "timestamp",
    label: "时间",
    width: 180,
    // 搜索项配置 - 日期范围
    search: {
      el: "date-picker",
      span: 2,
      props: {
        type: "daterange",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        valueFormat: "YYYY-MM-DD",
        format: "YYYY-MM-DD"
      }
    },
    render: (scope) => {
      return scope.row.timestamp
        ? new Date(scope.row.timestamp).toLocaleString("zh-CN")
        : "-";
    }
  },
  {
    prop: "level",
    label: "级别",
    width: 100,
    // 搜索项配置
    search: {
      el: "select",
      props: {
        placeholder: "请选择级别"
      }
    },
    // 枚举字典（用于搜索下拉框）
    enum: [
      { label: "错误", value: "error" },
      { label: "警告", value: "warn" },
      { label: "请求", value: "http" },
      { label: "信息", value: "info" }
    ]
  },
  {
    prop: "message",
    label: "消息内容",
    minWidth: 300,
    showOverflowTooltip: true
  },
  {
    prop: "requestInfo",
    label: "请求信息",
    width: 250,
    showOverflowTooltip: true
  },
  {
    prop: "status",
    label: "状态码",
    width: 100
  },
  {
    prop: "duration",
    label: "耗时",
    width: 100,
    sortable: true
  },
  {
    prop: "ip",
    label: "IP地址",
    width: 150
  },
  {
    prop: "user",
    label: "用户",
    width: 120
  }
];
</script>

<style scoped lang="scss">
.table-box {
  height: 100%;
}

.log-message {
  display: inline-block;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.url-text {
  margin-left: 8px;
  font-size: 12px;
  color: #909399;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.duration-warning {
  color: #e6a23c;
  font-weight: 600;
}
</style>
