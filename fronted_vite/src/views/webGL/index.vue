<template>
  <!-- WebGPU 3D渲染容器 -->
  <div class="webgpu-container" ref="webGLContainer">
    <!-- 3D渲染画布，使用ref绑定到Vue响应式变量 -->
    <div id="canvas" ref="canvas" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script setup lang="ts" name="webgpu">
import { ref, onMounted, onBeforeUnmount, type Ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import * as THREE from "three";
//引入性能监视器
import Stats from "three/examples/jsm/libs/stats.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import earthTexture from "@/assets/webGL/earth.png";
import facebook from "@/assets/webGL/facebook.png";
const canvas = ref<HTMLElement>();
const webGLContainer = ref<HTMLElement>();
const meshList = ref<THREE.Object3D[]>([]);
let animationFrameId: number | undefined;
let isDestroyed = false;

type ThreeRuntime = {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  stats: Stats;
  resizeHandler: () => void;
};

let threeRuntime: ThreeRuntime | null = null;

type GuiBaseItem = {
  name: string;
  object: object;
  property: string;
  onChange?: (value: unknown) => void;
};
type GuiNumberItem = GuiBaseItem & {
  type: "number";
  min: number;
  max: number;
  step: number;
};
type GuiItem =
  | GuiNumberItem
  | (GuiBaseItem & { type: "color" })
  | (GuiBaseItem & { type: "boolean" })
  | (GuiBaseItem & { type: "array"; config: number[] })
  | (GuiBaseItem & { type: "object"; config: Record<string, number> });
type GuiFolder = {
  type: "folder";
  name: string;
  items: GuiItem[];
};

onMounted(() => {
  isDestroyed = false;
  initThree();
});

onBeforeUnmount(() => {
  isDestroyed = true;
  destroyThree();
});

onBeforeRouteLeave(() => {
  isDestroyed = true;
  destroyThree();
});
//封装初始化threejs的方法
const initThree = async () => {
  //创建一个场景
  const scene = new THREE.Scene();

  //创建2000个网格体
  // const mesh = createMesh();
  //加载模型
  const model = await loadGLTFModel('/models/work.glb');
  if (isDestroyed) {
    disposeObject3D(model);
    return;
  }
  meshList.value.push(model);
  model.position.set(0, 0, 0);
  scene.add(model);
  //创建一个组对象，并将网格体添加到组中
  //   const group = createGroup([]);
  //   const group1 = createGroup([]);
  //    const group2= createGroup([]);

  //   for (let index = 0; index < 5; index++) {
  //     const mesh = createMesh();
  //     mesh.position.x=100*index;
  //     mesh.geometry.scale(1, 3, 1);
  //     mesh.name = `mesh1${index}`;
  //     mesh.material.visible = false;//隐藏mesh1对象的材质
  //     // mesh.visible = true;//显示mesh1对象的材质
  //     group1.add(mesh);
  //     group1.name = "group1";
  //   }

  //   for (let index = 0; index < 5; index++) {
  //     const mesh = createMesh();
  //     mesh.position.x=100*index;
  //     mesh.position.y=100;
  //      mesh.name = `mesh2${index}`;
  //     group2.add(mesh);
  //     group2.name = "group2";
  //   }
  //   group.add(group1,group2);
  //   group.name = "group";
  //   group1.position.x=100;//本地坐标
  //   group.position.x=150//世界坐标
  //   const worldPosition = new THREE.Vector3(0, 0, 0);//新建一个三维向量对象，用于存储世界坐标
  //   group1.getWorldPosition(worldPosition);//读取group1的世界坐标，存储到worldPosition中
  //   console.log(worldPosition, 'worldPosition======');
  // group1.add(new THREE.AxesHelper(100));//给group1添加一个坐标轴辅助线
  // group2.add(new THREE.AxesHelper(100));//给group2添加一个坐标轴辅助线
  // group.remove(group1);//从group中移除group1对象
  // group.remove(group2);//从group中移除group2对象
  // group.remove(group1,group2);//从group中移除group1和group2对象
  // group1.translateX(-150);//group1平移50单位
  // group1.rotateY(Math.PI / 2);//group1绕Y轴旋转90度
  // group1.visible = false;//隐藏group1对象
  // group1.visible = true;//显示group1对象

  //   group.traverse((object) => {
  //     if (object instanceof THREE.Mesh) {
  //       console.log(object.name, 'object.name======');
  //       setMeshColor(object, 0xffffff); // 随机设置颜色
  //     }
  //   });
  //   const mesh22 = group.getObjectByName("mesh22") as THREE.Mesh | undefined;
  //   setMeshColor(mesh22, 0xffff00); // 将mesh2的颜色设置为黄色
  // const mesh2 = createMesh();
  // //复制mesh的位置到mesh2
  // mesh2.position.copy(mesh.position)

  //使用顶点坐标创建的网格体
  // const mesh = createMeshWithVertices();

  //创建点模型
  // const mesh = createPoints();

  //创建线模型
  // const mesh = createLine();

  //设置网格体位置
  // mesh.position.set(0, 0, 0);
  // mesh.add(new THREE.AxesHelper(100));//给mesh添加一个坐标轴辅助线
  // mesh.position.set(100, 0, 0);//设置mesh的位置
  // mesh.geometry.translate(25,0,0);//几何体平移25单位,改变局部坐标
  //实例化三维向量
  // const vector3 = new THREE.Vector3(100, 100, 100);
  //克隆一份
  // const vector3Clone = vector3.clone();
  //复制一份
  // const vector3Copy = new THREE.Vector3(20, 20, 20);
  //  vector3Copy.copy(vector3); // 将vector3的值复制到vector3Copy中

  //向量归一化
  // vector3.normalize();
  // mesh.translateOnAxis(vector3, 100); // 沿着向量方向平移100单位

  //实例化一个Euler欧拉角对象，参数为绕x、y、z轴旋转的角度值，单位为弧度,这里绕y轴旋转90度(Math.PI / 2)，绕x轴和z轴不旋转
  // const euler = new THREE.Euler(0, Math.PI / 2, 0);
  //将欧拉角转换为四元数
  // const quaternion = new THREE.Quaternion().setFromEuler(euler);
  //将四元数应用到网格体上，旋转网格体
  // mesh.applyQuaternion(quaternion);

  //将网格体添加到网格体列表中
  // meshList.value.push(mesh);
  //将网格体添加到场景中
  // scene.add(mesh);
  //将组对象添加到场景中
  // scene.add(group);
  //创建光源
  const light = createLight();
  //添加点光源到场景中
  scene.add(light.pointLight);
  //添加环境光到场景中
  scene.add(light.ambientLight);
  // scene.remove(ambientLight);//从场景中移除环境光对象

  //添加平行光到场景中
  scene.add(light.directionalLight);

  //光源添加到场景中
  // scene.add(pointLight);
  //创建平行光辅助观察
  const directionalLightHelper = createDirectionalLightHelper(light.directionalLight);

  //将可视化平行光辅助观察添加到场景中
  scene.add(directionalLightHelper);

  //添加网格辅助线，参数为网格尺寸、网格线数量、网格线颜色默认为网格线颜色、网格线颜色默认为网格线颜色
  const gridHelper = new THREE.GridHelper(200, 10, 0x444, 0xffffff);
  //将网格辅助线添加到场景中
  scene.add(gridHelper);

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
  camera.position.set(10, 10, 10);

  //设置相机视线（观察目标点的坐标）
  //camera.lookAt(10，20，10);//将相机视线观察xyz具体坐标
  camera.lookAt(meshList.value[0]!.position); //将相机视线观察到网格体的位置

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
  // renderer.setPixelRatio(window.devicePixelRatio);

  //设置渲染器的背景颜色，参数为RGB颜色值、透明度
  renderer.setClearColor(0x555555, 1);

  //设置渲染器编码方式和gltf保持一致，解决渲染颜色偏差的问题
  renderer.outputColorSpace = THREE.SRGBColorSpace

  //设置渲染器渲染的尺寸，单位为像素px，这里设置为画布的宽高，确保画布全屏显示
  // renderer.setSize(width, height, false);//参数为宽、高、是否更新样式,防止样式更改
  renderer.setSize(width, height, false);

  //执行渲染动画
  const isPlay = ref(false);

  //将渲染结果添加到页面中
  canvas?.value?.appendChild(renderer.domElement);

  //创建相机控件
  const controls = createControls(camera, renderer);

  //获取动画渲染时间间隔
  const timer = new THREE.Timer();

  //实例化性能监视器
  const stats = new Stats();
  //将性能监视器添加到页面body中,并修改样式
  webGLContainer?.value?.appendChild(stats.dom);
  stats.dom.style.position = "absolute";
  stats.dom.style.top = "10px";
  stats.dom.style.left = "10px";
  stats.dom.style.zIndex = "100";
  //默认显示fps面板0, 1: ms panel
  stats.showPanel(1); // 0: fps, 1: ms//显示性能监视器的fps面板


  //创建GUI
  // const gui = createGUI(mesh, light, isPlay);

  //将GUI添加到页面中
  // canvas?.value?.appendChild(gui.domElement);
  // gui.domElement.style.position = "absolute";
  // gui.domElement.style.top = "10px";
  // gui.domElement.style.right = "10px";
  // gui.domElement.style.zIndex = "100";
  //启动动画循环渲染

  animate(timer, stats, renderer, scene, camera, isPlay);

  // 监听窗口变化，更新渲染器尺寸
  const resizeHandler = () => resize(renderer, camera);
  window.addEventListener("resize", resizeHandler);
  threeRuntime = {
    scene,
    renderer,
    controls,
    stats,
    resizeHandler,
  };
};

const disposeMaterial = (material?: THREE.Material | THREE.Material[]) => {
  if (!material) return;
  const materials = Array.isArray(material) ? material : [material];
  materials.forEach(item => {
    Object.values(item as unknown as Record<string, unknown>).forEach(value => {
      if (value instanceof THREE.Texture) {
        value.dispose();
      }
    });
    item.dispose();
  });
};

const disposeObject3D = (object: THREE.Object3D) => {
  object.traverse(child => {
    const disposable = child as THREE.Object3D & {
      geometry?: THREE.BufferGeometry;
      material?: THREE.Material | THREE.Material[];
    };
    disposable.geometry?.dispose();
    disposeMaterial(disposable.material);
  });
};

const destroyThree = () => {
  if (animationFrameId !== undefined) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = undefined;
  }

  if (!threeRuntime) {
    meshList.value = [];
    return;
  }

  window.removeEventListener("resize", threeRuntime.resizeHandler);
  threeRuntime.controls.dispose();
  threeRuntime.stats.dom.remove();
  disposeObject3D(threeRuntime.scene);
  threeRuntime.scene.clear();
  threeRuntime.renderer.renderLists.dispose();
  threeRuntime.renderer.dispose();
  threeRuntime.renderer.forceContextLoss();
  threeRuntime.renderer.domElement.remove();
  meshList.value = [];
  threeRuntime = null;
};

//加载gltf三维模型
const loadGLTFModel = async (url: string): Promise<THREE.Object3D> => {

  const loader = new GLTFLoader();//实例化GLTFLoader加载器
  const gltf = await loader.loadAsync(url);
  //递归遍历每一个节点
  gltf.scene.traverse((node) => {
    console.log(node, '节点=========');

  });
  console.log(gltf.scene, 'gltf.scene======');
  //查找名字为 face的物体
  const face = gltf.scene.getObjectByName('face');
  console.log(face, 'face======');
  return gltf.scene;
}

//创建光源
const createLight = () => {
  //创建一个点光源,参数为颜色默认白色,光照强度默认为1,光照距离默认0为无限远,沿光照距离衰退量默认为2(不随距离衰减时填0)
  const pointLight = new THREE.PointLight(0xffffff, 10, 0, 0);
  // pointLight.intensity = 2; 也可以单独设置光照强度、颜色、距离及衰退量

  //设置点光源位置
  pointLight.position.set(100, 100, 100);

  //实例化一个环境光，参数为颜色默认白色、光照强度默认为1
  const ambientLight = new THREE.AmbientLight(0x404040, 1);
  //实例化一个平行光，参数为颜色默认白色、光照强度默认为1
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);

  //设置平行光坐标位置，参数为x、y、z坐标值
  directionalLight.position.set(100, 200, 300);

  //设置平行光指向的物体，即光照方向指向该物体，可以不设置，默认指向(0,0,0)
  //注意：对于目标的位置，如果要改为除默认值之外的其他位置，该位置必须被添加到场景（scene）中去。
  directionalLight.target = meshList.value[0]!;
  return {
    pointLight,
    ambientLight,
    directionalLight,
  }

}
//创建光源辅助观察
const createDirectionalLightHelper = (directionalLight: THREE.DirectionalLight) => {
  //创建可视化平行光辅助观察,参数为要模拟的平行光、平面尺寸、光源颜色默认为光源颜色
  //添加可视化平行光辅助观察，参数为平行光光源、平面尺寸、光源颜色默认为光源颜色
  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    20,
    0xffffff,
  );
  //添加可视化点光源辅助观察,参数为要模拟的点光源、光源大小、光源颜色
  // const pointLightHelper = new THREE.PointLightHelper(pointLight, 5, 0xffffff);
  return directionalLightHelper;
}
//创建网格模型
const createMesh = () => {
  //给场景添加几何体，比如一个立方体
  //定义一个立方体
  // const geometry = new THREE.BoxGeometry(50, 40, 30);
  //定义一个圆柱体
  // const geometry = new THREE.CylinderGeometry(10,10,10,10);//顶部圆半径、底部圆半径、高度、段数

  //定义一个球体
  // const geometry = new THREE.SphereGeometry(100, 48, 48); //半径

  //定义一个圆锥
  // const geometry = new THREE.ConeGeometry(10,20);//底部圆半径、高度、段数

  //定义一个矩形平面,前两个参数为宽高，后两个参数为宽高细分段数，细分段数越多，平面越平滑，默认为1
  const geometry = new THREE.PlaneGeometry(200, 150, 2, 1); //长宽

  //定义一个圆平面
  // const geometry = new THREE.CircleGeometry(100);//半径

  //创建一个材质-基础网格材质，并添加材质颜色和透明度
  //const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });

  //创建纹理对象
  const texture = createTexture(facebook);

  //创建一个漫反射材质，有光源情况下能看到效果,双面显示(THREE.DoubleSide),线框显示(wireframe: true)
  const material = new THREE.MeshLambertMaterial({
    transparent: true,
    // opacity: 1,
    // map: texture,//设置材质的颜色贴图
    // side: THREE.DoubleSide,//双面显示
    // wireframe: true,//线框显示
  });
  material.map = texture;
  //创建一个颜色对象，写法1，参数为十六进制颜色值
  // const color = new THREE.Color(0x00ff00);
  //创建一个颜色对象，写法2，参数为RGB颜色值，范围0-1
  // const color = new THREE.Color(0, 1, 0);
  //创建一个颜色对象，写法3，参数为CSS颜色字符串
  // const color = new THREE.Color("rgb(0,255,0)");

  // material.color = color; // 设置材质颜色

  // material.color.r = 1; // 设置材质颜色的红色分量为0.5
  // material.color.g = 1; // 设置材质颜色的绿色分量为1
  // material.color.b = 1; // 设置材质颜色的蓝色分量为0

  //创建一个材质-基础网格材质，并添加材质颜色和透明度
  //const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
  //创建一个漫反射材质，有光源情况下能看到效果
  //const material = new THREE.MeshLambertMaterial({ color: 0x00ff00, transparent: true, opacity: 1 });

  //创建一个高光网格材质,参数为颜色、光泽度(默认30)、镜面色(默认深灰色)
  //const material = new THREE.MeshPhongMaterial({ color: 0x00ff00, shininess: 80, specular: 0x555555 });

  //创建一个网格体模型-将几何体和材质进行组合
  const mesh = new THREE.Mesh(geometry, material);
  // const mesh2 = new THREE.Mesh(geometry, material);
  // mesh2.position.set(100, 0, 0);
  // mesh.material.color.set(0x000000); // 重新设置网格体颜色等价于material.color.set(0x000000)
  // mesh2.material.color.set(0x000000); // 所有使用同一个材质的网格体都会改变颜色

  //克隆一个网格体
  // const mesh2 = mesh.clone(); //此处克隆的网格体的材质和几何体仍是共享的，需单独再克隆材质和几何体才不是共享的
  //克隆几何体
  // mesh2.geometry = mesh.geometry.clone();
  //克隆材质
  // mesh2.material = mesh.material.clone();

  // mesh2.position.set(100, 0, 0);
  return mesh;
};

//创建纹理对象
const createTexture = (url: string) => {
  //创建纹理加载器
  const textureLoader = new THREE.TextureLoader();

  //加载纹理地图
  // const texture = textureLoader.load(earthTexture,(texture) => {
  //     console.log("纹理加载成功", texture);
  //   },
  //   // onProgress - 加载进度回调（可选）
  //   (xhr) => {
  //     console.log(`加载进度: ${(xhr.loaded / xhr.total * 100)}%`);
  //   },
  //   // onError - 加载失败回调
  //   (error) => {
  //     console.error("纹理加载失败:", error);
  //   });

  const texture = textureLoader.load(
    url,
    (texture) => {
      console.log("纹理加载成功", texture);
    },
    // onProgress - 加载进度回调（可选）
    (xhr) => {
      console.log(`加载进度: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    // onError - 加载失败回调
    (error) => {
      console.error("纹理加载失败:", error);
    },
  );
  //改变UV映射方式，设置纹理阵列模式，开启纹理重复
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  //设置纹理缩放，X轴重复20次，Y轴重复15次
  texture.repeat.set(4, 3);

  //贴图偏移，X轴（U方向）偏移0.5，Y轴（V方向）偏移0.5
  texture.offset.set(0.5, 0.5);
  console.log(texture, "texture=============<");
  // textureAnimation(texture);
  return texture;
};
//创建组
const createGroup = (meshList: THREE.Mesh[]) => {
  //创建一个组对象
  const group = new THREE.Group();
  //将网格体添加到组中
  meshList.length > 0 && group.add(...meshList);
  return group;
};

// 安全设置网格材质颜色，兼容 Material | Material[]
const setMeshColor = (mesh?: THREE.Mesh | null, color?: number) => {
  if (!mesh || color === undefined) return;
  const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
  if (!mat) return;
  if (Array.isArray(mat)) {
    mat.forEach((m) => {
      const mm = m as THREE.MeshLambertMaterial;
      (mm.color as unknown as { set?: (v: number) => void })?.set?.(color);
    });
  } else {
    const mm = mat as THREE.MeshLambertMaterial;
    (mm.color as unknown as { set?: (v: number) => void })?.set?.(color);
  }
};

const scaleNum = ref(1);
// true 表示正在放大，false 表示正在缩小
const scaleIncreasing = ref(true);

//封装纹理动画方法
const textureAnimation = (texture: THREE.Texture) => {
  // 纹理动画
  texture.offset.x += 0.005;
  texture.offset.y += 0.005;
  if (texture.offset.x > 1) {
    texture.offset.x = 0;
  }
  if (texture.offset.y > 1) {
    texture.offset.y = 0;
  }
  requestAnimationFrame(
    textureAnimation.bind(null, texture),
  );
};


//封装动画循环渲染方法
const animate = (
  timer: THREE.Timer,
  stats: Stats,
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  isPlay: Ref<boolean>,
) => {
  if (isDestroyed) return;
  // 更新定时器状态
  timer.update();

  // 获取上一帧到当前帧的时间差（秒）
  const delta = timer.getDelta();
  void delta;

  // 使用 delta 进行动画更新
  // console.log(`Delta time: ${delta}s`);
  // const meshRotate = mesh.rotation; // 获取网格体旋转角度
  // console.log(meshRotate, 'meshRotate======');
  if (isPlay.value) {
    meshList.value.map((mesh) => {
      // mesh.rotateY(0.01); // � � � 绕Y轴旋转
      // 在 1 到 5 范围内来回变化
      // if (scaleIncreasing.value) {
      //   scaleNum.value += 0.01;
      //   if (scaleNum.value >= 2) {
      //     scaleNum.value = 2;
      //     scaleIncreasing.value = false;
      //   }
      // } else {
      //   scaleNum.value -= 0.01;
      //   if (scaleNum.value <= -2) {
      //     scaleNum.value = -2;
      //     scaleIncreasing.value = true;
      //   }
      // }
      console.log(mesh, "mesh======");

      // mesh.scale.set(scaleNum.value, scaleNum.value, scaleNum.value); // 设置网格体缩放
      // mesh.rotateY(scaleNum.value); // � � � 绕Y轴旋转
      // mesh.rotateX(scaleNum.value); // � � � 绕X轴旋转
      mesh.translateX(scaleNum.value); // 沿X轴平移
    });
  }
  // mesh.rotateX(0.01); // � � � 绕X轴旋转
  // mesh.rotateZ(0.01); // � � � 绕Z轴旋转
  stats.update(); //更新性能监视器
  renderer.render(scene, camera);
  animationFrameId = requestAnimationFrame(() => animate(timer, stats, renderer, scene, camera, isPlay));
};

// 监听窗口变化，更新渲染器尺寸
const resize = (
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
) => {
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
const createControls = (
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
) => {
  //添加相机控件-轨道控制器-实例化相机控件，参数为相机(要改变的相机)和渲染器的dom元素(监控范围，即相机控件的监控范围)
  const controls = new OrbitControls(camera, renderer.domElement);
  //如果OrbitControls改变了相机参数，则重新调用渲染器渲染，才能看到改变结果
  controls.addEventListener("change", () => {
    // console.log("camera changed", camera.position);
    // renderer.render(scene, camera);//添加了动画不需要再更新了
  });
  return controls;
};

// 封装创建GUI的方法
const createGUI = (mesh: THREE.Mesh, light: ReturnType<typeof createLight>, isPlay: Ref<boolean>) => {
  //创建默认GUI配置
  const options: GuiFolder[] = [
    {
      type: "folder",
      name: "光源",
      items: [
        {
          type: "number",
          name: "环境光源强度",
          object: light.ambientLight,
          property: "intensity",
          min: 0,
          max: 10,
          step: 0.1,
          onChange: (value: unknown) => {
            console.log(value);
          },
        },
        {
          type: "number",
          name: "平行光强度",
          object: light.directionalLight,
          property: "intensity",
          min: 0,
          max: 10,
          step: 0.1,
          onChange: (value: unknown) => {
            console.log(value);
          },
        },
      ],
    },
    {
      type: "folder",
      name: "颜色",
      items: [
        {
          type: "color",
          name: "网格体背景颜色",
          object: mesh.material,
          property: "color",
          onChange: (value: unknown) => {
            console.log(value, "meshColor");
          },
        },
      ],
    },
    {
      type: "folder",
      name: "位置",
      items: [
        {
          type: "array",
          name: "网格体X轴",
          object: mesh.position,
          property: "x",
          config: [0, 20, 40, 60, 80, 100],
        },
        {
          type: "array",
          name: "网格体Y轴",
          object: mesh.position,
          property: "y",
          config: [0, 20, 40, 60, 80, 100],
        },
        {
          type: "array",
          name: "网格体Z轴",
          object: mesh.position,
          property: "z",
          config: [0, 20, 40, 60, 80, 100],
        },
        {
          type: "object",
          name: "网格体X轴缩放",
          object: mesh.scale,
          property: "x",
          config: { 大: 1, 中: 0.5, 小: 0.25 },
        },
        {
          type: "object",
          name: "网格体Y轴缩放",
          object: mesh.scale,
          property: "y",
          config: { 大: 1, 中: 0.5, 小: 0.25 },
        },
        {
          type: "object",
          name: "网格体Z轴缩放",
          object: mesh.scale,
          property: "z",
          config: { 大: 1, 中: 0.5, 小: 0.25 },
        },
        {
          type: "boolean",
          name: "网格体旋转",
          object: isPlay,
          property: "value",
        },
      ],
    },
  ];

  //实例化GUI对象
  const gui = new GUI();
  options.forEach((option) => {
    if (option.type === "folder") {
      const folder = gui.addFolder(option.name);
      folder.close();
      option.items.forEach(item => {
        const target = item.object as Record<string, unknown>;
        const onChange = item.onChange ?? (() => undefined);
        const addControl = folder.add as unknown as (
          object: Record<string, unknown>,
          property: string,
          minOrOptions?: unknown,
          max?: unknown,
          step?: unknown
        ) => { name: (name: string) => { onChange: (callback: (value: unknown) => void) => unknown } };
        const addColor = folder.addColor as unknown as (
          object: Record<string, unknown>,
          property: string
        ) => { name: (name: string) => { onChange: (callback: (value: unknown) => void) => unknown } };
        if (item.type === "number") {
          addControl(target, item.property, item.min, item.max, item.step)
            .name(item.name || item.property)
            .onChange(onChange);
        } else if (item.type === "color") {
          addColor(target, item.property)
            .name(item.name || item.property)
            .onChange(onChange);
        } else if (item.type === "boolean") {
          addControl(target, item.property)
            .name(item.name || item.property)
            .onChange(onChange);
        } else if (item.type === "array") {
          addControl(target, item.property, item.config)
            .name(item.name || item.property)
            .onChange(onChange);
        } else if (item.type === "object") {
          addControl(target, item.property, item.config)
            .name(item.name || item.property)
            .onChange(onChange);
        }
      });
      return;
    }
  });

  return gui;
};
//创建缓冲几何体，使用顶点坐标数据创建三角形
const createBufferGeometry = () => {
  //1.创建空几何体
  const geometry = new THREE.BufferGeometry();
  //2.添加顶点数据，使用js的Float32Array类型化数组创建一组xyz坐标数据，作为几何体的顶点数据
  const vertices = new Float32Array([
    //数组里面编写顶点坐标数据
    0,
    0,
    0, //第一个三角形
    100,
    0,
    0,
    100,
    100,
    0,

    100,
    100,
    0, //第二个三角形
    0,
    100,
    0,
    0,
    0,
    0,
  ]);
  //通过threejs的属性缓冲对象BufferAttribute表示几何体顶点数据
  //定义属性缓冲对象，参数为类型化数组，和几个数据为一组表示一个顶点，3则代表3个数据为一组，表示一个顶点
  const attribute = new THREE.BufferAttribute(vertices, 3);
  //设置几何体attributes属性的position属性的位置属性，绑定缓冲对象到几何体
  //设置几何体顶点位置属性
  geometry.attributes.position = attribute;
  return geometry;
};

//创建缓冲几何体，使用顶点坐标数据+顶点索引创建三角形
const createBufferGeometryWithIndex = () => {
  //1.创建空几何体
  const geometry = new THREE.BufferGeometry();
  //2.添加矩形顶点数据，使用js的Float32Array类型化数组创建一组xyz坐标数据，作为几何体的顶点数据
  const vertices = new Float32Array([
    //数组里面编写顶点坐标数据
    0,
    0,
    0, //索引  0
    100,
    0,
    0, //索引  1
    100,
    100,
    0, //索引  2
    0,
    100,
    0, //索引  3
  ]);
  //通过threejs的属性缓冲对象BufferAttribute表示几何体顶点数据
  //定义属性缓冲对象，参数为类型化数组，和几个数据为一组表示一个顶点，3则代表3个数据为一组，表示一个顶点
  const attribute = new THREE.BufferAttribute(vertices, 3);

  //定义几何体uv坐标数据，用来映射纹理坐标，相当于贴图的坐标
  const uv = new Float32Array([
    0,
    0, //索引  0
    0.5,
    0, //索引  1
    0.5,
    1, //索引  2
    0,
    1, //索引  3
  ]);
  //设置几何体attributes属性的uv属性的位置属性，绑定缓冲对象到几何体
  //设置几何体uv坐标属性，2个数据为一组，表示一个顶点
  geometry.attributes.uv = new THREE.BufferAttribute(uv, 2);

  //设置几何体attributes属性的position属性的位置属性，绑定缓冲对象到几何体
  //设置几何体顶点位置属性
  geometry.attributes.position = attribute;

  //创建顶点法向量
  const normals = new Float32Array([
    0,
    0,
    1, //顶点1的法向量  索引  0
    100,
    0,
    1, //顶点2的法向量  索引  1
    100,
    100,
    1, //顶点3的法向量  索引  2
    0,
    100,
    1, //顶点4的法向量  索引  3
  ]);

  //定义几何体顶点法线数据
  geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);

  const normalAttribute = new THREE.BufferAttribute(normals, 3);
  geometry.attributes.normal = normalAttribute;
  //BufferAttribute定义顶点索引.index数据
  //通过js的Uint16Array类型化数组创建一组索引数据，作为几何体的顶点索引数据
  const indexes = new Uint16Array([0, 1, 2, 0, 2, 3]);
  //设置几何体顶点索引属性，绑定索引到几何体,参数为索引数组，1则代表1个数据为一组，表示一个顶点
  geometry.index = new THREE.BufferAttribute(indexes, 1);

  return geometry;
};

//创建点模型
const createPoints = () => {
  //实例化一个缓冲几何体对象
  const geometry = createBufferGeometry();
  //实例化一个点模型材质，参数为颜色和点的大小
  const material = new THREE.PointsMaterial({ color: 0x00ff00, size: 20 });

  //实例化一个点模型，参数为缓冲几何体和点模型材质
  const points = new THREE.Points(geometry, material);
  return points;
};

//创建线模型
const createLine = () => {
  //实例化一个缓冲几何体对象
  const geometry = createBufferGeometry();
  //实例化一个线模型材质，参数为颜色和线的宽度
  const material = new THREE.LineBasicMaterial({
    color: 0x00ff00,
    linewidth: 20,
  });

  //实例化一个线模型，参数为缓冲几何体和线模型材质，LineBasicMaterial线基础材质
  const line = new THREE.Line(geometry, material);
  void line;

  //LineLoop 线模型，线模型成环
  const lineLoop = new THREE.LineLoop(geometry, material);
  void lineLoop;

  //LineSegments 线模型，线模型成段
  const lineSegments = new THREE.LineSegments(geometry, material);

  return lineSegments;
};

//使用顶点坐标来创建网格模型
const createMeshWithVertices = () => {
  //实例化一个缓冲几何体对象
  const geometry = createBufferGeometryWithIndex();
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(earthTexture);

  //实例化一个网格模型材质，参数为颜色
  const material = new THREE.MeshLambertMaterial({
    // color: 0x00ff00,
    // transparent: true,
    // opacity: 1,
    map: texture, //设置材质的颜色贴图
    side: THREE.DoubleSide,
  });

  //实例化一个网格模型，参数为缓冲几何体和网格模型材质
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};

// 保留演示 helper，供本页面调试 Three.js 基础对象时切换使用。
void createMesh;
void createGroup;
void setMeshColor;
void scaleIncreasing;
void createGUI;
void createPoints;
void createLine;
void createMeshWithVertices;
</script>

<style lang="scss" scoped>
// 导入当前目录下的index.scss样式文件
@use "./index";
</style>
