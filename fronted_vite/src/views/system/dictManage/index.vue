<template>
  <div class="table-box">
    <ProTable ref="proTable" title="字典列表" row-key="id" :columns="columns" :requestApi="getDictionaryList"
      :pagination="true">
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增字典 </el-button>
      </template>
      <template #tag="scope">
        <el-tag :type="getTagType(scope.row.tag)">{{ scope.row.tag }}</el-tag>
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)"> 编辑 </el-button>
        <el-button type="primary" link :icon="Delete" @click="handleDelDict(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>
    <DictDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="dictManage">
import { ref } from "vue";
import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { getDictionaryList, addDictionary, editDictionary, delDictionary } from '@/api/modules/system'
import { useHandleData } from "@/hooks/useHandleData";
import type { Dictionary } from "@/api/interface";
import type { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import DictDrawer from "@/views/system/dictManage/components/DictDrawer.vue";

const proTable = ref<ProTableInstance>();
type TagType = "primary" | "success" | "info" | "warning" | "danger";

const getTagType = (tag: unknown): TagType => {
  const tagTypes: TagType[] = ["primary", "success", "info", "warning", "danger"];
  return typeof tag === "string" && tagTypes.includes(tag as TagType) ? (tag as TagType) : "primary";
};

const columns: ColumnProps[] = [
  { prop: "id", label: "ID" },
  { prop: "sort", label: "排序" },
  { prop: "name", label: "字典项名称", search: { el: "input" } },
  { prop: "dictType", label: "字典类型", search: { el: "input" } },
  { prop: "label", label: "显示标签" },
  { prop: "value", label: "实际值" },
  { prop: "tag", label: "标签类型" },
  { prop: "createTime", label: "创建时间" },
  { prop: "operation", label: "操作", width: 200, fixed: "right" }
];

const drawerRef = ref<InstanceType<typeof DictDrawer> | null>(null);

const openDrawer = (title: string, row: Partial<Dictionary.DictionaryItem> = {}) => {
  const rowData = title === "编辑" ? row : {};
  const params = {
    title,
    isView: title === "查看",
    row: rowData,
    api: title === "新增" ? addDictionary : title === "编辑" ? editDictionary : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

const handleDelDict = async (row: Partial<Dictionary.DictionaryItem>) => {
  await useHandleData(delDictionary, row.id, `删除【${row.name}】字典项`);
  proTable.value?.getTableList?.();
};
</script>
