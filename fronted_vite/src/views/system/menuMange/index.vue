<template>
  <div class="table-box">
    <ProTable ref="proTable" title="菜单列表" row-key="path" :indent="20" :columns="columns" :requestApi="getAllMenuList">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增菜单 </el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" :disabled="scope.row.type === 1" link :icon="CirclePlus"
          @click="openDrawer('新增', scope.row)"> 新增 </el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)"> 编辑 </el-button>
        <el-button type="primary" link :icon="Delete" @click="handleDelMenu(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>
    <MenuDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="menuManage">
import { ref } from "vue";
import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
// import authMenuList from "@/assets/json/authMenuList.json";
import ProTable from "@/components/ProTable/index.vue";
import { getAllMenuList, addMenu, editMenu, delMenu } from '@/api/modules/system.ts'
import { useHandleData } from "@/hooks/useHandleData";
import type { Menu } from "@/api/interface";
import type { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import MenuDrawer from "@/views/system/menuMange/components/MenuDrawer.vue";
// ProTable 实例
const proTable = ref<ProTableInstance>();

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "index", label: "排序", align: "left" },
  { prop: "meta.title", label: "菜单名称", align: "left", search: { el: "input" } },
  { prop: "meta.icon", label: "菜单图标" },
  { prop: "name", label: "路径名称", search: { el: "input" } },
  {
    prop: "type", label: "类型", enum: [
      { label: "分组", value: 0 },
      { label: "页面", value: 1 }
    ], search: { el: "input" }
  },
  { prop: "path", label: "菜单路径", width: 300, search: { el: "input" } },
  { prop: "component", label: "组件路径", width: 300 },
   { prop: "createTime", label: "创建时间" },
  { prop: "updateTime", label: "更新时间" },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof MenuDrawer> | null>(null);
  /**
   * 
   * @param title 
   * @param row 
   */
const openDrawer = (title: string, row: Partial<Menu.MenuTreeItem> = {}) => {
  const meta: Menu.Meta = title === "编辑" && row.meta ? row.meta : {
    icon: undefined,
    title: "",
    isLink: undefined,
    isHide: false,
    isFull: false,
    isAffix: false,
    isKeepAlive: false,
    activeMenu: undefined
  };
  const parentId = title === "新增" && row.id ? row.id : 0;
  const rowData = title === "编辑" ? row : { meta, parentId };
  const params = {
    title,
    isView: title === "查看",
    row: rowData,
    api: title === "新增" ? addMenu : title === "编辑" ? editMenu : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
// 删除菜单
const handleDelMenu = async (row: Partial<Menu.MenuTreeItem>) => {
  await useHandleData(delMenu, row.id , `删除【${row.meta!.title}】菜单`);
    proTable.value?.getTableList?.();
};
</script>
