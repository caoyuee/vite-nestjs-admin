<template>
  <div class="table-box">
    <ProTable ref="proTable" title="账号列表" row-key="path" :indent="20" :columns="columns" :requestApi="getAccountList"
      :pagination="true">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增账号 </el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" :disabled="scope.row.type === 1" link :icon="CollectionTag"> 授权 </el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)"> 编辑 </el-button>
        <el-button type="primary" link :icon="Delete" @click="handleDelAccount(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="accountManage">
import { ref } from "vue";
import { Delete, EditPen, CirclePlus, CollectionTag } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
// import authMenuList from "@/assets/json/authMenuList.json";
import ProTable from "@/components/ProTable/index.vue";
import { getAccountList, addAccount, editAccount, delAccount   } from '@/api/modules/system.ts'
import { ResultEnum } from "@/enums/httpEnum";
import type { Account } from "@/api/interface";
import type { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import UserDrawer from "@/views/system/accountManage/components/UserDrawer.vue";
// ProTable 实例
const proTable = ref<ProTableInstance>();

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "id", label: "ID", },
  { prop: "name", label: "昵称",search: { el: "input" }  },
  { prop: "username", label: "账号", search: { el: "input" } },
  { prop: "roles", label: "角色", search: { el: "input" } },
  { prop: "createdTime", label: "创建时间"},
  { prop: "updatedTime", label: "更新时间"},
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

  const rowData = title === "编辑" ? row : {};
  const params = {
    title,
    isView: title === "查看",
    row: rowData,
    api: title === "新增" ? addAccount : title === "编辑" ? editAccount : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

const handleDelAccount = (row: Partial<Account.UserItem>) => {
  delAccount(row.id as number|string).then((res) => {
    if(res.code === ResultEnum.SUCCESS) {
      ElMessage.success('删除成功');
    } else {
      ElMessage.error(res.message);
      return;
    }
    proTable.value?.getTableList?.();
  });
};
</script>
