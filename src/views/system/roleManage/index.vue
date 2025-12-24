<template>
  <div class="table-box">
    <ProTable ref="proTable" title="角色列表" row-key="path" :indent="20" :columns="columns" :requestApi="getRoleList"
      :pagination="true">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增账号 </el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="Magnet"> 授权 </el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)"> 编辑 </el-button>
        <el-button type="primary" link :icon="Delete" @click="handleDelRole(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>
    <RoleDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="roleManage">
import { ref } from "vue";
import { Delete, EditPen, CirclePlus, Magnet } from "@element-plus/icons-vue";
// import authMenuList from "@/assets/json/authMenuList.json";
import ProTable from "@/components/ProTable/index.vue";
import { getRoleList, addRole, editRole, delRole   } from '@/api/modules/system.ts'
import { useHandleData } from "@/hooks/useHandleData";
import type { Role } from "@/api/interface";
import type { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import RoleDrawer from "@/views/system/roleManage/components/RoleDrawer.vue";
// ProTable 实例
const proTable = ref<ProTableInstance>();

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "id", label: "ID", },
  { prop: "sort", label: "排序"  },
  { prop: "name", label: "名称", search: { el: "input" } },
  { prop: "role", label: "角色", search: { el: "input" } },
    { prop: "description", label: "角色描述" },
  {
    prop: "status", label: "状态", enum: [
      { label: "正常", value: true},
      { label: "禁用", value: false }
    ], search: { el: "input" }
  },
  { prop: "createTime", label: "创建时间" },
  { prop: "updateTime", label: "更新时间" },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof RoleDrawer> | null>(null);
  /**
   * 
   * @param title 
   * @param row 
   */
const openDrawer = (title: string, row: Partial<Role.RoleItem> = {}) => {

  const rowData = title === "编辑" ? row : {password: ""};
  const params = {
    title,
    isView: title === "查看",
    row: rowData,
    api: title === "新增" ? addRole : title === "编辑" ? editRole : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

const handleDelRole = async (row: Partial<Role.RoleItem>) => {
   await useHandleData(delRole, row.id , `删除【${row.name}】账号`);
    proTable.value?.getTableList?.();
  
};
</script>
