<template>
  <div class="card filter">
    <h4 v-if="title" class="title sle">
      {{ title }}
    </h4>
    <div class="search">
      <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable />
      <el-dropdown trigger="click">
        <el-icon size="20">
          <More />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="toggleTreeNodes(true)">展开全部</el-dropdown-item>
            <el-dropdown-item @click="toggleTreeNodes(false)">折叠全部</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-scrollbar :style="{ height: title ? `calc(100% - 95px)` : `calc(100% - 56px)` }">
      <el-tree ref="treeRef" :default-expand-all="defaultExpendAll" :node-key="id"
        :data="multiple ? treeData : treeAllData" :show-checkbox="multiple" :check-strictly="false"
        :current-node-key="!multiple ? selectedKey : ''" :highlight-current="!multiple" :expand-on-click-node="false"
        :check-on-click-node="multiple" :props="defaultProps" :filter-node-method="filterNode"
        :default-checked-keys="multiple ? selectedKeys : []" @node-click="handleNodeClick" @check="handleCheckChange">
        <template #default="scope">
          <span class="el-tree-node__label">
            <slot :row="scope">
              {{ scope.node.label }}
            </slot>
          </span>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts" name="TreeFilter">
import { computed, ref, watch, onBeforeMount, nextTick } from "vue";
import { ElTree } from "element-plus";

type TreeNodeData = Record<string, unknown>;
type TreeNodeValue = string | number | Array<string | number>;
type TreeNodeLike = {
  label: string;
  level: number;
  parent?: TreeNodeLike | null;
};

// 接收父组件参数并设置默认值
interface TreeFilterProps {
  requestApi?: (data: never) => Promise<{ data: unknown }>; // 请求分类数据的 api ==> 非必传
  data?: TreeNodeData[]; // 分类数据，如果有分类数据，则不会执行 api 请求 ==> 非必传
  title?: string; // treeFilter 标题 ==> 非必传
  id?: string; // 选择的id ==> 非必传，默认为 “id”
  label?: string; // 显示的label ==> 非必传，默认为 “label”
  multiple?: boolean; // 是否为多选 ==> 非必传，默认为 false
  defaultValue?: TreeNodeValue; // 默认选中的值 ==> 非必传
  params?: TreeNodeData//api携带参数
  defaultExpendAll?: boolean//是否默认展开
  dataPath?: string; // 数据路径，用于指定 API 响应中数据的位置，如 "list" 或 "data.list"

}
const props = withDefaults(defineProps<TreeFilterProps>(), {
  id: "id",
  label: "label",
  multiple: false,
  dataPath: ""
});

const defaultProps = {
  children: "children",
  label: props.label
};

const treeRef = ref<InstanceType<typeof ElTree>>();
const treeData = ref<TreeNodeData[]>([]);
const treeAllData = ref<TreeNodeData[]>([]);

const selected = ref<TreeNodeValue | "">("");
const selectedKey = computed(() => (Array.isArray(selected.value) ? "" : selected.value));
const selectedKeys = computed(() => (Array.isArray(selected.value) ? selected.value : []));
const setSelected = () => {
  if (props.multiple)
    selected.value = Array.isArray(props.defaultValue)
      ? props.defaultValue
      : props.defaultValue === undefined
        ? []
        : [props.defaultValue];
  else selected.value = typeof props.defaultValue === "string" ? props.defaultValue : "";
};

// 解析数据路径
const getNestedData = (data: unknown, path: string): unknown => {
  if (!path) return data;
  return path.split('.').reduce((acc, key) => {
    return acc && typeof acc === "object" ? (acc as TreeNodeData)[key] : undefined;
  }, data as unknown);
};

onBeforeMount(async () => {
  setSelected();
  if (props.requestApi) {
    console.log(props.params, '=========');

    const { data } = await props.requestApi!((props.params ?? {}) as never);
    const resolvedData = getNestedData(data, props.dataPath);
    treeData.value = Array.isArray(resolvedData) ? resolvedData as TreeNodeData[] : [];
    treeAllData.value = [{ id: "", [props.label]: "全部" }, ...treeData.value];
  }
});

// 使用 nextTick 防止打包后赋值不生效，开发环境是正常的
watch(
  () => props.defaultValue,
  () => nextTick(() => setSelected()),
  { deep: true, immediate: true }
);

watch(
  () => props.data,
  () => {
    if (props.data?.length) {
      treeData.value = props.data;
      treeAllData.value = [{ id: "", [props.label]: "全部" }, ...props.data];
    }
  },
  { deep: true, immediate: true }
);

const filterText = ref("");
watch(filterText, val => {
  treeRef.value!.filter(val);
});

// 过滤
const filterNode = (value: string, _data: TreeNodeData, node: TreeNodeLike) => {
  if (!value) return true;
  let parentNode = node.parent,
    labels = [node.label],
    level = 1;
  while (level < node.level) {
    if (!parentNode) break;
    labels = [...labels, parentNode.label];
    parentNode = parentNode.parent;
    level++;
  }
  return labels.some(label => label.indexOf(value) !== -1);
};

// 切换树节点的展开或折叠状态
const toggleTreeNodes = (isExpand: boolean) => {
  let nodes = treeRef.value?.store.nodesMap;
  if (!nodes) return;
  for (const node in nodes) {
    if (nodes.hasOwnProperty(node)) {
      nodes[node]!.expanded = isExpand;
    }
  }
};

// emit
const emit = defineEmits<{
  change: [value: never];
}>();

// 单选
const handleNodeClick = (data: TreeNodeData) => {
  if (props.multiple) return;
  const value = data[props.id];
  emit("change", (typeof value === "string" || typeof value === "number" ? value : undefined) as never);
};

// 多选
const handleCheckChange = () => {
  emit("change", treeRef.value?.getCheckedKeys() as never);
};

// 暴露给父组件使用
defineExpose({ treeData, treeAllData, treeRef });
</script>

<style scoped lang="scss">
@use "./index.scss";
</style>
