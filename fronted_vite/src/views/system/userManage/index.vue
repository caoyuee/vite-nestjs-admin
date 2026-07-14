<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="用户列表"
      row-key="id"
      :indent="20"
      :columns="columns"
      :request-api="getSystemUserList"
      :pagination="true"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增用户 </el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="Link" @click="openBind(scope.row)"> 绑定 </el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)"> 编辑 </el-button>
        <el-button type="primary" link :icon="Delete" @click="handleDeleteUser(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>
    <BindDialog ref="bindDialogRef" />
    <UserDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="UserManage">
import { ref } from "vue";
import { Delete, EditPen, CirclePlus, Link } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import {
  getSystemUserList,
  createSystemUser,
  updateSystemUser,
  deleteSystemUser,
  getDepartmentList
} from "@/api/modules/system";
import { useHandleData } from "@/hooks/useHandleData";
import type { SystemUser, Department } from "@/api/interface";
import type { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import UserDrawer from "@/views/system/userManage/components/UserDrawer.vue";
import BindDialog from "./components/BindDialog.vue";
// ProTable 实例
const proTable = ref<ProTableInstance>();
const departmentOptions = ref<Department.DepartmentItem[]>([]);
type UserForm = Partial<SystemUser.CreateUser> & Partial<SystemUser.UpdateUser>;

const getDepartmentOptions = async () => {
  const result = await getDepartmentList({ pageNum: 1, pageSize: 999 });
  departmentOptions.value = result.data.list ?? [];
  return departmentOptions.value;
};

const ensureDepartmentOptions = async () => {
  if (departmentOptions.value.length > 0) return;
  await getDepartmentOptions();
};

// 表格配置项
const columns: ColumnProps<SystemUser.UserItem>[] = [
  { prop: "id", label: "ID", },
  { prop: "name", label: "昵称", search: { el: "input" } },
  { prop: "username", label: "登录账号", search: { el: "input" } },
  {
    prop: "departmentId",
    label: "所属部门",
    enum: getDepartmentOptions,
    fieldNames: { label: "name", value: "id", children: "children" },
    isFilterEnum: false,
    search: { el: "tree-select", props: { filterable: true, checkStrictly: true } },
    render: scope => scope.row.departmentName || "未分配"
  },
  { prop: "roles", label: "角色", search: { el: "input" } },
  {
    prop: "status", label: "状态", enum: [
      { label: "正常", value: true },
      { label: "禁用", value: false }
    ], search: { el: "input" }
  },
  { prop: "email", label: "邮箱" },
  { prop: "phone", label: "手机号" },
  { prop: "createTime", label: "创建时间" },
  { prop: "updateTime", label: "更新时间" },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
/**
 * 
 * @param title 
 * @param row 
 */
const openDrawer = async (title: string, row: Partial<SystemUser.UserItem> = {}) => {
  await ensureDepartmentOptions();
  const rowData = title === "编辑" ? row : { password: "", status: true };
  const submitApi = title === "新增"
    ? (params: UserForm) => createSystemUser(params as SystemUser.CreateUser)
    : title === "编辑"
      ? (params: UserForm) => updateSystemUser(params)
      : undefined;
  const params = {
    title,
    isView: title === "查看",
    row: rowData,
    api: submitApi,
    getTableList: proTable.value?.getTableList,
    departmentOptions: departmentOptions.value
  };
  drawerRef.value?.acceptParams(params);
};
/**
 * 
 * @param row 
 */
const handleDeleteUser = async (row: Partial<SystemUser.UserItem>) => {
  await useHandleData(deleteSystemUser, row.id, `删除【${row.name}】用户`);
  proTable.value?.getTableList?.();

};


const bindDialogRef = ref<InstanceType<typeof BindDialog> | null>(null);
/**
 * 
 * @param row 
 */
const openBind = (row: Partial<SystemUser.UserItem>) => {
  const params = {
    row,
    getTableList: proTable.value?.getTableList
  }
  bindDialogRef.value?.openDialog(params);
}
</script>
