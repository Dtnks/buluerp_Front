<template>
    <div id="webgl" ref="webgl" class="three-container">
    </div>
</template>
<script setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

const webgl = ref(null)
let animationId = null
let renderer = null
let camera = null
let resizeObserver = null

const props = defineProps({
  modelUrl: {
    type: String,
    default: ''
  }
})
onMounted(() => {
  if (!webgl.value) return
  
  // 动态获取容器的宽高，而不是写死 800x600
  const width = webgl.value.clientWidth
  const height = webgl.value.clientHeight
  
  //场景
  const scene = new THREE.Scene()
  scene.background = null 
  
  //相机
  camera = new THREE.PerspectiveCamera(30, width/height, 1, 3000)
  camera.position.set(100, 100, 100)
  camera.lookAt(0, 10, 1)
  
  //渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)

  webgl.value.appendChild(renderer.domElement)
  // 1. 环境光：提供基础亮度，保证暗部不至于全黑
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4) 
  scene.add(ambientLight)
  
  // 2. 主光源 (平行光)：模拟太阳光，产生强烈的明暗对比
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(50, 100, 50) // 从斜上方照射
  scene.add(directionalLight)

  // 3. 辅助光源 (点光源)：用来打亮侧面，增加立体感
  const pointLight = new THREE.PointLight(0xffffff, 0.5)
  pointLight.position.set(-50, 50, -50)
  scene.add(pointLight)
  // 添加控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.addEventListener('change', () => {
    renderer.render(scene, camera)
  })
  controls.enableDamping = true

  const geometryBox = new THREE.BoxGeometry(10, 10, 10)
  const materialBox = new THREE.MeshLambertMaterial({
    color: 0x0000ff,
    transparent: true,
  })
  const cube = new THREE.Mesh(geometryBox, materialBox)
  cube.position.set(0, 10, 0)
  scene.add(cube)

  let loadedMesh = null

  // 抽取加载模型的逻辑到一个单独的函数中
  const loadModel = () => {
    // 如果已经加载了模型，先从场景中移除并清理内存
    if (loadedMesh) {
      scene.remove(loadedMesh)
      if (loadedMesh.geometry) loadedMesh.geometry.dispose()
      if (loadedMesh.material) {
        if (Array.isArray(loadedMesh.material)) {
          loadedMesh.material.forEach(m => m.dispose())
        } else {
          loadedMesh.material.dispose()
        }
      }
      loadedMesh = null
    }

    // 重新显示备用立方体（加载中状态）
    cube.visible = true

    const loader = new GLTFLoader()
    const modelPath = props.modelUrl
    console.log(modelPath)
    
    loader.load(modelPath, (gltf) => {
      const model = gltf.scene
      scene.add(model)
      loadedMesh = model
      cube.visible = false
    }, undefined, (error) => {
      console.warn('GLTFLoader 模型加载失败，显示绿色立方体代替。', error)
    })
  }
  loadModel()
  // 监听属性变化，如果 URL 改变了重新加载
  watch(() => props.modelUrl, (newUrl) => {
    if (newUrl) {
      loadModel()
    }
  })

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    controls.update()
    if (loadedMesh) {
      loadedMesh.rotateY(0.01)
    } else {
      cube.rotateY(0.01) 
    }
    renderer.render(scene, camera)
  }
  animate()

  // 使用 ResizeObserver 监听容器尺寸变化（解决弹窗中由于动画导致初始尺寸为0的问题）
  resizeObserver = new ResizeObserver(() => {
    onWindowResize()
  })
  resizeObserver.observe(webgl.value)
})

const onWindowResize = () => {
  if (!webgl.value || !camera || !renderer) return
  const width = webgl.value.clientWidth
  const height = webgl.value.clientHeight
  // 如果容器还没有渲染出来（宽或高为0），则跳过
  if (width === 0 || height === 0) return

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
  if (resizeObserver && webgl.value) resizeObserver.disconnect()
})
</script>
<style scoped>
.three-container {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}
</style>