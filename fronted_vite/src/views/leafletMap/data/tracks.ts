// src/data/tracks.ts
import type { GeoJSONFeature } from '@/typings/leaflet'

// 简单路线：武汉市区公园短程步道（示例）
export const simpleTrack: GeoJSONFeature = {
  type: 'Feature',
  properties: {
    name: '武汉市区短程步道',
    description: '武汉市区公园内的平缓步道，适合休闲散步',
    color: '#409eff'
  },
  geometry: {
    type: 'LineString',
    coordinates: [
      [114.305, 30.593, 25],
      [114.307, 30.595, 28],
      [114.310, 30.5965, 30],
      [114.312, 30.598, 32],
      [114.314, 30.600, 29]
    ]
  }
}

// 困难路线：武当山登山路线（示例）
export const hardTrack: GeoJSONFeature = {
  type: 'Feature',
  properties: {
    name: '武当山登山路线',
    description: '武当山区域的中长距离登山路线，包含起伏较大的海拔变化',
    color: '#e74c3c'
  },
  geometry: {
    type: 'LineString',
    coordinates: [
      [111.000, 32.400, 200],
      [111.002, 32.405, 320],
      [111.005, 32.410, 450],
      [111.010, 32.415, 620],
      [111.015, 32.420, 780],
      [111.020, 32.425, 950]
    ]
  }
}

// 经典路线示例：三峡区域路线（示例）
export const greatWallTrack: GeoJSONFeature = {
  type: 'Feature',
  properties: {
    name: '三峡示例路线',
    description: '三峡地区的经典山地路线示例',
    color: '#f39c12'
  },
  geometry: {
    type: 'LineString',
    coordinates: [
      [110.800, 31.000, 300],
      [110.802, 31.003, 420],
      [110.805, 31.006, 560],
      [110.808, 31.009, 720],
      [110.810, 31.012, 860]
    ]
  }
}

export const allTracks = [simpleTrack, hardTrack, greatWallTrack]