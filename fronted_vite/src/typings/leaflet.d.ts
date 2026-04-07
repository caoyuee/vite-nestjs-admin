export interface GeoJSONFeature {
  type: 'Feature'
  properties: {
    name?: string
    description?: string
    color?: string
    [key: string]: any
  }
  geometry: {
    type: 'LineString'
    coordinates: number[][]
  }
}

export interface TrackPoint {
  lat: number
  lng: number
  elevation: number
  distance: number
}

export interface TrackInfo {
  name: string
  distance: number
  maxElevation: number
  minElevation: number
  ascent: number
  descent: number
  startPoint: TrackPoint
  endPoint: TrackPoint
}

export interface MapClickEvent {
  lat: number
  lng: number
  elevation: number
}

export interface ElevationHoverEvent {
  point: TrackPoint
  elevation: number
  distance: number
}

export interface GeoRaster {
  xmin: number
  xmax: number
  ymin: number
  ymax: number
  width: number
  height: number
  values: number[][][]
  noDataValue?: number | null
  projection?: number
  pixelWidth?: number
  pixelHeight?: number
}

export interface GeoTIFFConfig {
  url: string
  minZoom?: number
  maxZoom?: number
  opacity?: number
  colorMap?: ColorMapConfig
}

export interface ColorMapConfig {
  min: number
  max: number
  colors: string[]
  noDataValue?: number | null
}

export interface GeoTIFFLoadResult {
  georaster: GeoRaster
  layer: L.Layer
}

export interface GeoRasterStats {
  min: number
  max: number
  mean: number
}

export interface BaseMapProps {
  center?: [number, number]
  zoom?: number
  tiffUrl?: string
  maxZoom?: number
  minZoom?: number
  colorMap?: Partial<ColorMapConfig>
}

export interface ElevationMapProps {
  tiffUrl?: string
  center?: [number, number]
  zoom?: number
  trackData?: GeoJSONFeature | null
  showElevation?: boolean
  colorMap?: Partial<ColorMapConfig>
}

export type LeafletMap = L.Map
export type LeafletPolyline = L.Polyline
export type LeafletMarker = L.Marker
