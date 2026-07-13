import { ref, computed, type Ref } from "vue";

/**
 * @description 表格多选数据操作
 * @param {String} rowKey 当表格可以多选时，所指定的 id
 * */
export const useSelection = <T extends Record<string, unknown> = Record<string, unknown>>(rowKey: keyof T = "id" as keyof T) => {
  const isSelected = ref<boolean>(false);
  const selectedList = ref<T[]>([]) as Ref<T[]>;

  // 当前选中的所有 ids 数组
  const selectedListIds = computed((): string[] => {
    const ids: string[] = [];
    selectedList.value.forEach(item => ids.push(String(item[rowKey])));
    return ids;
  });

  /**
   * @description 多选操作
   * @param {Array} rowArr 当前选择的所有数据
   * @return void
   */
  const selectionChange = (rowArr: T[]) => {
    rowArr.length ? (isSelected.value = true) : (isSelected.value = false);
    selectedList.value = rowArr;
  };

  return {
    isSelected,
    selectedList,
    selectedListIds,
    selectionChange
  };
};
