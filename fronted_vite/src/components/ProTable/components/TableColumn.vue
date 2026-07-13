<template>
  <RenderTableColumn v-bind="column" />
</template>

<script setup lang="tsx" name="TableColumn">
import { inject, ref, useSlots } from "vue";
import type { ColumnProps, EnumProps, HeaderRenderScope, RenderScope } from "@/components/ProTable/interface";
import { filterEnum, formatValue, handleProp, handleRowAccordingToProp } from "@/utils";

defineProps<{ column: ColumnProps }>();

const slots = useSlots();

type ColumnRow = Record<string, unknown>;

const enumMap = inject("enumMap", ref(new Map<string, EnumProps[]>()));

// 渲染表格数据
const renderCellData = (item: ColumnProps, scope: RenderScope<ColumnRow>) => {
  if (!item.prop) return "--";
  return enumMap.value.get(item.prop) && item.isFilterEnum
    ? filterEnum(handleRowAccordingToProp(scope.row, item.prop), enumMap.value.get(item.prop)!, item.fieldNames)
    : formatValue(handleRowAccordingToProp(scope.row, item.prop));
};

// 获取 tag 类型
const getTagType = (item: ColumnProps, scope: RenderScope<ColumnRow>) => {
  if (!item.prop) return "primary";
  return (
    filterEnum(handleRowAccordingToProp(scope.row, item.prop), enumMap.value.get(item.prop), item.fieldNames, "tag") || "primary"
  );
};

const RenderTableColumn = (item: ColumnProps) => {
  return (
    <>
      {item.isShow && (
        <el-table-column
          {...item}
          align={item.align ?? "center"}
          showOverflowTooltip={item.showOverflowTooltip ?? item.prop !== "operation"}
        >
          {{
            default: (scope: RenderScope<ColumnRow>) => {
              if (item._children) return item._children.map(child => RenderTableColumn(child));
              if (item.render) return item.render(scope);
              if (item.prop && slots[handleProp(item.prop)]) return slots[handleProp(item.prop)]!(scope);
              if (item.tag) return <el-tag type={getTagType(item, scope)}>{renderCellData(item, scope)}</el-tag>;
              return renderCellData(item, scope);
            },
            header: (scope: HeaderRenderScope<ColumnRow>) => {
              if (item.headerRender) return item.headerRender(scope);
              if (item.prop && slots[`${handleProp(item.prop)}Header`]) return slots[`${handleProp(item.prop)}Header`]!(scope);
              return item.label;
            }
          }}
        </el-table-column>
      )}
    </>
  );
};
</script>
