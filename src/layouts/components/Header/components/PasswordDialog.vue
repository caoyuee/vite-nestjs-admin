<template>
  <el-dialog v-model="dialogVisible" title="修改密码" width="500px" draggable>
   <el-form ref="ruleFormRef" label-width="110px" label-suffix=" :" :rules="rules"
      :model="passwordForm">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input v-model="passwordForm.oldPassword" type="password" show-password placeholder="请输入原密码" clearable></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码" clearable></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="newPasswordAgain">
        <el-input v-model="passwordForm.newPasswordAgain" type="password" show-password placeholder="请再次输入新密码" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref,reactive } from "vue";
import type {Role} from '@/api/interface/index'
import {ElMessage,type FormInstance } from "element-plus";
import{resetPassword} from '@/api/modules/system'
import {useLogout} from "@/hooks/useLogout"
interface ResetPassword extends Role.ResetPassword{
  newPasswordAgain:string
}
const passwordForm=ref<ResetPassword>({
  oldPassword:'',
  newPassword:'',
  newPasswordAgain:''
})
const ruleFormRef = ref<FormInstance>();
  const validatePass1 = (_rule: any, value: any, callback: any) => {
  const reg=/^[A-Za-z0-9]{6,16}$/
  if (value==='') {
    callback(new Error('请输入原密码'))
  }else if (!reg.test(value)) {
    callback(new Error('密码必须由6-16位数字和字母组成'))
  }else {
    callback()
  }
}
const validatePass2 = (_rule: any, value: any, callback: any) => {
  const reg=/^[A-Za-z0-9]{6,16}$/
  if (value==='') {
    callback(new Error('请输入新密码'))
  }else if (!reg.test(value)) {
    callback(new Error('密码必须由6-16位数字和字母组成'))
  }else if (value === passwordForm.value.oldPassword) {
    callback(new Error('新密码不能与原密码相同'))
  } else {
    callback()
  }
}
const validatePass3 = (_rule: any, value: any, callback: any) => {
  const reg=/^[A-Za-z0-9]{6,16}$/
  if (value==='') {
    callback(new Error('请再次输入密码'))
  }else if (!reg.test(value)) {
    callback(new Error('密码必须由6-16位数字和字母组成'))
  }else if (value != passwordForm.value.newPassword) {
    callback(new Error('2次输入密码不一致'))
  } else {
    callback()
  }
}
const rules = reactive({
  oldPassword: [{ validator: validatePass1,trigger: 'blur' }],
  newPassword: [{ validator: validatePass2,trigger: 'blur' }],
  newPasswordAgain: [{ validator: validatePass3,trigger: 'blur' }],
  
});
const dialogVisible = ref(false);
const openDialog = () => {
  dialogVisible.value = true;
};
defineExpose({ openDialog });

const handleConfirm=()=>{
  // 校验表单
  ruleFormRef.value!.validate(async (valid) => {
    if (valid) {
      try {
        const params = {
          oldPassword: passwordForm.value.oldPassword,
          newPassword: passwordForm.value.newPassword,
        }
        await resetPassword(params);
        ElMessage.success({ message: `修改密码成功，请重新登录！` });
        dialogVisible.value = false;
        await useLogout()
      } catch (error) {
        console.log(error);
      }
    } else {

    }
  });
}
</script>
