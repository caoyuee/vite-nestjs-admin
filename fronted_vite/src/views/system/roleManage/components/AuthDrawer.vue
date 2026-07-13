<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="480px" title="角色授权">
    <div class="trees">
      <TreeFilter title="菜单列表(多选)" multiple label="nameZH" dataPath="list" :request-api="getAllMenuList"
        :default-value="treeFilterValue.ids" @change="changeTreeFilter" />
      <TreeFilter title="权限列表(多选)" multiple label="name" dataPath="list" :request-api="getAuthBtnsList" :params="{ type: 'button' }"
        :default-value="treeFilterValue1.ids" @change="changeTreeFilter1" />
    </div>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="AuthDrawer">
import { ref, reactive } from "vue";
import { ElMessage, } from "element-plus";
import type { Role } from "@/api/interface";
import TreeFilter from "@/components/TreeFilter/index.vue";
import { getAllMenuList, getAuthBtnsList } from "@/api/modules/system";
interface DrawerProps {
  row: Partial<Role.RoleItem>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  row: {
  }
});
const treeFilterValue = reactive({ ids: [''] });
const treeFilterValue1 = reactive({ ids: [''] });
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  treeFilterValue.ids = params.row.useMenus!
  treeFilterValue1.ids = params.row.authButton!
};

// 提交数据（新增/编辑）
const handleSubmit = async () => {
  const params = {
    id: drawerProps.value.row.id,
    useMenus: treeFilterValue.ids,
    authButton: treeFilterValue1.ids,
  }
  await drawerProps.value.api!(params);
  ElMessage.success({ message: '角色授权成功！' });
  drawerProps.value.getTableList!();
  drawerVisible.value = false;
};

defineExpose({
  acceptParams
});

//菜单权限选择
const changeTreeFilter = (val: string[]) => {
  // ElMessage.success(`你选择了 id 为 ${JSON.stringify(val)} 的数据🤔`);
  treeFilterValue.ids = val;
};

//按钮权限选择
const changeTreeFilter1 = (val: string[]) => {
  // ElMessage.success(`你选择了 id 为 ${JSON.stringify(val)} 的数据🤔`);
  treeFilterValue1.ids = val;
};
</script>
<style>
.trees {
  display: flex;
}
</style>
