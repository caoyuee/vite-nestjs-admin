<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="部门列表"
      row-key="id"
      :indent="20"
      :columns="columns"
      :pagination="false"
      :request-api="getDepartmentList"
      :data-callback="dataCallback"
    >
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增部门</el-button>
      </template>
      <template #status="scope">
        <el-tag :type="scope.row.status ? 'success' : 'danger'">{{ scope.row.status ? "启用" : "禁用" }}</el-tag>
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="CirclePlus" @click="openDrawer('新增', scope.row)">新增下级</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="handleDelDepartment(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <DepartmentDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="departmentManage">
import { ref } from "vue";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import DepartmentDrawer from "@/views/system/departmentManage/components/DepartmentDrawer.vue";
import { addDepartment, delDepartment, editDepartment, getDepartmentList } from "@/api/modules/system";
import { useHandleData } from "@/hooks/useHandleData";
import type { Department, ResPage } from "@/api/interface";
import type { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";

const proTable = ref<ProTableInstance>();
const drawerRef = ref<InstanceType<typeof DepartmentDrawer> | null>(null);
const departmentTree = ref<Department.DepartmentItem[]>([]);

const statusOptions = [
  { label: "启用", value: true },
  { label: "禁用", value: false }
];

const columns: ColumnProps<Department.DepartmentItem>[] = [
  { prop: "name", label: "部门名称", align: "left", search: { el: "input" } },
  { prop: "code", label: "部门编码", search: { el: "input" } },
  { prop: "sort", label: "排序", width: 90 },
  { prop: "leader", label: "负责人" },
  { prop: "phone", label: "联系电话" },
  { prop: "email", label: "邮箱" },
  {
    prop: "status",
    label: "状态",
    enum: statusOptions,
    search: { el: "select" },
    fieldNames: { label: "label", value: "value" }
  },
  { prop: "createTime", label: "创建时间", width: 180 },
  { prop: "operation", label: "操作", width: 260, fixed: "right" }
];

const createDefaultDepartment = (): Department.CreateDepartment => ({
  parentId: 0,
  name: "",
  code: "",
  sort: 0,
  leader: "",
  phone: "",
  email: "",
  status: true,
  remark: ""
});

const dataCallback = (data: ResPage<Department.DepartmentItem>) => {
  departmentTree.value = data.list ?? [];
  return data;
};

const openDrawer = (title: string, row: Partial<Department.DepartmentItem> = {}) => {
  const isCreateChild = title === "新增" && row.id !== undefined;
  const rowData = title === "编辑"
    ? { ...createDefaultDepartment(), ...row }
    : { ...createDefaultDepartment(), parentId: isCreateChild ? Number(row.id) : 0 };

  drawerRef.value?.acceptParams({
    title,
    isView: title === "查看",
    row: rowData,
    api: title === "新增" ? addDepartment : title === "编辑" ? editDepartment : undefined,
    getTableList: proTable.value?.getTableList,
    departmentOptions: departmentTree.value
  });
};

const handleDelDepartment = async (row: Department.DepartmentItem) => {
  await useHandleData(delDepartment, row.id, `删除【${row.name}】部门`);
  proTable.value?.getTableList?.();
};
</script>
