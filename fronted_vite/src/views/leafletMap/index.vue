<template>
  <div class="map-page">
    <div class="toolbar">
      <h2>🗺️ 带海拔的离线地图</h2>
      <div class="actions">
        <el-select style="width: 240px;" v-model="selectedProvince" placeholder="选择省份" @change="handleProvinceChange">
          <el-option v-for="province in provinceOptions" :key="province.key" :label="province.name"
            :value="province.key" />
        </el-select>
        <el-select style="width: 240px;" v-model="selectedTrack" placeholder="选择轨迹" @change="handleTrackChange">
          <el-option v-for="track in trackOptions" :key="track.name" :label="track.name" :value="track.key" />
        </el-select>
        <el-button type="danger" @click="handleClear">清除</el-button>
      </div>
    </div>

    <div class="map-wrapper">
      <ElevationMap ref="mapRef" :tiff-url="tiffUrl" :track-data="currentTrack" :show-elevation="true" :center="center"
        :zoom="zoom" @track-loaded="handleTrackLoaded" @point-hover="handlePointHover" @map-click="handleMapClick"
        @geotiff-loaded="handleGeoTIFFLoaded" @geotiff-error="handleGeoTIFFError" />
    </div>

    <div class="info-panel">
      <el-card v-if="currentTrackInfo.name" class="track-card">
        <template #header>
          <div class="card-header">
            <span>📍 {{ currentTrackInfo.name }}</span>
          </div>
        </template>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">距离</span>
            <span class="value">{{ currentTrackInfo.distance.toFixed(2) }} km</span>
          </div>
          <div class="info-item">
            <span class="label">最高海拔</span>
            <span class="value max">{{ currentTrackInfo.maxElevation }} m</span>
          </div>
          <div class="info-item">
            <span class="label">最低海拔</span>
            <span class="value min">{{ currentTrackInfo.minElevation }} m</span>
          </div>
          <div class="info-item">
            <span class="label">累计爬升</span>
            <span class="value">{{ currentTrackInfo.ascent }} m</span>
          </div>
          <div class="info-item">
            <span class="label">累计下降</span>
            <span class="value">{{ currentTrackInfo.descent }} m</span>
          </div>
        </div>
      </el-card>

      <el-card v-if="hoverInfo" class="hover-card">
        <template #header>
          <span>🎯 当前信息</span>
        </template>
        <div class="hover-info">
          <div>海拔: <strong>{{ hoverInfo.elevation }}m</strong></div>
          <div>距起点: <strong>{{ hoverInfo.distance.toFixed(2) }}km</strong></div>
        </div>
      </el-card>

      <el-alert v-if="!tiffUrl" title="GeoTIFF 未配置" type="warning" :closable="false" show-icon>
        <template #default>
          请配置 GeoTIFF 数据 URL
        </template>
      </el-alert>

      <el-alert v-if="geoTIFFError" :title="geoTIFFError" type="error" :closable="false" show-icon />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import ElevationMap from './components/ElevationMap.vue'
import { simpleTrack, hardTrack, greatWallTrack } from './data/tracks'
import type { GeoJSONFeature, TrackInfo, ElevationHoverEvent, MapClickEvent, GeoRaster } from '@/typings/leaflet'

// 四省地图数据配置
const provinceConfig = {
  hubei: {
    name: '湖北',
    tiffUrl: 'http://127.0.0.1:3000/resource/tiles/hubei_wgs84_cog.tif',
    center: [30.5, 112.3] as [number, number],
    zoom: 7
  },
  hunan: {
    name: '湖南',
    tiffUrl: 'http://127.0.0.1:3000/resource/tiles/hunan.tif',
    center: [28.2, 112.9] as [number, number],
    zoom: 7
  },
  henan: {
    name: '河南',
    tiffUrl: 'http://127.0.0.1:3000/resource/tiles/henan.tif',
    center: [34.8, 113.6] as [number, number],
    zoom: 7
  },
  jiangxi: {
    name: '江西',
    tiffUrl: 'http://127.0.0.1:3000/resource/tiles/jiangxi.tif',
    center: [27.9, 115.9] as [number, number],
    zoom: 7
  }
}

type ProvinceKey = keyof typeof provinceConfig

const provinceOptions = [
  { key: 'hubei', name: '湖北' },
  { key: 'hunan', name: '湖南' },
  { key: 'henan', name: '河南' },
  { key: 'jiangxi', name: '江西' }
]

const selectedProvince = ref<ProvinceKey>('hubei')
const tiffUrl = ref(provinceConfig.hubei.tiffUrl)
const center = ref(provinceConfig.hubei.center)
const zoom = ref(provinceConfig.hubei.zoom)

const mapRef = ref<InstanceType<typeof ElevationMap> | null>(null)

const currentTrack = ref<GeoJSONFeature | null>(null)
const selectedTrack = ref<string>('')
const geoTIFFError = ref<string | null>(null)

const trackOptions = [
  { key: 'simple', name: '简单路线', track: simpleTrack },
  { key: 'hard', name: '困难路线', track: hardTrack },
  { key: 'greatWall', name: '长城路线', track: greatWallTrack }
]

const currentTrackInfo = reactive<TrackInfo>({
  name: '',
  distance: 0,
  maxElevation: 0,
  minElevation: 0,
  ascent: 0,
  descent: 0,
  startPoint: { lat: 0, lng: 0, elevation: 0, distance: 0 },
  endPoint: { lat: 0, lng: 0, elevation: 0, distance: 0 }
})

const hoverInfo = ref<ElevationHoverEvent | null>(null)

const hasTIFF = computed(() => {
  return !!tiffUrl.value
})

// 切换省份
const handleProvinceChange = (key: ProvinceKey) => {
  const config = provinceConfig[key]
  tiffUrl.value = config.tiffUrl
  center.value = config.center
  zoom.value = config.zoom
  geoTIFFError.value = null

  // 清除当前轨迹
  handleClearTrack()
}

const handleTrackChange = (key: string) => {
  const option = trackOptions.find((t) => t.key === key)
  if (option) {
    currentTrack.value = option.track
    mapRef.value?.loadTrack(option.track)
  }
}

const handleTrackLoaded = (info: TrackInfo) => {
  Object.assign(currentTrackInfo, info)
}

const handlePointHover = (data: ElevationHoverEvent) => {
  hoverInfo.value = data
}

const handleMapClick = (data: MapClickEvent) => {
  console.log('点击位置:', data)
}

const handleGeoTIFFLoaded = (georaster: GeoRaster) => {
  geoTIFFError.value = null
  console.log('GeoTIFF 加载成功:', georaster)
}

const handleGeoTIFFError = (error: string) => {
  geoTIFFError.value = error
  console.error('GeoTIFF 加载失败:', error)
}

const handleClearTrack = () => {
  currentTrack.value = null
  selectedTrack.value = ''
  mapRef.value?.clearTrack()

  Object.assign(currentTrackInfo, {
    name: '',
    distance: 0,
    maxElevation: 0,
    minElevation: 0,
    ascent: 0,
    descent: 0
  })
  hoverInfo.value = null
}

const handleClear = () => {
  handleClearTrack()
  mapRef.value?.resetView()
}
</script>

<style scoped>
.map-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  background: #f5f7fa;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.toolbar h2 {
  margin: 0;
}

.actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.map-wrapper {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  background: white;
}

.info-panel {
  position: absolute;
  top: 80px;
  right: 40px;
  width: 260px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.track-card .card-header {
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.info-item {
  text-align: center;
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
}

.info-item .label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.info-item .value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.info-item .value.max {
  color: #f56c6c;
}

.info-item .value.min {
  color: #67c23a;
}

.hover-card .hover-info {
  text-align: center;
}

.hover-card .hover-info div {
  padding: 5px 0;
}

.hover-card .hover-info strong {
  color: #409eff;
  font-size: 18px;
}

.el-alert code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
}
</style>
