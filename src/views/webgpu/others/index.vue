<template>
  <!-- WebGPU 3D渲染容器 -->
  <div class="webgpu-container">
    <!-- 3D渲染画布，使用ref绑定到Vue响应式变量 -->
    <canvas id="canvas" ref="canvas" style="width:100%; height: 100%" />
  </div>
</template>

<script setup lang="ts" name="webgpu">
// 导入Orillusion 3D引擎相关模块
import {
  Engine3D,        // 3D引擎核心类
  View3D,          // 3D视图
  Scene3D,         // 3D场景
  CameraUtil,      // 相机工具类
  AtmosphericComponent, // 大气效果组件
  webGPUContext,   // WebGPU上下文
  HoverCameraController, // 悬停相机控制器
  Object3D,        // 3D对象基类
  DirectLight,     // 定向光源
  KelvinUtil,      // 色温工具类
  LitMaterial,     // 光照材质
  MeshRenderer,    // 网格渲染器
  PostProcessingComponent, // 后处理组件
  BitmapTexture2D, // 位图纹理
  GlobalFog,       // 全局雾效
  Color            // 颜色类
} from '@orillusion/core';

// 导入地形几何体模块
import { TerrainGeometry } from '@orillusion/geometry';

// 导入性能统计模块
import { Stats } from '@orillusion/stats';

// 导入Vue相关模块
import { ref, onMounted } from "vue";

// 创建canvas元素的Vue响应式引用
const canvas = ref<HTMLCanvasElement>();

// 组件挂载后执行初始化
onMounted(() => {
  // 调用3D引擎初始化函数
  initEngine3D();
});

/**
 * 初始化3D引擎
 * 异步函数，负责设置WebGPU渲染环境
 */
const initEngine3D = async () => {
  // 初始化Orillusion 3D引擎，传入canvas配置
  await Engine3D.init({
    canvasConfig: { canvas: canvas.value }
  });

  // 创建3D视图
  let view = new View3D();

  // 创建3D场景并赋值给视图
  view.scene = new Scene3D();

  // 为场景添加大气效果组件
  view.scene.addComponent(AtmosphericComponent);

  // 为场景添加性能统计组件
  const stats = view.scene.addComponent(Stats);

  // 创建相机对象并设置到视图中
  view.camera = CameraUtil.createCamera3DObject(view.scene);

  // 设置相机透视投影参数：视野角度60度，宽高比，近裁剪面1，远裁剪面50000
  view.camera.perspective(60, webGPUContext.aspect, 1, 50000.0);

  // 设置相机Z轴位置（向后移动）
  view.camera.object3D.z = -15;

  // 为相机添加悬停控制器，设置初始角度和距离
  view.camera.object3D.addComponent(HoverCameraController).setCamera(35, -20, 10000);

  // 开始渲染视图
  Engine3D.startRenderView(view);
  // 将性能统计面板移动到canvas的右上角
  if (stats.container && canvas.value) {
    // 设置Stats容器的样式，使其位于canvas的右上角
    stats.container.style.position = 'absolute';
    stats.container.style.top = '10px';
    stats.container.style.right = '10px';
    stats.container.style.left = 'auto';
    stats.container.style.bottom = 'auto';

    // 确保Stats容器在canvas内部
    canvas.value.parentElement?.appendChild(stats.container);
  }
  // 添加后处理组件
  let post = view.scene.addComponent(PostProcessingComponent);

  // 添加全局雾效后处理
  let fog = post.addPost(GlobalFog);

  // 设置雾效参数
  fog.start = 2000;          // 雾效开始距离
  fog.end = 0;              // 雾效结束距离
  fog.fogHeightScale = 0.116; // 雾效高度缩放
  fog.density = 0.094;      // 雾效密度
  fog.ins = 0.1041;         // 雾效强度
  fog.skyFactor = 0.35;     // 天空因子
  fog.overrideSkyFactor = 0.7; // 覆盖天空因子

  // 设置雾效颜色（浅蓝色）
  fog.fogColor = new Color(136 / 255, 215 / 255, 236 / 255, 1);

  // 设置雾效高度缩放
  fog.fogHeightScale = 0.1;

  // 设置雾效衰减
  fog.falloff = 0.626;

  // 设置散射指数
  fog.scatteringExponent = 8;

  // 设置方向高度线
  fog.dirHeightLine = 6.5;

  // 调用场景创建函数
  createScene(view.scene);
};

/**
 * 创建3D场景内容
 * @param scene - 要添加内容的3D场景对象
 */
const createScene = async (scene: Scene3D) => {
  // 创建太阳光源
  {
    // 创建太阳对象
    let sunObj = new Object3D();

    // 为太阳对象添加定向光源组件
    let sunLight = sunObj.addComponent(DirectLight);

    // 设置光源颜色（使用色温转换，6553K接近日光色温）
    sunLight.lightColor = KelvinUtil.color_temperature_to_rgb(6553);

    // 启用阴影投射
    sunLight.castShadow = true;

    // 设置光源强度
    sunLight.intensity = 4;

    // 设置太阳对象的旋转角度
    sunObj.transform.rotationX = 50; // X轴旋转50度
    sunObj.transform.rotationY = 50; // Y轴旋转50度

    // 将太阳对象添加到场景中
    scene.addChild(sunObj);
  }

  // 加载地形纹理
  // 加载地形位图纹理（地形表面贴图）
  let bitmapTexture = await Engine3D.res.loadTexture('https://cdn.orillusion.com/terrain/test01/bitmap.png');

  // 加载地形高度图纹理（用于地形高度变化）
  let heightTexture = await Engine3D.res.loadTexture('https://cdn.orillusion.com/terrain/test01/height.png');

  // 定义地形尺寸
  let terrainSizeW = 20488; // 地形宽度
  let terrainSizeH = 20488; // 地形高度

  // 声明地形几何体变量
  let terrainGeometry: TerrainGeometry;

  // 创建地形
  {
    // 创建光照材质
    let mat = new LitMaterial();

    // 创建地形几何体：宽度、高度、分段数（2000x2000个顶点）
    terrainGeometry = new TerrainGeometry(terrainSizeW, terrainSizeH, 2000, 2000);

    // 设置地形高度：使用高度图纹理，最大高度5000单位
    terrainGeometry.setHeight(heightTexture as BitmapTexture2D, 5000);

    // 创建地板对象
    let floor = new Object3D();

    // 为地板对象添加网格渲染器组件
    let mr = floor.addComponent(MeshRenderer);

    // 设置渲染器的几何体为地形几何体
    mr.geometry = terrainGeometry;

    // 设置材质的基底贴图为地形位图纹理
    mat.baseMap = bitmapTexture;

    // 设置渲染器的材质
    mr.material = mat;

    // 将地板对象添加到场景中
    scene.addChild(floor);
  }
}
</script>

<style lang="scss" scoped>
// 导入当前目录下的index.scss样式文件
@use "./index";
</style>