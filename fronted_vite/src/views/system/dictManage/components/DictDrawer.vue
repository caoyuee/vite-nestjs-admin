<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}字典`">
    <el-form ref="ruleFormRef" label-width="110px" label-suffix=" :" :rules="rules" :disabled="drawerProps.isView"
      :model="drawerProps.row" :hide-required-asterisk="drawerProps.isView">
      <el-form-item label="字典项名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写字典项名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="字典类型" prop="dictType">
        <el-input v-model="drawerProps.row!.dictType" placeholder="请填写字典类型" clearable></el-input>
      </el-form-item>
      <el-form-item label="显示标签" prop="label">
        <el-input v-model="drawerProps.row!.label" placeholder="请填写显示标签" clearable></el-input>
      </el-form-item>
      <el-form-item label="实际值" prop="value">
        <el-input v-model="drawerProps.row!.value" placeholder="请填写实际值" clearable></el-input>
      </el-form-item>
      <el-form-item label="标签类型" prop="tag">
        <el-select v-model="drawerProps.row!.tag" placeholder="请选择标签类型" clearable style="width: 100%">
          <el-option label="success" value="success">
            <el-tag type="success">success</el-tag>
          </el-option>
          <el-option label="warning" value="warning">
            <el-tag type="warning">warning</el-tag>
          </el-option>
          <el-option label="danger" value="danger">
            <el-tag type="danger">danger</el-tag>
          </el-option>
          <el-option label="info" value="info">
            <el-tag type="info">info</el-tag>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="drawerProps.row!.sort" :min="0" placeholder="请输入排序" style="width: 100%"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="DictDrawer">
import { ref, reactive } from "vue";
import { ElMessage, type FormInstance } from "element-plus";
import type { Dictionary } from "@/api/interface";

const rules = reactive({
  name: [{ required: true, message: "请填写字典项名称" }],
  dictType: [{ required: true, message: "请填写字典类型" }],
  label: [{ required: true, message: "请填写显示标签" }],
  value: [{ required: true, message: "请填写实际值" }],
  tag: [{ required: true, message: "请选择标签类型" }],
  sort: [{ required: false, message: "请填写排序" }],
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Dictionary.CreateDictionary>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (valid) {
      try {
        await drawerProps.value.api!(drawerProps.value.row);
        ElMessage.success({ message: `${drawerProps.value.title}字典成功！` });
        drawerProps.value.getTableList!();
        drawerVisible.value = false;
      } catch (error) {
        console.log(error);
      }
    }
  });
};

defineExpose({
  acceptParams
});
</script>
