<template>
  <div class="webgpu-container">
    <canvas id="canvas" ref="canvas" style="width:100%; height: 100%" />
  </div>
</template>
<script setup lang="ts" name="webgpu">
import { Engine3D, View3D, Scene3D, CameraUtil, AtmosphericComponent, webGPUContext, HoverCameraController, Object3D, DirectLight, KelvinUtil, LitMaterial, MeshRenderer, PostProcessingComponent, BitmapTexture2D, GlobalFog, Color } from '@orillusion/core';
import { TerrainGeometry } from '@orillusion/geometry';
import { Stats } from '@orillusion/stats';
import { ref, onMounted } from "vue";
const canvas = ref<HTMLCanvasElement>();
onMounted(() => {
  initEngine3D();
});

const initEngine3D = async () => {
  await Engine3D.init({
    canvasConfig: { canvas: canvas.value }
  });
  let view = new View3D();
  view.scene = new Scene3D();
  view.scene.addComponent(AtmosphericComponent);
  view.scene.addComponent(Stats);

  view.camera = CameraUtil.createCamera3DObject(view.scene);
  view.camera.perspective(60, webGPUContext.aspect, 1, 50000.0);
  view.camera.object3D.z = -15;
  view.camera.object3D.addComponent(HoverCameraController).setCamera(35, -20, 10000);

  Engine3D.startRenderView(view);

  let post = view.scene.addComponent(PostProcessingComponent);
  let fog = post.addPost(GlobalFog);
  fog.start = 2000;
  fog.end = 0;
  fog.fogHeightScale = 0.116;
  fog.density = 0.094;
  fog.ins = 0.1041;
  fog.skyFactor = 0.35;
  fog.overrideSkyFactor = 0.7;

  fog.fogColor = new Color(136 / 255, 215 / 255, 236 / 255, 1);
  fog.fogHeightScale = 0.1;
  fog.falloff = 0.626;
  fog.scatteringExponent = 8;
  fog.dirHeightLine = 6.5;

  createScene(view.scene);
};

const createScene = async (scene: Scene3D) => {
  {
    let sunObj = new Object3D();
    let sunLight = sunObj.addComponent(DirectLight);
    sunLight.lightColor = KelvinUtil.color_temperature_to_rgb(6553);
    sunLight.castShadow = true;
    sunLight.intensity = 4;
    sunObj.transform.rotationX = 50;
    sunObj.transform.rotationY = 50;
    scene.addChild(sunObj);
  }

  //bitmap
  let bitmapTexture = await Engine3D.res.loadTexture('https://cdn.orillusion.com/terrain/test01/bitmap.png');
  let heightTexture = await Engine3D.res.loadTexture('https://cdn.orillusion.com/terrain/test01/height.png');
  let terrainSizeW = 20488;
  let terrainSizeH = 20488;
  let terrainGeometry: TerrainGeometry;
  {
    let mat = new LitMaterial();
    terrainGeometry = new TerrainGeometry(terrainSizeW, terrainSizeH, 2000, 2000);
    terrainGeometry.setHeight(heightTexture as BitmapTexture2D, 5000);
    let floor = new Object3D();
    let mr = floor.addComponent(MeshRenderer);
    mr.geometry = terrainGeometry;
    mat.baseMap = bitmapTexture;
    mr.material = mat;
    scene.addChild(floor);
  }
}
</script>
<style lang="scss" scoped>
@use "./index";
</style>
