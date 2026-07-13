<template>
    <div class="elevation-map">
        <div ref="mapRef" class="map-container"></div>

        <div v-show="showElevationProfile && elevationPoints.length > 0" class="elevation-profile">
            <div class="profile-header">
                <span>📈 高程剖面</span>
                <el-button size="small" text @click="showElevationProfile = false">
                    隐藏
                </el-button>
            </div>
            <div ref="chartRef" class="profile-chart"></div>

            <div class="profile-stats">
                <div class="stat-item">
                    <span class="label">最高</span>
                    <span class="value max">{{ trackInfo.maxElevation }}m</span>
                </div>
                <div class="stat-item">
                    <span class="label">最低</span>
                    <span class="value min">{{ trackInfo.minElevation }}m</span>
                </div>
                <div class="stat-item">
                    <span class="label">爬升</span>
                    <span class="value">{{ trackInfo.ascent }}m</span>
                </div>
                <div class="stat-item">
                    <span class="label">距离</span>
                    <span class="value">{{ trackInfo.distance.toFixed(1) }}km</span>
                </div>
            </div>
        </div>

        <div class="map-controls">
            <el-button-group>
                <el-button :type="showElevationProfile ? 'primary' : ''"
                    @click="showElevationProfile = !showElevationProfile">
                    <el-icon>
                        <TrendCharts />
                    </el-icon>
                    高程
                </el-button>
                <el-button @click="resetView">
                    <el-icon>
                        <Refresh />
                    </el-icon>
                    重置
                </el-button>
                <el-button @click="handleClearTrack">
                    <el-icon>
                        <Delete />
                    </el-icon>
                    清除
                </el-button>
            </el-button-group>
        </div>

        <div v-if="hoveredPoint" class="hover-info">
            <div>海拔: {{ hoveredPoint.elevation }}m</div>
            <div>距起点: {{ hoveredPoint.distance.toFixed(2) }}km</div>
        </div>

        <div v-if="loading" class="loading-overlay">
            <el-icon class="is-loading">
                <Loading />
            </el-icon>
            <span>加载地图数据中...</span>
        </div>

        <div v-if="loadError" class="error-overlay">
            <el-icon>
                <Warning />
            </el-icon>
            <span>{{ loadError }}</span>
            <el-button size="small" @click="reloadGeoTIFF">重试</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { TrendCharts, Refresh, Delete, Loading, Warning } from '@element-plus/icons-vue'
import type { GeoJSONFeature, TrackPoint, TrackInfo, MapClickEvent, ElevationHoverEvent, GeoRaster, ColorMapConfig } from '@/typings/leaflet'
import { parseTrackData, calculateTrackInfo } from '@/utils/geo'
import { loadGeoTIFF, createGeoRasterLayer, getElevationAtPointAsync, getGeoRasterBounds, getGeoRasterStats, getElevationAtPoint } from '@/utils/geotiff'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

interface Props {
    tiffUrl?: string
    center?: [number, number]
    zoom?: number
    trackData?: GeoJSONFeature | null
    showElevation?: boolean
    colorMap?: Partial<ColorMapConfig>
}

const props = withDefaults(defineProps<Props>(), {
    tiffUrl: '',
    center: () => [39.9042, 116.4074],
    zoom: 13,
    trackData: null,
    showElevation: true,
    colorMap: () => ({})
})

const emit = defineEmits<{
    (e: 'point-hover', data: ElevationHoverEvent): void
    (e: 'map-click', data: MapClickEvent): void
    (e: 'track-loaded', info: TrackInfo): void
    (e: 'geotiff-loaded', georaster: GeoRaster): void
    (e: 'geotiff-error', error: string): void
}>()

const mapRef = ref<HTMLDivElement | null>(null)
const chartRef = ref<HTMLDivElement | null>(null)

const showElevationProfile = ref(props.showElevation)
const elevationPoints = ref<TrackPoint[]>([])
const hoveredPoint = ref<TrackPoint | null>(null)
const loading = ref(false)
const loadError = ref<string | null>(null)

const trackInfo = computed<TrackInfo>(() => {
    if (elevationPoints.value.length === 0) {
        return {
            name: '',
            distance: 0,
            maxElevation: 0,
            minElevation: 0,
            ascent: 0,
            descent: 0,
            startPoint: { lat: 0, lng: 0, elevation: 0, distance: 0 },
            endPoint: { lat: 0, lng: 0, elevation: 0, distance: 0 }
        }
    }
    return calculateTrackInfo(props.trackData!, elevationPoints.value)
})

let map: L.Map | null = null
let trackLayer: L.Polyline | null = null
let chart: echarts.ECharts | null = null
let heightMarker: L.Marker | null = null
let geoRasterLayer: L.Layer | null = null
let currentGeoRaster: GeoRaster | null = null

type LeafletDefaultIconPrototype = L.Icon.Default & {
    _getIconUrl?: unknown
}

type TooltipPoint = {
    value: [number, number]
}

type ChartMouseEvent = {
    componentType?: string
    dataIndex: number
}

const initMap = () => {
    if (!mapRef.value) return

    delete (L.Icon.Default.prototype as LeafletDefaultIconPrototype)._getIconUrl
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow
    })

    map = L.map(mapRef.value, {
        center: props.center,
        zoom: props.zoom,
        zoomControl: true,
        maxBoundsViscosity: 1.0
    })

    map.on('click', handleMapClick)

    if (props.tiffUrl) {
        loadGeoTIFFLayer()
    }
}

const loadGeoTIFFLayer = async () => {
    if (!props.tiffUrl || !map) {
        return
    }

    loading.value = true
    loadError.value = null

    if (geoRasterLayer) {
        map.removeLayer(geoRasterLayer)
        geoRasterLayer = null
    }

    try {
        const georaster = await loadGeoTIFF(props.tiffUrl)
        currentGeoRaster = georaster

        const stats = getGeoRasterStats(georaster)
        const colorMapConfig: Partial<ColorMapConfig> = {
            min: stats.min,
            max: stats.max,
            ...props.colorMap
        }

        geoRasterLayer = createGeoRasterLayer(georaster, colorMapConfig)
        geoRasterLayer.addTo(map!)

        const bounds = getGeoRasterBounds(georaster)
        map?.fitBounds(bounds)

        emit('geotiff-loaded', georaster)
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '加载 GeoTIFF 失败'
        loadError.value = errorMessage
        emit('geotiff-error', errorMessage)
        console.error('GeoTIFF 加载错误:', err)
    } finally {
        loading.value = false
    }
}

const reloadGeoTIFF = () => {
    loadGeoTIFFLayer()
}

const initChart = () => {
    if (!chartRef.value) return

    chart = echarts.init(chartRef.value)

    const option: echarts.EChartsOption = {
        tooltip: {
            trigger: 'axis',
            formatter: (params: unknown) => {
                if (!Array.isArray(params)) return ''
                const p = params[0] as TooltipPoint | undefined
                if (!p) return ''
                return `距离: ${p.value[0].toFixed(2)} km<br/>海拔: ${p.value[1]} m`
            }
        },
        grid: {
            left: 50,
            right: 20,
            top: 20,
            bottom: 30
        },
        xAxis: {
            type: 'value',
            name: 'km',
            nameLocation: 'middle',
            nameGap: 15,
            axisLabel: {
                fontSize: 10
            },
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            name: 'm',
            axisLabel: {
                fontSize: 10
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    opacity: 0.3
                }
            }
        },
        series: [
            {
                type: 'line',
                data: [] as [number, number][],
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    color: '#409eff',
                    width: 2
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(64, 158, 255, 0.5)' },
                        { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
                    ])
                }
            }
        ]
    }

    chart.setOption(option)

    chart.on('mousemove', (params: unknown) => {
        const chartParams = params as ChartMouseEvent
        if (chartParams.componentType === 'series') {
            const dataIndex = chartParams.dataIndex
            const point = elevationPoints.value[dataIndex]
            if (point) {
                hoveredPoint.value = point
                updateHeightMarker(point)
                emit('point-hover', {
                    point,
                    elevation: point.elevation,
                    distance: point.distance
                })
            }
        }
    })

    chart.on('mouseout', () => {
        hoveredPoint.value = null
        removeHeightMarker()
    })

    window.addEventListener('resize', handleResize)
}

const updateHeightMarker = (point: TrackPoint) => {
    removeHeightMarker()

    heightMarker = L.marker([point.lat, point.lng], {
        icon: L.divIcon({
            className: 'height-marker',
            html: `<div class="marker-content">${point.elevation}m</div>`,
            iconSize: [50, 20],
            iconAnchor: [25, 10]
        })
    }).addTo(map!)
}

const removeHeightMarker = () => {
    if (heightMarker) {
        map?.removeLayer(heightMarker)
        heightMarker = null
    }
}

const updateChart = () => {
    if (!chart || elevationPoints.value.length === 0) return

    const data: [number, number][] = elevationPoints.value.map((p) => [
        p.distance,
        p.elevation
    ])

    const color = props.trackData?.properties?.color || '#409eff'

    chart.setOption({
        series: [
            {
                data,
                lineStyle: { color },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: color + '80' },
                        { offset: 1, color: color + '20' }
                    ])
                }
            }
        ]
    })
}

const loadTrack = (geoJSON: GeoJSONFeature) => {
    handleClearTrack()

    if (!geoJSON) return

    const points = parseTrackData(geoJSON)

    if (currentGeoRaster) {
        const enhancedPoints = points.map(p => ({
            ...p,
            elevation: getElevationAtPoint(currentGeoRaster!, p.lat, p.lng) ?? p.elevation
        }))
        elevationPoints.value = enhancedPoints
    } else {
        elevationPoints.value = points
    }

    if (elevationPoints.value.length < 2) return

    const latLngs: L.LatLngExpression[] = elevationPoints.value.map((p) => [p.lat, p.lng])
    const color = geoJSON.properties?.color || '#409eff'

    trackLayer = L.polyline(latLngs, {
        color,
        weight: 4,
        opacity: 0.8
    }).addTo(map!)

    const info = trackInfo.value
    trackLayer.bindPopup(`
    <div>
      <strong>${info.name}</strong><br>
      距离: ${info.distance.toFixed(2)} km<br>
      最高: ${info.maxElevation} m<br>
      最低: ${info.minElevation} m
    </div>
  `)

    map?.fitBounds(trackLayer.getBounds())

    updateChart()

    emit('track-loaded', info)
}

const handleClearTrack = () => {
    if (trackLayer) {
        map?.removeLayer(trackLayer)
        trackLayer = null
    }

    elevationPoints.value = []
    hoveredPoint.value = null
    removeHeightMarker()

    if (chart) {
        chart.setOption({ series: [{ data: [] }] })
    }
}

const resetView = () => {
    if (currentGeoRaster) {
        const bounds = getGeoRasterBounds(currentGeoRaster)
        map?.fitBounds(bounds)
    } else if (trackLayer) {
        map?.fitBounds(trackLayer.getBounds())
    } else {
        map?.setView(props.center, props.zoom)
    }
}

const handleMapClick = async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng
    const elevation = currentGeoRaster && props.tiffUrl
        ? await getElevationAtPointAsync(currentGeoRaster, lat, lng, props.tiffUrl)
        : null

    const marker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'click-marker',
            html: `<div class="marker-label">${elevation !== null ? elevation + 'm' : 'N/A'}</div>`,
            iconSize: [50, 20]
        })
    }).addTo(map!)

    marker
        .bindPopup(
            `
    <div style="text-align:center">
      <strong>位置信息</strong><br>
      坐标: ${lat.toFixed(4)}, ${lng.toFixed(4)}<br>
      海拔: <b>${elevation !== null ? elevation + 'm' : '无数据'}</b>
    </div>
  `
        )
        .openPopup()

    setTimeout(() => marker.remove(), 5000)

    emit('map-click', { lat, lng, elevation: elevation ?? 0 })
}

const handleResize = () => {
    chart?.resize()
}

watch(
    () => props.trackData,
    (newVal) => {
        if (newVal) {
            loadTrack(newVal)
        }
    },
    { immediate: true }
)

watch(() => props.tiffUrl, () => {
    if (map) {
        loadGeoTIFFLayer()
    }
})

defineExpose({
    loadTrack,
    clearTrack: handleClearTrack,
    resetView,
    getMap: () => map,
    getTrackInfo: () => trackInfo.value,
    getGeoRaster: () => currentGeoRaster,
    reloadGeoTIFF
})

onMounted(() => {
    initMap()
    nextTick(() => {
        initChart()
    })
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    chart?.dispose()
    map?.remove()
    currentGeoRaster = null
    geoRasterLayer = null
})
</script>

<style scoped>
.elevation-map {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 500px;
}

.map-container {
    width: 100%;
    height: 100%;
}

.elevation-profile {
    position: absolute;
    bottom: 20px;
    left: 20px;
    width: 500px;
    max-width: calc(100% - 40px);
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    overflow: hidden;
}

.profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    font-weight: 500;
}

.profile-chart {
    height: 150px;
    padding: 10px;
}

.profile-stats {
    display: flex;
    justify-content: space-around;
    padding: 10px;
    background: #fafafa;
    border-top: 1px solid #eee;
}

.stat-item {
    text-align: center;
}

.stat-item .label {
    display: block;
    font-size: 12px;
    color: #999;
}

.stat-item .value {
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.stat-item .value.max {
    color: #f56c6c;
}

.stat-item .value.min {
    color: #67c23a;
}

.map-controls {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
}

.hover-info {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1000;
    background: white;
    padding: 10px 15px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    font-size: 14px;
}

.hover-info div+div {
    margin-top: 4px;
}

.loading-overlay,
.error-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
    z-index: 1000;
    gap: 10px;
}

.loading-overlay .el-icon {
    font-size: 32px;
    color: #409eff;
}

.error-overlay {
    color: #f56c6c;
}

.error-overlay .el-icon {
    font-size: 32px;
}

:deep(.height-marker),
:deep(.click-marker) {
    background: transparent;
}

:deep(.marker-content),
:deep(.marker-label) {
    background: #409eff;
    color: white;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
