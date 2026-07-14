<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="520px" :title="`${drawerProps.title}部门`">
    <el-form
      ref="ruleFormRef"
      label-width="110px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="上级部门" prop="parentId">
        <el-tree-select
          v-model="drawerProps.row.parentId"
          :data="departmentOptions"
          :props="{ label: 'name', children: 'children' }"
          node-key="id"
          check-strictly
          clearable
          filterable
          placeholder="请选择上级部门"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="drawerProps.row.name" placeholder="请填写部门名称" clearable />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="drawerProps.row.code" placeholder="请填写部门编码" clearable />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="drawerProps.row.sort" :min="0" placeholder="请输入排序" style="width: 100%" />
      </el-form-item>
      <el-form-item label="负责人" prop="leader">
        <el-input v-model="drawerProps.row.leader" placeholder="请填写负责人" clearable />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="drawerProps.row.phone" placeholder="请填写联系电话" clearable />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="drawerProps.row.email" placeholder="请填写邮箱" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="drawerProps.row.status">
          <el-radio :value="true">启用</el-radio>
          <el-radio :value="false">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="drawerProps.row.remark" type="textarea" :rows="3" placeholder="请填写备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="DepartmentDrawer">
import { reactive, ref } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import type { Department } from "@/api/interface";

type DepartmentForm = Partial<Department.UpdateDepartment> & Department.CreateDepartment;

interface DrawerProps {
  title: string;
  isView: boolean;
  row: DepartmentForm;
  api?: (params: DepartmentForm) => Promise<unknown>;
  getTableList?: () => void;
  departmentOptions: Department.DepartmentItem[];
}

const createDefaultDepartment = (): DepartmentForm => ({
  parentId: 0,
  name: "",
  code: "",
  sort: 0,
  leader: "",
  phone: "",
  email: "",
  status: true,
  remark: ""
});

const validatePhone = (_rule: unknown, value: string | undefined, callback: (error?: Error) => void) => {
  if (!value || /^[0-9+\-\s()]{5,30}$/.test(value)) {
    callback();
    return;
  }
  callback(new Error("联系电话格式不正确"));
};

const rules = reactive<FormRules<DepartmentForm>>({
  name: [{ required: true, message: "请填写部门名称", trigger: "blur" }],
  code: [{ required: true, message: "请填写部门编码", trigger: "blur" }],
  sort: [{ required: true, message: "请填写排序", trigger: "change" }],
  phone: [{ validator: validatePhone, trigger: "blur" }],
  email: [{ type: "email", message: "邮箱格式不正确", trigger: "blur" }]
});

const drawerVisible = ref(false);
const departmentOptions = ref<Department.DepartmentItem[]>([]);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: createDefaultDepartment(),
  departmentOptions: []
});

const acceptParams = (params: DrawerProps) => {
  departmentOptions.value = [{ ...createDefaultDepartment(), id: 0, name: "顶级部门", createTime: "", updateTime: "" }, ...params.departmentOptions];
  drawerProps.value = {
    ...params,
    row: {
      ...createDefaultDepartment(),
      ...params.row
    }
  };
  drawerVisible.value = true;
};

const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value?.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api?.(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}部门成功！` });
      drawerProps.value.getTableList?.();
      drawerVisible.value = false;
    } catch {
      ElMessage.error(`${drawerProps.value.title}部门失败`);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
