import * as echarts from "echarts/core";
import {
  BarChart,
  LineChart,
  LinesChart,
  PieChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
  CustomChart
} from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  PolarComponent,
  GeoComponent,
  ToolboxComponent,
  DataZoomComponent
} from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import type {
  BarSeriesOption,
  LineSeriesOption,
  LinesSeriesOption,
  PieSeriesOption,
  ScatterSeriesOption,
  RadarSeriesOption,
  GaugeSeriesOption,
  CustomSeriesOption
} from "echarts/charts";
import type {
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  DatasetComponentOption
} from "echarts/components";
import type { ComposeOption } from "echarts/core";
import liquidFillCustomSeriesInstaller from "@echarts-x/custom-liquid-fill";

type LiquidFillDirection = "right" | "left" | "none";
type LiquidFillDataItem = number | { value: number; direction?: LiquidFillDirection; itemStyle?: Record<string, unknown> };

interface LiquidFillItemPayload {
  center?: Array<string | number>;
  radius?: string | number;
  amplitude?: number;
  waveLength?: string | number;
  phase?: number | "auto";
  period?: number | "auto" | ((value: number, index: number) => number);
  direction?: LiquidFillDirection;
  waveAnimation?: boolean;
  animationDuration?: number;
  animationEasing?: string;
  labelInsideColor?: string;
  outline?: {
    show?: boolean;
    borderDistance?: number;
    itemStyle?: Record<string, unknown>;
  };
  backgroundStyle?: Record<string, unknown>;
  itemStyle?: Record<string, unknown>;
}

type LiquidFillSeriesOption = Omit<CustomSeriesOption, "type" | "renderItem"> & {
  type: "custom";
  renderItem: "liquidFill";
  itemPayload: LiquidFillItemPayload;
};

type LiquidFillSeriesConfig = LiquidFillItemPayload & {
  name?: string;
  z?: number;
  color?: unknown[];
  data: LiquidFillDataItem[];
  label?: Record<string, unknown>;
};

/**
 * 创建 ECharts 6 自定义水球图配置
 *
 * @description ECharts 6 官方水球扩展使用 custom series，旧 liquidFill 的图形参数统一放入 itemPayload
 * @param {LiquidFillSeriesConfig} config - 水球图配置
 * @returns {LiquidFillSeriesOption} custom liquidFill 系列配置
 */
export const createLiquidFillSeries = ({
  data,
  label,
  itemStyle,
  backgroundStyle,
  outline,
  ...config
}: LiquidFillSeriesConfig): LiquidFillSeriesOption => {
  const dataDirection = data.find(
    (item): item is Exclude<LiquidFillDataItem, number> => typeof item === "object" && !!item.direction
  )?.direction;
  const customData = data.map(item => {
    if (typeof item === "number") return item;

    const { direction: _direction, ...dataItem } = item;
    return dataItem;
  });

  return {
    type: "custom",
    renderItem: "liquidFill",
    coordinateSystem: "none",
    data: customData,
    label: label?.normal ? { show: false } : label,
    itemStyle,
    itemPayload: {
      center: config.center,
      radius: config.radius,
      amplitude: config.amplitude,
      waveLength: config.waveLength,
      phase: config.phase,
      period: config.period,
      direction: config.direction ?? dataDirection,
      waveAnimation: config.waveAnimation,
      animationDuration: config.animationDuration,
      animationEasing: config.animationEasing,
      labelInsideColor: config.labelInsideColor,
      backgroundStyle,
      outline,
      itemStyle
    },
    name: config.name,
    z: config.z,
    color: config.color
  } as LiquidFillSeriesOption;
};

export type ECOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | LinesSeriesOption
  | PieSeriesOption
  | RadarSeriesOption
  | GaugeSeriesOption
  | LiquidFillSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
  | ScatterSeriesOption
>;

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  PolarComponent,
  GeoComponent,
  ToolboxComponent,
  DataZoomComponent,
  BarChart,
  LineChart,
  LinesChart,
  PieChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
  CustomChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

echarts.use(liquidFillCustomSeriesInstaller);

export default echarts;
