<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}角色`">
    <el-form ref="ruleFormRef" label-width="110px" label-suffix=" :" :rules="rules" :disabled="drawerProps.isView"
      :model="drawerProps.row" :hide-required-asterisk="drawerProps.isView">
      <el-form-item label="名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-input v-model="drawerProps.row!.role" placeholder="请填写角色" clearable></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description" v-if="drawerProps.title === '新增'">
        <el-input v-model="drawerProps.row!.description" placeholder="请描述" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色状态" prop="status">
        <el-radio-group v-model="drawerProps.row!.status">
          <el-radio :value="true">正常</el-radio>
          <el-radio :value="false">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="drawerProps.row!.sort" placeholder="请输入排序" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="RoleDrawer">
import { ref, reactive } from "vue";
import { ElMessage, type FormInstance } from "element-plus";
import type { Role } from "@/api/interface";
const rules = reactive({
  name: [{ required: true, message: "请填写名称" }],
  role: [{ required: true, message: "请填写角色" }],
  description: [{ required: false, message: "请描述" }],
  sort: [{ required: false, message: "请填写邮箱" }],
  status: [{ required: true, message: "请选择状态" }],
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Role.CreateRole>;
  api?: (params: never) => Promise<unknown>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
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
  // 校验表单
  ruleFormRef.value!.validate(async (valid) => {
    if (valid) {
      try {
        await drawerProps.value.api!(drawerProps.value.row as never);
        ElMessage.success({ message: `${drawerProps.value.title}角色成功！` });
        drawerProps.value.getTableList!();
        drawerVisible.value = false;
      } catch (error) {
        console.log(error);
      }
    } else {

    }
  });
};

defineExpose({
  acceptParams
});
</script>
