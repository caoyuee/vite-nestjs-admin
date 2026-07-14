<template>
  <el-drawer
    v-model="drawerVisible"
    :destroy-on-close="true"
    size="450px"
    :title="`${drawerProps.title}用户`"
  >
    <el-form
      ref="ruleFormRef"
      label-width="110px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="用户头像" prop="avatar">
        <UploadImg
          v-model:image-url="drawerProps.row!.avatar!"
          width="135px"
          height="135px"
          :file-size="3"
          border-radius="50%"
        >
          <template #empty>
            <el-icon>
              <Avatar />
            </el-icon>
            <span>请上传头像</span>
          </template>
          <template #tip> 头像大小不能超过 3M </template>
        </UploadImg>
      </el-form-item>
      <el-form-item label="所属部门" prop="departmentId">
        <el-tree-select
          v-model="drawerProps.row.departmentId"
          :data="departmentOptions"
          :props="{ label: 'name', children: 'children' }"
          node-key="id"
          check-strictly
          clearable
          filterable
          placeholder="请选择所属部门"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="登录账号" prop="username">
        <el-input v-model="drawerProps.row!.username" placeholder="请填写登录账号" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="drawerProps.title === '新增'" label="密码" prop="password">
        <el-input v-model="drawerProps.row!.password" type="password" placeholder="请填写密码" show-password clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请填写邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="drawerProps.row!.phone" placeholder="请填写电话" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
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
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import UploadImg from "@/components/Upload/Img.vue";
import type { SystemUser, Department } from "@/api/interface";

type UserForm = Partial<SystemUser.CreateUser> & Partial<SystemUser.UpdateUser>;

const createDefaultUser = (): UserForm => ({
  avatar: "",
  name: "",
  username: "",
  password: "",
  email: "",
  phone: "",
  status: true
});

const rules = reactive<FormRules<UserForm>>({
  avatar: [{ required: true, message: "请上传用户头像", trigger: "change" }],
  departmentId: [{ required: true, message: "请选择所属部门", trigger: "change" }],
  name: [{ required: true, message: "请填写名称", trigger: "blur" }],
  username: [{ required: true, message: "请填写登录账号", trigger: "blur" }],
  password: [{ required: true, message: "请填写密码", trigger: "blur" }],
  email: [{ required: false, message: "请填写邮箱" }],
  phone: [{ required: true, message: "请填写电话", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: UserForm;
  api?: (params: UserForm) => Promise<unknown>;
  getTableList?: () => void;
  departmentOptions: Department.DepartmentItem[];
}

const drawerVisible = ref(false);
const departmentOptions = ref<Department.DepartmentItem[]>([]);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: createDefaultUser(),
  departmentOptions: []
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  departmentOptions.value = params.departmentOptions;
  drawerProps.value = {
    ...params,
    row: {
      ...createDefaultUser(),
      ...params.row
    }
  };
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  // 校验表单
  ruleFormRef.value!.validate(async (valid) => {
    if (valid) {
      try {
        await drawerProps.value.api?.(drawerProps.value.row);
        ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
        drawerProps.value.getTableList?.();
        drawerVisible.value = false;
      } catch {
        ElMessage.error(`${drawerProps.value.title}用户失败`);
      }
    }
  });
};

defineExpose({
  acceptParams
});
</script>
