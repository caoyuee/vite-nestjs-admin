// src/utils/geo.ts
import type { TrackPoint, TrackInfo, GeoJSONFeature } from '@/typings/leaflet'

/**
 * 计算两点间距离（公里）
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // 地球半径（km）
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * 解析 GeoJSON 轨迹数据
 */
export function parseTrackData(geoJSON: GeoJSONFeature): TrackPoint[] {
  const coords = geoJSON.geometry.coordinates
  if (!coords || coords.length === 0) return []

  const points: TrackPoint[] = []
  let distance = 0

  for (let i = 0; i < coords.length; i++) {
    const [lng, lat, elevation = 0] = coords[i]

    if (i > 0) {
      const prev = coords[i - 1]
      distance += calculateDistance(lat, lng, prev[1], prev[0])
    }

    points.push({
      lat,
      lng,
      elevation,
      distance
    })
  }

  return points
}

/**
 * 计算轨迹统计信息
 */
export function calculateTrackInfo(
  geoJSON: GeoJSONFeature,
  points: TrackPoint[]
): TrackInfo {
  if (points.length === 0) {
    return {
      name: geoJSON.properties?.name || '未命名',
      distance: 0,
      maxElevation: 0,
      minElevation: 0,
      ascent: 0,
      descent: 0,
      startPoint: { lat: 0, lng: 0, elevation: 0, distance: 0 },
      endPoint: { lat: 0, lng: 0, elevation: 0, distance: 0 }
    }
  }

  const elevations = points.map(p => p.elevation)
  let ascent = 0
  let descent = 0

  for (let i = 1; i < elevations.length; i++) {
    const diff = elevations[i] - elevations[i - 1]
    if (diff > 0) {
      ascent += diff
    } else {
      descent += Math.abs(diff)
    }
  }

  return {
    name: geoJSON.properties?.name || '未命名',
    distance: points[points.length - 1].distance,
    maxElevation: Math.max(...elevations),
    minElevation: Math.min(...elevations),
    ascent: Math.round(ascent),
    descent: Math.round(descent),
    startPoint: points[0],
    endPoint: points[points.length - 1]
  }
}

/**
 * 获取最近的高程点
 */
export function getNearestElevation(
  points: TrackPoint[],
  lat: number,
  lng: number
): number {
  if (points.length === 0) {
    // 默认值（模拟）
    return Math.round(50 + Math.sin(lat * 10) * Math.cos(lng * 10) * 30)
  }

  let minDist = Infinity
  let nearestEle = points[0].elevation

  for (const p of points) {
    const d = Math.sqrt((lat - p.lat) ** 2 + (lng - p.lng) ** 2)
    if (d < minDist) {
      minDist = d
      nearestEle = p.elevation
    }
  }

  return nearestEle
}