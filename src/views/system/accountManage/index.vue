<template>
  <div class="table-box">
    <ProTable ref="proTable" title="账号列表" row-key="path" :indent="20" :columns="columns" :requestApi="getAccountList"
      :pagination="true">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增账号 </el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="Link" @click="openBind(scope.row)"> 绑定 </el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)"> 编辑 </el-button>
        <el-button type="primary" link :icon="Delete" @click="handleDelAccount(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>
    <BindDialog ref="bindDialogRef" />
    <UserDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="accountManage">
import { ref } from "vue";
import { Delete, EditPen, CirclePlus, Link } from "@element-plus/icons-vue";
// import authMenuList from "@/assets/json/authMenuList.json";
import ProTable from "@/components/ProTable/index.vue";
import { getAccountList, addAccount, editAccount, delAccount } from '@/api/modules/system.ts'
import { useHandleData } from "@/hooks/useHandleData";
import type { Account } from "@/api/interface";
import type { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import UserDrawer from "@/views/system/accountManage/components/UserDrawer.vue";
import BindDialog from "./components/BindDialog.vue";
// ProTable 实例
const proTable = ref<ProTableInstance>();

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "id", label: "ID", },
  { prop: "name", label: "昵称", search: { el: "input" } },
  { prop: "username", label: "账号", search: { el: "input" } },
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
const openDrawer = (title: string, row: Partial<Account.UserItem> = {}) => {
  const rowData = title === "编辑" ? row : { password: "" };
  const params = {
    title,
    isView: title === "查看",
    row: rowData,
    api: title === "新增" ? addAccount : title === "编辑" ? editAccount : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
/**
 * 
 * @param row 
 */
const handleDelAccount = async (row: Partial<Account.UserItem>) => {
  await useHandleData(delAccount, row.id, `删除【${row.name}】账号`);
  proTable.value?.getTableList?.();

};


const bindDialogRef = ref<InstanceType<typeof BindDialog> | null>(null);
/**
 * 
 * @param row 
 */
const openBind = (row: Partial<Account.UserItem>) => {
  const params = {
    row,
    getTableList: proTable.value?.getTableList
  }
  bindDialogRef.value?.openDialog(params);
}
</script>
