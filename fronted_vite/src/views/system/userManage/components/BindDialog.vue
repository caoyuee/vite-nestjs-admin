<template>
  <el-dialog v-model="dialogVisible" title="角色授权" width="500px" draggable>
    <el-checkbox-group v-model="selectedIds" :options="checkOptions" :props="props" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { SystemUser, Role } from "@/api/interface";
import { getRoleList, updateSystemUser } from "@/api/modules/system";
import { ElMessage } from "element-plus";
interface DialogProps {
  row: Partial<SystemUser.UserItem>;
  getTableList?: () => void;
}
const dialogVisible = ref(false);
const dialogProps = ref<DialogProps>({
  row: {}
});
const checkOptions = ref<Role.RoleItem[]>([])
const selectedIds = ref<string[]>([])
const props = { label: 'name', value: 'id', disabled: 'status' }
const openDialog = (params: DialogProps) => {
  dialogProps.value = params
  selectedIds.value = [...(params.row.roles ?? [])]
  dialogVisible.value = true;
};
defineExpose({ openDialog });
/**
 * 选择器
 */
const initComponent = async () => {
  const { data } = await getRoleList({ pageNum: 1, pageSize: 100 })

  checkOptions.value = data?.list?.map(item => {
    item.id = item.id.toString()
    return item
  }) || []
}
const handleSubmit = async () => {
  try {
    const params = {
      id: dialogProps.value.row.id!,
      roles: selectedIds.value,
    }
    await updateSystemUser(params)
    ElMessage.success({ message: '绑定成功！' });
    dialogProps.value.getTableList?.();
    dialogVisible.value = false;
  } catch {
    ElMessage.error('绑定失败');
  }
}
onMounted(() => {
  initComponent()
})
</script>
