<template>
  <!-- WebGPU 3D渲染容器 -->
  <div class="webgpu-container" ref="webgpuContainer">
    <!-- 3D渲染画布，使用ref绑定到Vue响应式变量 -->
    <div id="canvas" ref="canvas" style="width:100%; height: 100%"></div>
  </div>
</template>

<script setup lang="ts" name="webgpu">
import { ref, onMounted, type Ref } from "vue";
import * as THREE from "three";
//引入性能监视器
import Stats from "three/examples/jsm/libs/stats.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
const canvas = ref<HTMLElement>();
const webgpuContainer = ref<HTMLElement>();
const meshList = ref<THREE.Mesh[]>([]);
onMounted(() => {
  initThree();
});

const initThree = () => {

  //创建一个场景
  const scene = new THREE.Scene();

  //创建2000个网格体
  const mesh = createMesh();

  //设置网格体位置
  mesh.position.set(0, 0, 0);
  //将网格体添加到网格体列表中
  meshList.value.push(mesh);
  //将网格体添加到场景中
  scene.add(mesh);

  //创建一个点光源,参数为颜色默认白色,光照强度默认为1,光照距离默认0为无限远,沿光照距离衰退量默认为2(不随距离衰减时填0)
  const pointLight = new THREE.PointLight(0xffffff, 100, 0, 0);
  // pointLight.intensity = 2; 也可以单独设置光照强度、颜色、距离及衰退量

  //设置点光源位置
  pointLight.position.set(100, 100, 100);

  //实例化一个环境光，参数为颜色默认白色、光照强度默认为1
  const ambientLight = new THREE.AmbientLight(0x404040, 1);

  //添加环境光到场景中
  scene.add(ambientLight);

  //实例化一个平行光，参数为颜色默认白色、光照强度默认为1
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);

  //设置平行光坐标位置，参数为x、y、z坐标值
  directionalLight.position.set(100, 200, 300);

  //设置平行光指向的物体，即光照方向指向该物体，可以不设置，默认指向(0,0,0)
  //注意：对于目标的位置，如果要改为除默认值之外的其他位置，该位置必须被添加到场景（scene）中去。
  directionalLight.target = meshList.value[0]!
  //添加平行光到场景中
  scene.add(directionalLight);

  //添加可视化点光源辅助观察,参数为要模拟的点光源、光源大小、光源颜色
  // const pointLightHelper = new THREE.PointLightHelper(pointLight, 5, 0xffffff);
  //添加点光源辅助可视化到场景中
  // scene.add(pointLightHelper);

  //光源添加到场景中
  // scene.add(pointLight);
  //添加可视化平行光辅助观察，参数为平行光光源、平面尺寸、光源颜色默认为光源颜色
  const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 20, 0xffffff);

  //将可视化平行光辅助观察添加到场景中
  scene.add(directionalLightHelper);

  //设置相机输出的画布尺寸
  const width = canvas?.value?.clientWidth ?? 800;
  const height = canvas?.value?.clientHeight ?? 600;
  // const width = window.innerWidth;
  // const height = window.innerHeight;
  //实例化透视投影相机,参数如下：
  //fov-摄像机视锥体垂直视野角度，水平视角会根据长宽比自动计算
  //aspect-摄像机视锥体长宽比，一般为画布尺寸的宽高比，不可随意设置
  //near-摄像机视锥体近端面(摄像机距离近端面的距离)
  //far-摄像机视锥体远端面(摄像机距离远端面的距离)
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

  //设置相机位置
  camera.position.set(200, 200, 200);

  //设置相机视线（观察目标点的坐标）
  //camera.lookAt(10，20，10);//将相机视线观察xyz具体坐标
  camera.lookAt(meshList.value[0]!.position);//将相机视线观察到网格体的位置

  //实例化一个辅助坐标轴，红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴。
  const axesHelper = new THREE.AxesHelper(200);
  //将辅助坐标轴添加到场景中
  scene.add(axesHelper);

  //创建渲染器，参数为对象，包含antialias是否开启抗锯齿
  const renderer = new THREE.WebGLRenderer({
    antialias: true, // 开启抗锯齿
  });
  //当前屏幕的设备像素比
  console.log(window.devicePixelRatio, "devicePixelRatio");
  //设置渲染器的设备像素比，以避免渲染模糊
  renderer.setPixelRatio(window.devicePixelRatio);

  //设置渲染器的背景颜色，参数为RGB颜色值、透明度
  renderer.setClearColor(0x555555, 1);

  //设置渲染器渲染的尺寸，单位为像素px，这里设置为画布的宽高，确保画布全屏显示
  // renderer.setSize(width, height, false);//参数为宽、高、是否更新样式,防止样式更改
  renderer.setSize(width, height, false);

  //执行渲染
  const isPlay = ref(true);

  //将渲染结果添加到页面中
  canvas?.value?.appendChild(renderer.domElement);

  //创建相机控件
  createControls(camera, renderer);

  //获取动画渲染时间间隔
  const timer = new THREE.Timer();

  //实例化性能监视器
  const stats = new Stats();
  //将性能监视器添加到页面body中,并修改样式
  webgpuContainer?.value?.appendChild(stats.dom);
  stats.dom.style.position = "absolute";
  stats.dom.style.top = "10px";
  stats.dom.style.left = "10px";
  stats.dom.style.zIndex = "100";
  //默认显示fps面板0, 1: ms panel
  stats.showPanel(1); // 0: fps, 1: ms//显示性能监视器的fps面板


  //创建默认GUI配置
  const initConfig = [
    {
      type: 'folder',
      name: '光源',
      items: [{ type: 'number', name: '环境光源强度', object: ambientLight, property: 'intensity', min: 0, max: 10, step: 0.1, onChange: (value: number) => { console.log(value) } },
      { type: 'number', name: '平行光强度', object: directionalLight, property: 'intensity', min: 0, max: 10, step: 0.1, onChange: (value: number) => { console.log(value) } },]
    },
    {
      type: 'folder',
      name: '颜色',
      items: [{ type: 'color', name: '网格体背景颜色', object: mesh.material, property: 'color', onChange: (value: any) => { console.log(value, 'meshColor') } },
      ]
    }, {
      type: 'folder',
      name: '位置',
      items: [
        { type: 'array', name: '网格体X轴', object: mesh.position, property: 'x', config: [0, 20, 40, 60, 80, 100] },
        { type: 'array', name: '网格体Y轴', object: mesh.position, property: 'y', config: [0, 20, 40, 60, 80, 100] },
        { type: 'array', name: '网格体Z轴', object: mesh.position, property: 'z', config: [0, 20, 40, 60, 80, 100] },
        { type: 'object', name: '网格体X轴缩放', object: mesh.scale, property: 'x', config: { 大: 1, 中: 0.5, 小: 0.25 } },
        { type: 'object', name: '网格体Y轴缩放', object: mesh.scale, property: 'y', config: { 大: 1, 中: 0.5, 小: 0.25 } },
        { type: 'object', name: '网格体Z轴缩放', object: mesh.scale, property: 'z', config: { 大: 1, 中: 0.5, 小: 0.25 } },
        { type: 'boolean', name: '网格体旋转', object: isPlay, property: 'value' },]
    }
  ]

  //创建GUI
  const gui = createGUI(initConfig);

  //将GUI添加到页面中
  canvas?.value?.appendChild(gui.domElement);
  gui.domElement.style.position = "absolute";
  gui.domElement.style.top = "10px";
  gui.domElement.style.right = "10px";
  gui.domElement.style.zIndex = "100";
  //启动动画循环渲染

  animate(timer, stats, renderer, scene, camera, isPlay);

  // 监听窗口变化，更新渲染器尺寸
  window.onresize = () => resize(renderer, camera);
};
//创建网格模型
const createMesh = () => {
//给场景添加几何体，比如一个立方体
  //定义一个立方体
  // const geometry = new THREE.BoxGeometry(10, 10, 10);
  //定义一个圆柱体
  // const geometry = new THREE.CylinderGeometry(10,10,10,10);//顶部圆半径、底部圆半径、高度、段数

  //定义一个球体
  // const geometry = new THREE.SphereGeometry(10);//半径

  //定义一个圆锥
  // const geometry = new THREE.ConeGeometry(10,20);//底部圆半径、高度、段数


  //定义一个矩形平面
  // const geometry = new THREE.PlaneGeometry(100,50);//长宽

  //定义一个圆平面
  const geometry =  new THREE.CircleGeometry(10);//半径
  //创建一个材质-基础网格材质，并添加材质颜色和透明度
  //const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
  //创建一个漫反射材质，有光源情况下能看到效果,双面显示(THREE.DoubleSide)
  const material = new THREE.MeshLambertMaterial({ color: 0x00ff00, transparent: true, opacity: 1, side: THREE.DoubleSide });
  //创建一个材质-基础网格材质，并添加材质颜色和透明度
  //const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
  //创建一个漫反射材质，有光源情况下能看到效果
  //const material = new THREE.MeshLambertMaterial({ color: 0x00ff00, transparent: true, opacity: 1 });

  //创建一个高光网格材质,参数为颜色、光泽度(默认30)、镜面色(默认深灰色)
  //const material = new THREE.MeshPhongMaterial({ color: 0x00ff00, shininess: 80, specular: 0x555555 });

  //创建一个网格体-将几何体和材质进行组合
  const mesh = new THREE.Mesh(geometry, material);
  mesh.material.color.set(0x000000); // 设置网格体颜色
  return mesh;
};

//封装动画循环渲染方法
const animate = (timer: THREE.Timer, stats: Stats, renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, isPlay: Ref<boolean>) => {
  // 更新定时器状态
  timer.update();

  // 获取上一帧到当前帧的时间差（秒）
  const delta = timer.getDelta();

  // 使用 delta 进行动画更新
  // console.log(`Delta time: ${delta}s`);
  // const meshRotate = mesh.rotation; // 获取网格体旋转角度
  // console.log(meshRotate, 'meshRotate======');
  if (isPlay.value) {
    meshList.value.map((mesh) => {
      mesh.rotateY(0.01); // � � � 绕Y轴旋转
    });
  }
  // mesh.rotateX(0.01); // � � � 绕X轴旋转
  // mesh.rotateZ(0.01); // � � � 绕Z轴旋转
  stats.update();//更新性能监视器
  renderer.render(scene, camera);
  requestAnimationFrame(animate.bind(null, timer, stats, renderer, scene, camera, isPlay));

};

// 监听窗口变化，更新渲染器尺寸
const resize = (renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) => {
  // 获取当前画布的宽度和高度
  const currentWidth = canvas?.value?.clientWidth ?? 800;
  const currentHeight = canvas?.value?.clientHeight ?? 600;
  // 重新设置渲染器的尺寸
  renderer.setSize(currentWidth, currentHeight, false);
  // 更新相机的纵横比
  camera.aspect = currentWidth / currentHeight;
  // 更新相机的投影矩阵
  camera.updateProjectionMatrix();
};
//封装相机控件的方法
const createControls = (camera: THREE.Camera, renderer: THREE.WebGLRenderer) => {
  //添加相机控件-轨道控制器-实例化相机控件，参数为相机(要改变的相机)和渲染器的dom元素(监控范围，即相机控件的监控范围)
  const controls = new OrbitControls(camera, renderer.domElement);
  //如果OrbitControls改变了相机参数，则重新调用渲染器渲染，才能看到改变结果
  controls.addEventListener("change", () => {
    // console.log("camera changed", camera.position);
    // renderer.render(scene, camera);//添加了动画不需要再更新了
  });
};

// 封装创建GUI的方法
const createGUI = (options: any[]) => {
  //实例化GUI对象
  const gui = new GUI();
  options.forEach((option) => {
    if (option.type === 'folder') {
      const folder = gui.addFolder(option.name);
      folder.close();
      option.items.forEach((item: any) => {
        if (item.type === 'number') {
          folder.add(item.object, item.property, item.min, item.max, item.step).name(item.name || item.property).onChange(item.onChange);
        } else if (item.type === 'color') {
          folder.addColor(item.object, item.property).name(item.name || item.property).onChange(item.onChange);
        } else if (item.type === 'boolean') {
          folder.add(item.object, item.property).name(item.name || item.property).onChange(item.onChange);
        } else if (item.type === 'array') {
          folder.add(item.object, item.property, item.config).name(item.name || item.property).onChange(item.onChange);
        } else if (item.type === 'object') {
          folder.add(item.object, item.property, item.config).name(item.name || item.property).onChange(item.onChange);
        }
      });
      return;
    }
  });

  return gui;
};


</script>

<style lang="scss" scoped>
// 导入当前目录下的index.scss样式文件
@use "./index";
</style>