<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}用户`">
    <el-form ref="ruleFormRef" label-width="110px" label-suffix=" :" :rules="rules" :disabled="drawerProps.isView"
      :model="drawerProps.row" :hide-required-asterisk="drawerProps.isView">
      <el-form-item label="名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="username">
        <el-input v-model="drawerProps.row!.username" placeholder="请填写账号" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请填写邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="drawerProps.row!.phone" placeholder="请填写电话" clearable></el-input>
      </el-form-item>
      <el-form-item label="账号状态" prop="status">
        <el-radio-group v-model="drawerProps.row!.status">
          <el-radio :value="true">正常</el-radio>
          <el-radio :value="false">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
import { ElMessage, type FormInstance } from "element-plus";
import type { Account } from "@/api/interface";
const rules = reactive({
  name: [{ required: true, message: "请填写名称" }],
  username: [{ required: true, message: "请填写账号" }],
  email: [{ required: false, message: "请填写邮箱" }],
  phone: [{ required: true, message: "请填写电话" }],
  status: [{ required: true, message: "请选择状态" }],
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Account.CreateUser>;
  api?: (params: any) => Promise<any>;
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
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}账号成功！` });
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
