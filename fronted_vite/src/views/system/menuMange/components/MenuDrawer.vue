<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}用户`">
    <el-form ref="ruleFormRef" label-width="110px" label-suffix=" :" :rules="rules" :disabled="drawerProps.isView"
      :model="drawerProps.row" :hide-required-asterisk="drawerProps.isView">
      <el-form-item label="排序" prop="index">
        <el-input v-model="drawerProps.row!.index" placeholder="请填写排序" clearable></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="drawerProps.row!.type" @input="updateRules">
          <el-radio :value="0">分组</el-radio>
          <el-radio :value="1">页面</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="路由地址" prop="path">
        <el-input v-model="drawerProps.row!.path" placeholder="请填写路由地址" clearable></el-input>
      </el-form-item>
      <el-form-item label="路由名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写路由名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="重定向地址" prop="redirect">
        <el-input v-model="drawerProps.row!.redirect" placeholder="请填写重定向地址" clearable></el-input>
      </el-form-item>
      <el-form-item label="组件地址" prop="component">
        <el-input v-model="drawerProps.row!.component" placeholder="请填写组件地址" clearable></el-input>
      </el-form-item>
      <el-form-item label="菜单状态" prop="status">
        <el-radio-group v-model="drawerProps.row!.status">
          <el-radio :value="true">正常</el-radio>
          <el-radio :value="false">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单元数据">
        <el-form ref="ruleFormMeta" label-width="90px" :rules="metaRules" :disabled="drawerProps.isView"
          :model="drawerProps.row!.meta" :hide-required-asterisk="drawerProps.isView">
          <el-form-item label="图标名" prop="icon">
            <el-select v-model="drawerProps.row!.meta!.icon" placeholder="Select" style="width: 240px">
              <el-option v-for="(item, index) in iconOptions" :key="index" :value="item.key">
                <el-icon><component :is="item.icon"></component></el-icon>
                <span style="margin-left: 8px">{{ item.key }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单名" prop="title">
            <el-input v-model="drawerProps.row!.meta!.title" placeholder="请填写页面或组件名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="链接名" prop="isLink">
            <el-input v-model="drawerProps.row!.meta!.isLink" placeholder="请填写链接名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="高亮" prop="activeMenu">
            <el-input v-model="drawerProps.row!.meta!.activeMenu" placeholder="请填写高亮菜单" clearable></el-input>
          </el-form-item>
          <el-form-item label="隐藏" prop="isHide">
            <el-radio-group v-model="drawerProps.row!.meta!.isHide">
              <el-radio :value="true">是</el-radio>
              <el-radio :value="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="全屏" prop="isFull">
            <el-radio-group v-model="drawerProps.row!.meta!.isFull">
              <el-radio :value="true">是</el-radio>
              <el-radio :value="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="固定" prop="isAffix">
            <el-radio-group v-model="drawerProps.row!.meta!.isAffix">
              <el-radio :value="true">是</el-radio>
              <el-radio :value="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="缓存" prop="isKeepAlive">
            <el-radio-group v-model="drawerProps.row!.meta!.isKeepAlive">
              <el-radio :value="true">是</el-radio>
              <el-radio :value="false">否</el-radio>
            </el-radio-group>
          </el-form-item>

        </el-form>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="MenuDrawer">
import { ref, reactive } from "vue";
import { ElMessage, type FormInstance } from "element-plus";
import type { Menu } from "@/api/interface";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const iconOptions = Object.entries(ElementPlusIconsVue).map(([key,icon]) => ({key,icon}));
const rules = reactive({
  index: [{ required: true, message: "请上填写排序" }],
  type: [{ required: true, message: "请选择类型" }],
  path: [{ required: true, message: "请填写路由路径" }],
  name: [{ required: true, message: "请填写名称" }],
  component: [{ required: true, message: "请填写组件路径" }],
  redirect: [{ required: false, message: "请填写重定向路径" }],
  status: [{ required: true, message: "请选择状态" }],
});
const metaRules = reactive({
  icon: [{ required: false, message: "请输入图标名称" }],
  title: [{ required: true, message: "请输入页面或分组名称" }],
  isLink: [{ required: false, message: "请填写链接" }],
  isHide: [{ required: false, message: "请选择是否隐藏" }],
  isFull: [{ required: false, message: "请选择是否是全屏页面" }],
  isAffix: [{ required: false, message: "请选择是否固定" }],
  isKeepAlive: [{ required: false, message: "请选择是否缓存" }],
  activeMenu: [{ required: false, message: "请输入激活菜单" }],
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Menu.MenuTreeItem>;
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



// 根据类型动态更新校验规则
const updateRules = () => {
  if (drawerProps.value.row.type === 1) {
    rules.component[0]!.required = true;
  } else {
    rules.component[0]!.required = false;
  }
}
// 提交数据（新增/编辑）
const ruleFormMeta = ref<FormInstance>();
  const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  let dispatchValidate = new Promise<void>((resolve, reject) => {  
 ruleFormMeta.value!.validate((valid) => {  
        if (valid) {  
            resolve();  
        } else {  
            reject(new Error('错误'));   
        }  
    });  
});  

// 校验表单二  
let formValidate = new Promise<void>((resolve, reject) => {  
    ruleFormRef.value!.validate((valid) => {  
        if (valid) {  
            resolve();  
        } else {  
            reject(new Error('错误'));    
        }  
    });  
});  

// Promise.all统一处理  
Promise.all([dispatchValidate, formValidate])  
.then(async() => {  
    // 调用接口  
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}菜单成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }  
}).catch(_error => {  
    
})
};

defineExpose({
  acceptParams
});
</script>
