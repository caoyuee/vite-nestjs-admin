<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" title="角色授权">
     <TreeFilter
      title="菜单列表(多选)"
      multiple
      label="name"
      :request-api="getAllMenuList"
      :default-value="treeFilterValue.departmentId"
      @change="changeTreeFilter"
    />
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="AuthDrawer">
import { ref, reactive } from "vue";
import { ElMessage, type FormInstance } from "element-plus";
import type { Role } from "@/api/interface";
import TreeFilter from "@/components/TreeFilter/index.vue";
import { getAllMenuList } from "@/api/modules/system";
interface DrawerProps {
  row: Partial<Role.CreateRole>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  row: {
  }
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
  const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
};

defineExpose({
  acceptParams
});

const treeFilterValue = reactive({ departmentId: ["11"] });
const changeTreeFilter = (val: string[]) => {
  ElMessage.success(`你选择了 id 为 ${JSON.stringify(val)} 的数据🤔`);
  treeFilterValue.departmentId = val;
};
</script>
